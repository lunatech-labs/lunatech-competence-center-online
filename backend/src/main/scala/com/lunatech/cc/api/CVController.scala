package com.lunatech.cc.api

import java.util.UUID

import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{CVService, PeopleService, Person}
import com.lunatech.cc.formatter.{CVFormatter, FormatResult}
import com.lunatech.cc.models.{CV, CVData, CVS, Employee}
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


class CVController(cvService: CVService, peopleService: PeopleService, cvFormatter: CVFormatter, authenticated: Endpoint[ApiUser], authenticatedUser: Endpoint[GoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val me = "me":: authenticatedUser

  val `POST /cvs`: Endpoint[Buf] = post(cvs :: authenticated :: jsonBody[Json]) { (_: ApiUser, cv: Json) =>
    logger.debug(cv.toString)
    cv.as[CV] match {
      case Right(data) =>

        //Create PDF
        cvFormatter.format(data) match {
          case Right(FormatResult(result, _)) =>
            Reader.readAll(result).map { content =>
              //Store CV for future usage
              val __ = cvService.insert(data.employee.basics.email,cv)

              Ok(content).withHeader("Content-type" -> "application/pdf").withHeader("ACCESS_CONTROL_ALLOW_ORIGIN" -> "*")
            }
          case Left(e) => Future(InternalServerError(e))
        }
      case Left(e) => Future(BadRequest(new RuntimeException(e)))
    }
  }

  val `GET /cvs/employeeId`: Endpoint[Json] = get(cvs :: string :: authenticated) { (employeeId: String, apiUser: ApiUser) =>
    logger.debug(s"GET /cvs/$employeeId for $apiUser")

    cvService.findById(employeeId) match {
      case l:List[Json] if l.nonEmpty => Ok(l.asJson)
      case empty => NotFound(new RuntimeException("No CV found"))
    }
  }

  val `DELETE /cvs/uuid`: Endpoint[Unit] = delete(cvs :: uuid :: authenticated) { (cvid: UUID, apiUser: ApiUser) =>
    logger.debug(s"DELETE /cvs/$cvid for $apiUser")

    val result = cvService.delete(cvid)
    if(result == 1) NoContent[Unit]
    else BadRequest(new RuntimeException(s"Can't delete cv with id ${cvid.toString}"))
  }

  val `GET /cvs/uuid`: Endpoint[Json] = get(cvs :: uuid :: authenticated) { (cvid: UUID, apiUser: ApiUser) =>
    logger.debug(s"GET /cvs/$cvid for $apiUser")

    val result = cvService.get(cvid)

    result match {
      case Some(value) => Ok(value)
      case None => NotFound(new RuntimeException(s"Can't find CV with ID: ${cvid.toString}"))
    }

  }

  val `GET /cvs`: Endpoint[Json] = get(cvs :: authenticated) { (user: ApiUser) =>
    for {
      devs <- peopleService.findByRole("developer")
      cvs <- Future.value(cvService.findAll)
      output = devs.map( p =>
        cvs.get(p.email).map(CVS(p.email,_)).getOrElse(CVS(p.email,Nil))
      ).asJson
    } yield Ok(output)
  }

}
