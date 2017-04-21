package com.lunatech.cc.api

import io.finch._
import com.twitter.finagle.http.filter.Cors
import com.twitter.finagle.Http
import com.twitter.finagle.Service
import com.twitter.finagle.http.{Request, Response }
import com.twitter.finagle.http.Response
import com.twitter.util.Await
import com.twitter.io.{ Buf, Reader }
import io.finch.circe._
import org.postgresql.util.PGobject

import io.circe._
import io.circe.parser._
import io.circe.generic.semiauto._

import cats._, cats.data._, cats.implicits._
import doobie.imports._

import java.util.UUID

import fs2._


class CVController(googleTokenVerifier: GoogleTokenVerifier, transactor: Transactor[Task]) {
  import CVController._

  val `GET /cvs/me`: Endpoint[Json] = get("cvs" :: "me" :: header("X-ID-Token")) { (token: String) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) =>

        findByPerson(user.email).transact(transactor).unsafeRun() match {
          case Some(json) => Ok(json)
          case None => NotFound(new RuntimeException("No CV found"))
        }

      case None =>
        Unauthorized(new RuntimeException("Invalid token"))
    }
  }

  val `PUT /cvs/me`: Endpoint[Unit] = put("cvs" :: "me" :: header("X-ID-Token") :: jsonBody[Json]) { (token: String, cv: Json) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) =>

        insert(user.email, cv).transact(transactor).unsafeRun()

        Ok()

      case None =>
        Unauthorized(new RuntimeException("Invalid token"))
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

  def findByPerson(email: String): ConnectionIO[Option[Json]] = sql"select cv from cvs where person = $email order by created_on DESC limit 1".query[Json].option

  def insert(email: String, cv: Json): ConnectionIO[Int] = {
    val id = UUID.randomUUID
    val q = sql"insert into cvs (id, person, cv, created_on) VALUES (${id.toString} :: uuid, $email, $cv, CURRENT_TIMESTAMP)".update
      println(q.sql)
    q.run
  }

}
