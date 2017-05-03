package com.lunatech.cc.api

import java.util.UUID

import cats.implicits._
import com.lunatech.cc.formatter.CVFormatter
import com.lunatech.cc.models.{CV, Employee}
import com.twitter.io.{Buf, Reader}
import com.twitter.util.Future
import doobie.imports._
import fs2._
import io.circe._
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import io.finch._
import io.finch.circe._
import org.postgresql.util.PGobject
import com.lunatech.cc.api.Routes._

class CVController(googleTokenVerifier: GoogleTokenVerifier, transactor: Transactor[Task]) {

  import CVController._

  val `GET /employees`: Endpoint[Json] = get(employees :: tokenHeader) { (token: String) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(_) => Ok(all.transact(transactor).unsafeRun().asJson)
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }
  }

  val `GET /employees/employeeId`: Endpoint[Json] = get(employees :: string :: tokenHeader) { (employeeId: String, token: String) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(_) =>
        findByPerson(employeeId).transact(transactor).unsafeRun() match {
          case Some(json) => Ok(json)
          case None => NotFound(new RuntimeException("No CV found"))
        }
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }
  }

  val `GET /employees/me`: Endpoint[Json] = get(employees :: me :: tokenHeader) { (token: String) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) =>
        findByPerson(user.email).transact(transactor).unsafeRun() match {
          case Some(json) => Ok(json)
          case None => NotFound(new RuntimeException("No CV found"))
        }
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }
  }

  val `PUT /employees/me`: Endpoint[Json] = put(employees :: me :: tokenHeader :: jsonBody[Json]) { (token: String, employee: Json) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) =>
        employee.as[Employee] match {
          case Right(_) =>
            insert(user.email, employee).transact(transactor).unsafeRun()
            Ok(employee)
          case Left(e) => BadRequest(new RuntimeException(e))
        }
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }
  }

  val `POST /cvs`: Endpoint[Buf] = post(cvs :: tokenHeader :: jsonBody[Json]) { (token: String, cv: Json) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(_) =>
        cv.as[CV] match {
          case Right(data) =>
            CVFormatter.format(data) match {
              case Right(result) =>
                Reader.readAll(Reader.fromFile(result)).map { content =>
                  Ok(content).withHeader("Content-type" -> "application/pdf")
                }
              case Left(e) => Future(InternalServerError(e))
            }
          case Left(e) => Future(BadRequest(new RuntimeException(e)))
        }
      case None => Future(Unauthorized(new RuntimeException("Invalid token")))
    }
  }
}

object CVController { // extends App {

  implicit val JsonMeta: Meta[Json] =
    Meta.other[PGobject]("json").nxmap[Json](
      a => parse(a.getValue).leftMap[Json](e => throw e).merge, // failure raises an exception
      a => {
        val o = new PGobject
        o.setType("json")
        o.setValue(a.noSpaces)
        o
      }
    )

  def findByPerson(email: String): ConnectionIO[Option[Json]] =
    sql"SELECT cv FROM cvs WHERE person = $email ORDER BY created_on DESC LIMIT 1".query[Json].option

  def all: ConnectionIO[List[Json]] = sql"SELECT cv FROM cvs".query[Json].list

  def insert(email: String, cv: Json): ConnectionIO[Int] =
    sql"INSERT INTO cvs (id, person, cv, created_on) VALUES (${UUID.randomUUID.toString} :: UUID, $email, $cv, CURRENT_TIMESTAMP)".update.run
}
