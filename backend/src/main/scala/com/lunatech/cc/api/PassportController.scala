package com.lunatech.cc.api

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
      getUpdatedPassportOrDefault(user.toPerson).map(Ok)
  }

  val `GET /passport/employeeId`: Endpoint[Json] = get("passport" :: string :: authenticated) { (employeeId: String, user: ApiUser) =>
    logger.debug(s"GET /passport/$employeeId for $user")

    val result: Future[Either[RuntimeException, Json]] = peopleService.findByEmail(employeeId).flatMap {
      case Some(e) => getUpdatedPassportOrDefault(e).map(Right(_))
      case None =>  Future.value(Left(new RuntimeException(s"No data found for $employeeId")))
    }

    result.map {
      case Right(j) => Ok(j)
      case Left(e) => NotFound(e)
    }

  }

  val `PUT /passport`: Endpoint[Json] = put("passport" :: authenticatedUser :: jsonBody[Json]) { (user: EnrichedGoogleUser, passport: Json) =>
    passport.as[Employee] match {
      case Right(_) =>
        logger.debug("received data")
        passportService.save(user.email, passport)
        Ok(passport)
      case Left(e) =>
        logger.error(s"incorrect data $e in $passport")
        BadRequest(new RuntimeException(e))
    }
  }

  /**
    * Returns all developers with their CVs
    */
  val `GET /employees/passport`: Endpoint[Json] = get(employees :: "passport" :: authenticated) { (user: ApiUser) =>
    logger.debug(s"GET /employees/passport by user $user")

    val result: Future[Seq[Future[Json]]] =  for {
      people <- peopleService.findByRole("developer")
    } yield people.map(p => getUpdatedPassportOrDefault(p))

    result.flatMap(d =>  {
      Future.collect(d).map( r => {
        Ok(r.asJson)
      })
    })

  }

  private def getUpdatedPassportOrDefault(p: Person) = {

    val skills: Future[Seq[Skill]] = skillMatrixService.findByEmail(p.email).map(_.skills.map(_.toSkill))

    skills.map { skls =>

      passportService.findByEmail(p.email) match {
        case Some(d) => {
          logger.debug(s"GET /employees/passport finding passport for $d")

          val pass: Employee = d.as[Employee] match {
            case Left(e) =>
              logger.warn(s"Error retrieving data ${e.message}, creating new Employee")
              Employee.apply(p).updateSkills(skls)
            case Right(e) =>
              logger.debug(s"ok updating skills for ${e.basics.email}")
              e.updateSkills(skls)
          }
          pass.asJson
        }
        case None => {
          logger.debug(s"No data found for user ${p.email} and $skls")
          Employee.apply(p).updateSkills(skls).asJson
        }
      }
    }
  }

}

