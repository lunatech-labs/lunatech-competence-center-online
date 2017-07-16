package com.lunatech.cc.api

import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{PeopleService, Person}
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

class CVController(tokenVerifier: TokenVerifier, cvService: CVService, peopleService: PeopleService, cvFormatter: CVFormatter) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /employees`: Endpoint[Json] = get(employees :: tokenHeader) { (token: String) =>
    logger.debug(s"GET /employees with $token")
    auth(token)(_ => Ok(cvService.findAll.asJson))
  }

  val `GET /employees/me`: Endpoint[Json] = get(employees :: me :: tokenHeader) { (token: String) =>
    auth(token) { user =>
      logger.debug(s"GET /employees/me for $user")
      cvService.findByPerson(user) match {
        case Some(json) => Ok(json)
        case None => {
          val json = CV(user).asJson
          logger.debug(json.toString)
          Ok(json)
//          NotFound(new RuntimeException("No CV found"))
        } //TODO: return empty CV filled with user data
      }
    }
  }

  val `GET /employees/employeeId`: Endpoint[Json] = get(employees :: string :: tokenHeader) { (employeeId: String, token: String) =>
    auth(token) { user =>
      logger.debug(s"GET /employees/$employeeId for $user")

      cvService.findById(employeeId) match {
        case Some(json) => Ok(json)
        case None => NotFound(new RuntimeException("No CV found"))
      }
    }
  }

  val `PUT /employees/me`: Endpoint[Json] = put(employees :: me :: tokenHeader :: jsonBody[Json]) { (token: String, employee: Json) =>
    auth(token) { user =>
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
  }

  val `POST /cvs`: Endpoint[Buf] = post(cvs :: tokenHeader :: jsonBody[Json]) { (token: String, cv: Json) =>
    authF(token) { _ =>
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
  }

  val `GET /cvs`: Endpoint[Json] = get(cvs :: tokenHeader).mapAsync { token =>
    for {
      people <- peopleService.findByRole("developer")
      cvs <- Future.value(cvService.findAll.flatMap(_.as[CV].toValidated.toOption))
      _ = cvs.foreach(println)
    } yield {

      people.map { person =>
        Json.obj(
          "person" -> person.asJson,
          "cv" -> cvs.find(_.employee.basics.email.toLowerCase == person.email.toLowerCase).getOrElse(CV(person)).asJson
        )
      }.asJson
    }
  }


  val `GET /cvs/employeeId`: Endpoint[Json] = get(cvs :: string :: tokenHeader) { (employeeId: String, token: String) =>
    auth(token) { user =>
      logger.debug(s"GET /cvs/$employeeId for $user")

      cvService.findById(employeeId) match {
        case Some(json) => Ok(json)
        case None => NotFound(new RuntimeException("No CV found"))
      }
    }
  }


  private def auth[A](token: String)(f: GoogleUser => Output[A]): Output[A] =
    tokenVerifier.verifyToken(token) match {
      case Some(user) => f(user)
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }

  private def authF[A](token: String)(f: GoogleUser => Future[Output[A]]): Future[Output[A]] =
    tokenVerifier.verifyToken(token) match {
      case Some(user) => f(user)
      case None => Future(Unauthorized(new RuntimeException("Invalid token")))
    }
}
