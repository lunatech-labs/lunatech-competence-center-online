package com.lunatech.cc.api.services

import com.twitter.finagle.{Http, Service}
import com.twitter.finagle.http.{Request, RequestBuilder, Response, Status}
import com.twitter.util.{Duration, Future}
import com.typesafe.config.Config
import io.circe._
import io.circe.parser._
import io.circe.generic.auto._
import cats.implicits._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

trait PeopleService {
  def findAll: Future[Seq[Person]]
  def findByRole(role: String): Future[Seq[Person]]
  def findByEmail(email: String): Future[Option[Person]]
}

object PeopleService {
  case class Config(name: String, apiKey: String)
}

class ApiPeopleService(apiKey: String, client: Service[Request, Response]) extends PeopleService {

  lazy val logger: Logger = getLogger(getClass)

  override def findAll: Future[Seq[Person]] = {
    //TODO check why getting 404 when full url is not specified

    val request = RequestBuilder()
      .url(s"http://people.lunatech.com:80/api/people?apiKey=$apiKey")
      .buildGet()

    client(request)
      .map {
        case response: Response if response.status == Status.Ok =>
         ApiPeopleService.parseResponse[Seq[Person]](response)
        case response =>
          logger.error(s"Request $request failed with header ${request.headerMap} and body ")
          throw new Exception(s"Unexpected response from people api, Response Status: ${response.statusCode}, Response: ${response.contentString}")
      }
  }

  override def findByRole(role: String): Future[Seq[Person]] = {
    findAll.map(_.filter(_.roles.contains(role)))
  }

  override def findByEmail(email: String): Future[Option[Person]] = {
    val request = RequestBuilder()
      .url(s"http://people.lunatech.com:80/api/people/${email}?apiKey=$apiKey")
      .buildGet()

    client(request)
    .map {
      case response: Response if response.status == Status.Ok =>
        ApiPeopleService.parseResponse[Option[Person]](response)
      case response =>
        logger.error(s"Request $request failed with header ${request.headerMap} and body ")
        throw new Exception(s"Unexpected response from people api, Response Status: ${response.statusCode}, Response: ${response.contentString}")
      }
  }
}

object ApiPeopleService {
  def apply(config: PeopleService.Config): ApiPeopleService = {
    val client = Http.client
      .withRequestTimeout(Duration.fromSeconds(15))
      .newService(config.name, "people-api")

    new ApiPeopleService(config.apiKey, client)
  }

  def parseResponse[A](response:Response)(implicit decoder: Decoder[A]) = parse(response.getContentString()).toValidatedNel andThen {
    json: Json => json.as[A].toValidatedNel
  } valueOr {
    failures =>
      val errormsg = s"Unexpected response from people api, Parsing failures: $failures, Response Status: ${response.statusCode}, Response: ${response.contentString}"
      throw new Exception(errormsg)
  }
}

final case class Person(
                         email: String,
                         name: PersonName,
                         roles: Set[String]
                       )

final case class PersonName(fullName: String,
                            familyName: String,
                            givenName: String)
