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
          logger.debug(s"Request $request succeeded with header ${request.headerMap}")
              parse(response.getContentString()).toValidated.toValidatedNel andThen {
              json: Json => {
                val out = json.as[MatrixSkills].toValidated.toValidatedNel
                logger.debug(s"$out")
                out
              }
            } valueOr {
              failures =>
                val errormsg = s"Unexpected response from Skill-Matrix api, Parsing failures: $failures, Response Status: ${response.statusCode}, Response: ${response.contentString}"
                logger.error(errormsg)
                throw new Exception(errormsg)
            }
        case response: Response if response.status == Status.NotFound =>
          logger.debug(s"Request $request failed with header ${request.headerMap} and USER_NOT_FOUND")
          MatrixSkills(Seq())
        case response =>
          logger.debug(s"Request $request failed with header ${request.headerMap} Response Status: ${response.statusCode}, Response: ${response.contentString} ")
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
