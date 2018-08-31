package com.lunatech.cc.api

import java.util.UUID

import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{CVService, PeopleService}
import com.lunatech.cc.formatter.{CVFormatter, FormatResult}
import com.lunatech.cc.models.CV
import com.twitter.io.{Buf, Reader}
import com.twitter.util.Future
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import io.finch.circe._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._
import scalaz._

class CVController(cvService: CVService, peopleService: PeopleService, cvFormatter: CVFormatter, authenticated: Endpoint[ApiUser], authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /employees`: Endpoint[Json] = get(employees :: authenticated) { (user: ApiUser) =>
    logger.debug(s"GET /employees by user $user")
    Ok(cvService.findAll.asJson)
  }

  val `GET /employees/me`: Endpoint[List[Json]] = get(employees :: me :: authenticatedUser) { (user: EnrichedGoogleUser) =>
    logger.debug(s"GET /employees/me for $user")
    cvService.findByPerson(user) match {
      case Nil => Ok(List(CV(user).asJson))
      case l => Ok(l)
    }
  }

  val `GET /employees/employeeId`: Endpoint[List[Json]] = get(employees :: string :: authenticated) { (employeeId: String, apiUser: ApiUser) =>
    logger.debug(s"GET /employees/$employeeId for $apiUser")

    peopleService.findByEmail(employeeId)
      .map {
      case Some(person) => cvService.findByPersonId(employeeId) match {
        case Nil => {
          val cvl: List[Json] = List(CV(person).asJson)
          Ok(cvl)
        }
        case l => Ok(l)
      }
      case _ => NotFound(new Exception(s"Employee $employeeId not found"))
    }

  }

  val `PUT /employees/me`: Endpoint[Json] = put(employees :: me :: authenticatedUser :: jsonBody[Json]) { (user: EnrichedGoogleUser, employee: Json) =>
    employee.as[CV] match {
      case Right(_) =>
        logger.debug("received data")
        cvService.insert(user.email, employee)
        Ok(employee)
      case Left(e) =>
        logger.debug(s"incorrect data $employee")
        BadRequest(new RuntimeException(e))
    }
  }

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

    val `GET /cvs/cvId`: Endpoint[Json] = get(cvs :: uuid :: authenticated) { (cvId: UUID, apiUser: ApiUser) =>
      logger.debug(s"GET /cvs/${cvId.toString} for ${apiUser}")

      cvService.findById(cvId) match {
        case Some(value) => Ok(value)
        case None => NotFound(new Exception(s"not found cv with id $cvId"))
      }
    }

  val `GET /cvs`: Endpoint[Json] = get(cvs :: authenticated).mapAsync { (apiUser: ApiUser) =>
    logger.debug(s"GET /cvs by $apiUser")

    val result =  for {
      people <- peopleService.findByRole("developer")
      cvs <- Future.value(cvService.findAll)
      //      cvs <- Future.value(cvService.findAll.flatMap(_.as[CV].toValidated.toOption))
//      _ = cvs.foreach(println)
    } yield {
      people.map(p => cvs.get(p.email) match {
        case Some(d) => (p,d)
        case None => (p,List.empty[(UUID,Json)])
      })}

    result.map(d => d.asJson)
  }



}
