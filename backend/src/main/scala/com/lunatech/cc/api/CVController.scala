package com.lunatech.cc.api

import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{CVService, PeopleService, Person}
import com.lunatech.cc.formatter.{CVFormatter, FormatResult}
import com.lunatech.cc.models.{CV, CVData, Employee}
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
//
//  val `GET /employees`: Endpoint[Json] = get(employees :: authenticated) { (user: ApiUser) =>
//    logger.debug(s"GET /employees by user $user")
//    Ok(cvService.findAll.asJson)
//  }
//
//  val `GET /employees/me`: Endpoint[Json] = get(employees :: me ) { (user: GoogleUser) =>
//    logger.debug(s"GET /employees/me for $user")
//    cvService.findByPerson(user) match {
//      case l:List[Json] if l.nonEmpty => Ok(l.asJson)
//      case empty => {
//        val json = CV(user).asJson
//        logger.debug(json.toString)
//        Ok(List(json).asJson)
//      }
//
//    }
//  }

//  val `GET /employees/employeeId`: Endpoint[Json] = get(employees :: string :: authenticated) { (employeeId: String, apiUser: ApiUser) =>
//    logger.debug(s"GET /employees/$employeeId for $apiUser")
//
//    cvService.findById(employeeId) match {
//      case l:List[Json] if l.nonEmpty => Ok(l.asJson)
//      case empty => NotFound(new RuntimeException("No CV found"))
//    }
//  }
//
//  val `PUT /employees/me`: Endpoint[Json] = put(employees :: me :: jsonBody[Json]) { (user: GoogleUser, employee: Json) =>
//    employee.as[CV] match {
//      case Right(_) =>
//        logger.debug("received data")
//        cvService.insert(user.email, employee)
//        Ok(employee)
//      case Left(e) =>
//        logger.debug(s"incorrect data $employee")
//        BadRequest(new RuntimeException(e))
//    }
//  }

  val `POST /cvs`: Endpoint[Buf] = post(cvs :: authenticated :: jsonBody[Json]) { (_: ApiUser, cv: Json) =>
    logger.debug(cv.toString)
    cv.as[CV] match {
      case Right(data) =>
        cvFormatter.format(data) match {
          case Right(FormatResult(result, _)) =>
            Reader.readAll(result).map { content =>
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


  val `GET /cvs`: Endpoint[Json] = get(cvs :: authenticated) { (user: ApiUser) =>
    val people = peopleService.findByRole("developer")
    val cvs = Future.value(cvService.findAll)

    val data: Future[Seq[CVData]] = for {
      pp <- people
      cc <- cvs
    } yield pp.flatMap( p => cc.find(_.email == p.email))

    data.map( x => Ok(x.asJson))
  }


}
