package com.lunatech.cc.api

import java.util.UUID

import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{CVService, PassportService, PeopleService}
import com.lunatech.cc.formatter.{CVFormatter, FormatResult}
import com.lunatech.cc.models.{CV, Employee}
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

class CVController(cvService: CVService, peopleService: PeopleService, passportService: PassportService, cvFormatter: CVFormatter, authenticated: Endpoint[ApiUser], authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  /**
    * Returns all developers with their CVs
    */
  val `GET /employees/cvs`: Endpoint[Json] = get(employees :: cvs :: authenticated) { (user: ApiUser) =>
    logger.debug(s"GET /employees/cvs by user $user")

    val result =  for {
      people <- peopleService.findByRole("developer")
      cvs <- Future.value(cvService.findAll)
    } yield {
      people.map(p => cvs.get(p.email) match {
        case Some(d) => (p,d)
        case None => (p,List.empty[(UUID,Json)])
      })}

    result.map(d => Ok(d.asJson))

  }

  /**
    * Returns the CVs for a specific employee
    */
  val `GET /cvs/employeeId`: Endpoint[List[Json]] = get(cvs :: string :: authenticated) { (employeeId: String, apiUser: ApiUser) =>
    logger.debug(s"GET /employees/$employeeId for $apiUser")

    val result: List[Json] = cvService.findByPersonId(employeeId) match {
      case Nil => {
        passportService.findByEmail(employeeId).map(j => j.as[Employee] match {
          case Left(_) => List.empty[Json]
          case Right(employee) => List(CV(employee).asJson)
        }).getOrElse(List.empty[Json])
      }
      case l => l
    }

    if(result.nonEmpty) Ok(result)
    else NotFound(new Exception(s"Employee $employeeId not found"))

  }

  /**
    * Updates a CV for me
    */
  val `PUT /cvs/me`: Endpoint[Json] = put(cvs :: me :: authenticatedUser :: jsonBody[Json]) { (user: EnrichedGoogleUser, cv: Json) =>
    cv.as[CV] match {
      case Right(_) =>
        logger.debug("received data")
        cvService.insert(user.email, cv)
        Ok(cv)
      case Left(e) =>
        logger.debug(s"incorrect data $cv")
        BadRequest(new RuntimeException(e))
    }
  }

  /**
    * Creates a CV PDF
    */
  val `POST /cvs`: Endpoint[Buf] = post(cvs :: authenticated :: jsonBody[Json]) { (_: ApiUser, cv: Json) =>
    logger.debug(cv.toString)
    cv.as[CV] match {
      case Right(data) =>
        cvFormatter.format(data) match {
          case Right(FormatResult(result, _)) =>
            Reader.readAll(result).map { content =>
              Ok(content).withHeader("Content-type" -> "application/pdf").withHeader("ACCESS_CONTROL_ALLOW_ORIGIN" -> "*")
            }
          case Left(e) => Future.value(InternalServerError(e))
        }
      case Left(e) => Future.value(BadRequest(new RuntimeException(e)))
    }
  }

  /**
    * Returns a specific CV
    */
  val `GET /cvs/cvId`: Endpoint[Json] = get(cvs :: uuid :: authenticated) { (cvId: UUID, apiUser: ApiUser) =>
    logger.debug(s"GET /cvs/${cvId.toString} for ${apiUser}")

    cvService.findById(cvId) match {
      case Some(value) => Ok(value)
      case None => NotFound(new Exception(s"not found cv with id $cvId"))
    }
  }

  /**
    * Returns all CVs for me
    */
  val `GET /cvs/me`: Endpoint[List[Json]] = get(cvs :: me :: authenticatedUser) { (user: EnrichedGoogleUser) =>
    logger.debug(s"GET /employees/me for $user")
    cvService.findByPerson(user) match {
      case Nil => Ok(List(CV(user).asJson))
      case l => Ok(l)
    }
  }

  /**
    * Returns all CVS stored in the database
    */
  val `GET /cvs`: Endpoint[Json] = get(cvs :: authenticated) { (apiUser: ApiUser) =>
    logger.debug(s"GET /cvs by $apiUser")

    Ok(cvService.findAll.asJson)

  }



}
