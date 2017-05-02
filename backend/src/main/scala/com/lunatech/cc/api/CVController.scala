package com.lunatech.cc.api

import java.util.UUID

import cats.implicits._
import com.lunatech.cc.models.CV
import doobie.imports._
import fs2._
import io.circe._
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import io.finch._
import io.finch.circe._
import org.postgresql.util.PGobject


class CVController(googleTokenVerifier: GoogleTokenVerifier, transactor: Transactor[Task]) {

  import CVController._

  private val employees: Endpoint0 = "employees"
  private val me: Endpoint0 = "me"
  private val cvs: Endpoint0 = "cvs"
  private val tokenHeader: Endpoint[String] = header("X-ID-Token")

  val `GET /employees`: Endpoint[Json] = get(employees :: tokenHeader) { (token: String) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) => Ok(all.transact(transactor).unsafeRun().asJson)
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }
  }

  val `GET /employees/employeeId`: Endpoint[Json] = get(employees :: string :: tokenHeader) { (employeeId: String, token: String) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) =>
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

  val `PUT /employees/me`: Endpoint[Json] = put(employees :: me :: tokenHeader :: jsonBody[Json]) { (token: String, cv: Json) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) =>
        insert(user.email, cv).transact(transactor).unsafeRun()
        Ok(cv)
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }
  }

  val `POST /cvs`: Endpoint[String] = post(cvs :: tokenHeader :: jsonBody[Json]) { (token: String, cv: Json) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) =>
        cv.as[CV] match {
          case Right(data) => Ok(data.meta.client)
          case Left(e) => InternalServerError(e)
        }
      case None => Unauthorized(new RuntimeException("Invalid token"))
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

  def findByPerson(email: String): ConnectionIO[Option[Json]] = sql"SELECT cv FROM cvs WHERE person = $email ORDER BY created_on DESC LIMIT 1".query[Json].option

  def all: ConnectionIO[List[Json]] = sql"SELECT cv FROM cvs".query[Json].list

  def insert(email: String, cv: Json): ConnectionIO[Int] = {
    val id = UUID.randomUUID
    val q = sql"INSERT INTO cvs (id, person, cv, created_on) VALUES (${id.toString} :: UUID, $email, $cv, CURRENT_TIMESTAMP)".update
    println(q.sql)
    q.run
  }

}
