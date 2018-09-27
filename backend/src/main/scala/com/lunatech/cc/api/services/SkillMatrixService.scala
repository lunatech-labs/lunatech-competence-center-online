package com.lunatech.cc.api.services

import com.twitter.finagle.{Http, Service}
import com.twitter.finagle.http.{Request, RequestBuilder, Response, Status}
import com.twitter.util.{Duration, Future}
import io.circe._
import io.circe.parser._
import io.circe.generic.auto._
import cats.implicits._
import com.lunatech.cc.models.MatrixSkills
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

trait SkillMatrixService {
  def findByEmail(email: String): Future[MatrixSkills]
}

object SkillMatrixService {
  case class Config(name: String, apiKey: String)
}

class ApiSkillMatrixService(apiKey: String, client: Service[Request, Response]) extends SkillMatrixService {

  lazy val logger: Logger = getLogger(getClass)

  override def findByEmail(email: String): Future[MatrixSkills] = {
    val request = RequestBuilder()
      .url(s"http://techmatrix.lunatech.com/users/skills/${email}")
      .addHeader("X-ID-TOKEN",apiKey)
      .buildGet()

    client(request)
      .map {
        case response: Response if response.status == Status.Ok =>
          parse(response.getContentString()).toValidated.toValidatedNel andThen {
            json: Json => json.as[MatrixSkills].toValidated.toValidatedNel
          } valueOr {
            failures =>
              val errormsg = s"Unexpected response from people api, Parsing failures: $failures, Response Status: ${response.statusCode}, Response: ${response.contentString}"
              logger.error(errormsg)
              throw new Exception(errormsg)
          }
        case response =>
          logger.warn(s"Request $request failed with header ${request.headerMap} and body ")
          MatrixSkills(Seq())
      }
  }
}

object ApiSkillMatrixService {
  def apply(config: SkillMatrixService.Config): ApiSkillMatrixService = {
    val client = Http.client
      .withRequestTimeout(Duration.fromSeconds(15))
      .newService(config.name, "skill-matrix-api")

    new ApiSkillMatrixService(config.apiKey, client)
  }
}
