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

import fs2._

class CVController(googleTokenVerifier: GoogleTokenVerifier) {

  val `GET /cvs/me`: Endpoint[Json] = get("cvs" :: "me" :: header("X-ID-Token")) { (token: String) =>
    googleTokenVerifier.verifyToken(token) match {
      case Some(user) =>
        Ok(Json.obj("greeting" -> Json.fromString(s"Hello, ${user.name}")))
      case None =>
        NotFound(new RuntimeException("Invalid token"))
    }
  }

}

object CVController extends App {

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

/*
  val xa = DriverManagerTransactor[Task](
    "org.postgresql.Driver", "jdbc:postgresql:competence-center", "postgres", "")

  def findByPerson(email: String): ConnectionIO[Option[CV]] = sql"select cv from cvs where person = $email order by created_on DESC limit 1".query[Json].option // ???

  val out = findByPerson("erik.bakker@lunatech.com").transact(xa).unsafeRun()
  println(out)
  */
}
