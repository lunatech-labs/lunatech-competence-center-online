package com.lunatech.cc.api

import java.util.UUID

import com.lunatech.cc.api.services.{PassportService, PeopleService, Person, SkillMatrixService}
import com.lunatech.cc.models.{Employee, Skill}
import com.twitter.util.Future
import Routes._
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import io.finch.circe._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class PassportController(passportService: PassportService, peopleService: PeopleService,
                         skillMatrixService: SkillMatrixService, authenticated: Endpoint[ApiUser],
                         authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /passport/me`: Endpoint[Json] = get("passport" :: "me":: authenticatedUser) { (user: EnrichedGoogleUser) =>
    logger.debug(s"GET /passport for $user")
    passportService.findByPerson(user) match {
      case Some(json) => Ok(json)
      case None => Ok(Employee(user).asJson)
    }
  }

  val `GET /passport/employeeId`: Endpoint[Json] = get("passport" :: string :: authenticatedUser) { (employeeId: String, user: EnrichedGoogleUser) =>
    logger.debug(s"GET /passport/$employeeId for $user")

    passportService.findById(employeeId) match {
      case Some(json) => Ok(json)
      case None => NotFound(new RuntimeException(s"No data found for $employeeId"))
    }
  }

  val `PUT /passport`: Endpoint[Json] = put("passport" :: authenticatedUser :: jsonBody[Json]) { (user: EnrichedGoogleUser, passport: Json) =>
    passport.as[Employee] match {
      case Right(_) =>
        logger.debug("received data")
        val result: Int = passportService.save(user.email, passport)
        if (result > 0) Ok(passport)
        else InternalServerError(new Exception("Errors while saving passport"))
      case Left(e) =>
        logger.debug(s"incorrect data $e in $passport")
        BadRequest(new RuntimeException(e))
    }
  }

  /**
    * Returns all developers with their CVs
    */
  val `GET /employees/passport`: Endpoint[Json] = get(employees :: "passport" :: authenticated) { (user: ApiUser) =>
    logger.debug(s"GET /employees/passport by user $user")

    val result: Future[Seq[Future[(Person, Json)]]] =  for {
      people <- peopleService.findByRole("developer")
    } yield {
      people.map(p => {
        val skills: Future[Seq[Skill]] = skillMatrixService.findByEmail(p.email).map(_.skills.map(_.toSkill))

        skills.map { skls =>

          passportService.findById(p.email) match {
            case Some(d) => {
              val pass: Employee = d.as[Employee] match {
                case Left(value) => Employee.apply(p) //TODO error handling
                case Right(e) => e.updateSkills(skls)
              }

              (p, pass.asJson)
            }
            case None => (p, Json.Null)
          }
        }
      })}



    result.flatMap(d =>  {
      Future.collect(d).map( r => Ok(r.asJson))
    })

  }





}

