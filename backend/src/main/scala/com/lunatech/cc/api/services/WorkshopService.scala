package com.lunatech.cc.api.services

import com.twitter.util.Future
import com.twitter.finagle.http.{ Request, RequestBuilder, Response }
import com.twitter.finagle.{ Http, Service }
import com.twitter.util.Duration
import io.circe._
import io.circe.parser._
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import scala.util.control.NonFatal

trait WorkshopService {
  import WorkshopService._

  def listWorkshops: Future[Vector[Workshop]]
}

object WorkshopService {
  final case class Config(name: String, token: String)

  final case class Workshop(
      eventDetails: EventDetails,
      ticketDetails: TicketDetails)

  final case class EventDetails(
    id: String,
    name: String,
    description: String,
    url: String,
    logoUrl: Option[String],
    location: String,
    date: String,
    startTime: String,
    endTime: String)

  final case class TicketDetails(
    totalTickets: Int,
    availableTickets: Int)


}

object EventBriteWorkshopService {

  def apply(config: StudentService.Config): EventBriteWorkshopService = {
    val eventBriteToken = config.token

    val client = Http.client
      .withRequestTimeout(Duration.fromSeconds(15))
      .withTls("www.eventbriteapi.com") // Fix config
      .newService(config.name, "workshops-service")

    new EventBriteWorkshopService(eventBriteToken, client)

  }
  import WorkshopService._

  implicit val eventDetailsDecoder: Decoder[EventDetails] = new Decoder[EventDetails] {
    implicit val LocalDateTimeDecoder: Decoder[LocalDateTime] = Decoder[String].flatMap { value =>
       try {
         Decoder.const(LocalDateTime.parse(value))
       } catch {
         case NonFatal(_) => Decoder.failed(DecodingFailure("Invalid LocalDateTime", Nil))
       }
     }
    val dateFormatter = DateTimeFormatter.ofPattern("MMMM d")
    val timeFormatter = DateTimeFormatter.ofPattern("HH:mm")

    private def getLocation(description: String) = {
      val lowerDesc = description.toLowerCase
      if(lowerDesc contains "rotterdam") "Rotterdam"
      else if(lowerDesc contains "amsterdam") "Amserdam"
      else "See Details"
    }

    final def apply(c: HCursor): Decoder.Result[EventDetails] =
      for {
        id <- (c.downField("id").as[String])
        name <- (c.downField("name").downField("text")).as[String]
        description <- (c.downField("description").downField("text")).as[String]
        vanityUrl <- (c.downField("vanity_url")).as[Option[String]]
        url <- c.downField("url").as[String]
        logoUrl <- (c.downField("logo").downField("url")).as[Option[String]]
        startDate <- (c.downField("start").downField("local")).as[LocalDateTime]
        endDate <- (c.downField("end").downField("local")).as[LocalDateTime]
      } yield EventDetails(
        id = id,
        name = name,
        description = description.split("\n")(0),
        url = vanityUrl.getOrElse(url),
        logoUrl = logoUrl,
        location = getLocation(description),
        date = startDate.format(dateFormatter),
        startTime = startDate.format(timeFormatter),
        endTime = endDate.format(timeFormatter))
  }

  implicit val ticketDetailsDecoder: Decoder[TicketDetails] = new Decoder[TicketDetails] {

    final def apply(c: HCursor): Decoder.Result[TicketDetails] =
      for {
        quantityTotal <- (c.downField("quantity_total").as[Int])
        quantityAvailable <- (c.downField("quantity_sold").as[Int].map(quantityTotal - _))
      } yield TicketDetails(quantityTotal, quantityAvailable)
  }
}

class EventBriteWorkshopService(eventBriteToken: String, client: Service[Request, Response]) extends WorkshopService {
  import WorkshopService._
  import EventBriteWorkshopService._

  private def getLiveWorkshops(): Future[List[EventDetails]] = {
    val request = RequestBuilder()
      .url(s"https://www.eventbriteapi.com/v3/users/me/owned_events/?token=$eventBriteToken&status=live")
      .buildGet()
    request.host = "www.eventbriteapi.com"

    for {
      response <- client(request)
      _ = assert(response.statusCode == 200)
      json <- parse(response.getContentString).fold(
        parsingFailure => Future.exception(new Throwable(parsingFailure.getMessage)),
        Future.value)
      eventDetails <- json.hcursor.downField("events").as[List[EventDetails]].fold(
        decodingFailure => Future.exception(new Throwable(decodingFailure)),
        Future.value)
    } yield eventDetails

  }

  private def getTicketDetails(eventId: String): Future[TicketDetails] = {
    val request = RequestBuilder()
      .url(s"https://www.eventbriteapi.com/v3/events/${eventId}/ticket_classes/?token=$eventBriteToken")
      .buildGet
    request.host = "www.eventbriteapi.com"

    for {
      response <- client(request)
      _ = assert(response.statusCode == 200)
      json <- parse(response.getContentString).fold(
        parsingFailure => Future.exception(new Throwable(parsingFailure.getMessage)),
        Future.value)
      ticketDetails <- (json.hcursor.downField("ticket_classes").downN(0)).as[TicketDetails].fold( // TODO, sum over all ticket_classes instead?
        decodingFailure => Future.exception(new Throwable(decodingFailure)),
        Future.value)
    } yield ticketDetails
  }

  override def listWorkshops: Future[Vector[Workshop]] = {

    for {
      eventDetails: Seq[EventDetails] <- getLiveWorkshops()
      ticketDetails: Seq[TicketDetails] <- Future.collect(eventDetails.map { event => getTicketDetails(event.id) })
    } yield (eventDetails zip ticketDetails).toVector.map { case (e, t) => Workshop(e, t) }

  }

}
