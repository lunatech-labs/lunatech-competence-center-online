package com.lunatech.cc.api

import com.lunatech.cc.api.Routes._
import com.lunatech.cc.formatter.CVFormatter
import com.lunatech.cc.models.{CV, Employee}
import com.twitter.io.{Buf, Reader}
import com.twitter.util.Future
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import io.finch.circe._

class CVController(tokenVerifier: TokenVerifier, cvService: CVService, cvFormatter: CVFormatter) {

  val `GET /employees`: Endpoint[Json] = get(employees :: tokenHeader) { (token: String) =>
    auth(token)(_ => Ok(cvService.findAll.asJson))
  }

  val `GET /employees/me`: Endpoint[Json] = get(employees :: me :: tokenHeader) { (token: String) =>
    auth(token) { user =>
      cvService.findByPerson(user.email) match {
        case Some(json) => Ok(json)
        case None => NotFound(new RuntimeException("No CV found"))
      }
    }
  }

  val `GET /employees/employeeId`: Endpoint[Json] = get(employees :: string :: tokenHeader) { (employeeId: String, token: String) =>
    auth(token) { user =>
      println(employeeId)
      println(user)
      cvService.findByPerson(employeeId) match {
        case Some(json) => Ok(json)
        case None => NotFound(new RuntimeException("No CV found"))
      }
    }
  }

  val `PUT /employees/me`: Endpoint[Json] = put(employees :: me :: tokenHeader :: jsonBody[Json]) { (token: String, employee: Json) =>
    auth(token) { user =>
      employee.as[Employee] match {
        case Right(_) =>
          cvService.insert(user.email, employee)
          Ok(employee)
        case Left(e) => BadRequest(new RuntimeException(e))
      }
    }
  }

  val `POST /cvs`: Endpoint[Buf] = post(cvs :: tokenHeader :: jsonBody[Json]) { (token: String, cv: Json) =>
    authF(token) { _ =>
      cv.as[CV] match {
        case Right(data) =>
          cvFormatter.format(data) match {
            case Right(result) =>
              Reader.readAll(result).map { content =>
                Ok(content).withHeader("Content-type" -> "application/pdf")
              }
            case Left(e) => Future(InternalServerError(e))
          }
        case Left(e) => Future(BadRequest(new RuntimeException(e)))
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
