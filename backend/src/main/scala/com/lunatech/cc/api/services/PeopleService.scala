package com.lunatech.cc.api.services

import com.twitter.finagle.{Http, Service}
import com.twitter.finagle.http.{Request, RequestBuilder, Response, Status}
import com.twitter.util.{Duration, Future}
import com.typesafe.config.Config
import io.circe._
import io.circe.parser._
import io.circe.generic.auto._
import cats.implicits._

trait PeopleService {
  def findAll: Future[Seq[Person]]

  def findByRole(role: String): Future[Seq[Person]]
}

class ApiPeopleService(apiKey: String, client: Service[Request, Response]) extends PeopleService {
  override def findAll: Future[Seq[Person]] = {
    //TODO check why getting 404 when full url is not specified
    //    val request = Request(Request.queryString("/people",Map("apiKey" -> apiKey)))

    val request = RequestBuilder()
      .url(Request.queryString("http://lunatech-people-api.cleverapps.io:80/people", Map("apiKey" -> apiKey)))
      .buildGet()

    client(request)
      .map {
        case response: Response if response.status == Status.Ok =>
          parse(response.getContentString()).toValidated.toValidatedNel andThen {
            json: Json => json.as[Seq[Person]].toValidated.toValidatedNel
          } valueOr {
            failures =>
              //TODO log the errors
              //failures.map(failure => logger.error(failure.getMessage))
              throw new Exception(s"Unexpected response from people api, Response Status: ${response.statusCode}, Response: ${response.toString}")
          }
        case response =>
          throw new Exception(s"Unexpected response from people api, Response Status: ${response.statusCode}, Response: ${response.toString}")
      }
  }

  override def findByRole(role: String): Future[Seq[Person]] = {
    findAll.map(_.filter(_.roles.contains(role)))
  }
}

object ApiPeopleService {
  def apply(config: Config): ApiPeopleService = {
    val client = Http.client
      .withRequestTimeout(Duration.fromSeconds(15))
      .newService(config.getString("services.people.name"), "people-api")

    new ApiPeopleService(config.getString("services.people.apiKey"), client)
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
