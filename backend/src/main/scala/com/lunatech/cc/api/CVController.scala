package com.lunatech.cc.api

import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{CVService, PeopleService, Person}
import com.lunatech.cc.formatter.{CVFormatter, FormatResult}
import com.lunatech.cc.models.{CV, Employee}
import com.twitter.io.{Buf, Reader}
import com.twitter.util.Future
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import io.finch.circe._
import cats.implicits._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class CVController(cvService: CVService, peopleService: PeopleService, cvFormatter: CVFormatter)(implicit val tokenVerifier: TokenVerifier ) {

  lazy val logger: Logger = getLogger(getClass)

  /**
    * Generates a PDF and stores the CV as a new version.
    */
  val `POST /cvs`: Endpoint[Buf] = post(cvs :: tokenHeader :: jsonBody[Json]) { (token: String, cv: Json) =>
    authF(token) { _ =>
      logger.debug(cv.toString)
      cv.as[CV] match {
        case Right(data) =>
          cvFormatter.format(data) match {
            case Right(FormatResult(result, _)) =>
              Reader.readAll(result).map { content =>
                val result: Int = cvService.insert(data.employee.basics.email,cv)
                //Return PDF
                //TODO: Handle result of saving better
                if(result > 0) Ok(content).withHeader("Content-type" -> "application/pdf").withHeader("ACCESS_CONTROL_ALLOW_ORIGIN" -> "*")
                else InternalServerError(new RuntimeException("Couldn't save CV version"))
              }
            case Left(e) => Future(InternalServerError(e))
          }
        case Left(e) => Future(BadRequest(new RuntimeException(e)))
      }
    }
  }

  /**
    * Returns a list of all CVs sorted by developer
    */
  val `GET /cvs`: Endpoint[Json] = get(cvs :: tokenHeader).mapAsync { token =>
    for {
      people <- peopleService.findByRole("developer")
      cvs <- Future.value(cvService.findAll.flatMap(_.as[CV].toValidated.toOption))
    } yield {
      people.map { person =>
        cvs.find(_.employee.basics.email.toLowerCase == person.email.toLowerCase).getOrElse(CV(person)).asJson
      }.asJson
    }
  }


  /**
    * Returns list of CVs for this developer
    */
  val `GET /cvs/employeeId`: Endpoint[List[Json]] = get(cvs :: string :: tokenHeader) { (employeeId: String, token: String) =>
    auth(token) { user =>
      logger.debug(s"GET /cvs/$employeeId for $user")
      val json = cvService.findById(employeeId)

      Ok(json)
    }
  }


}
