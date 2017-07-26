package com.lunatech.cc.api

import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{PassportService, PeopleService, Person}
import com.lunatech.cc.models.Employee
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import io.finch.circe._
import cats.implicits._
import com.twitter.util.Future
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class PassportController(passportService: PassportService, peopleService: PeopleService)(implicit val tokenVerifier: TokenVerifier ) {

  lazy val logger: Logger = getLogger(getClass)

  /**
    * Returns a list of all Lunatech Developers with their CVs
    */
  val `GET /employees`: Endpoint[Json] = get(employees :: tokenHeader).mapAsync { token =>
    for {
      people <- peopleService.findByRole("developer")
      passports <- Future.value(passportService.findAll.flatMap(_.as[Employee].toValidated.toOption))
    } yield {
      people.map { person =>
        passports.find(_.basics.email.toLowerCase == person.email.toLowerCase).getOrElse(Employee(person)).asJson
      }.asJson
    }
  }

  val `GET /passport`: Endpoint[Json] = get(passport :: tokenHeader) { (token: String) =>
    auth(token) { user =>
      logger.debug(s"GET /passport for $user")
      passportService.findByPerson(user) match {
        case Some(json) => Ok(json)
        case None => Ok(Employee(user).asJson)
      }
    }
  }

  val `GET /employees/employeeId`: Endpoint[Json] = get(employees :: string :: tokenHeader) { (employeeId: String, token: String) =>
    auth(token) { user =>
      logger.debug(s"GET /employees/$employeeId for $user")

      passportService.findById(employeeId) match {
        case Some(json) => Ok(json)
        case None => NotFound(new RuntimeException(s"No data found for $employeeId"))
      }
    }
  }

  val `PUT /passport`: Endpoint[Json] = put(passport :: tokenHeader :: jsonBody[Json]) { (token: String, employee: Json) =>
    auth(token) { user =>
      employee.as[Employee] match {
        case Right(_) =>
          logger.debug("received data")
          passportService.save(user.email, employee)
          Ok(employee)
        case Left(e) =>
          logger.debug(s"incorrect data $employee")
          BadRequest(new RuntimeException(e))
      }
    }
  }




}
