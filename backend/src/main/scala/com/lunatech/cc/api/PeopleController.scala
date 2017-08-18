package com.lunatech.cc.api

import cats.implicits._
import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{PeopleService, Person}
import com.lunatech.cc.formatter.{CVFormatter, FormatResult}
import com.lunatech.cc.models.{CV, Employee}
import com.twitter.io.{Buf, Reader}
import com.twitter.util.Future
import com.twitter.finagle.http.Status
import com.lunatech.cc.api.services.WorkshopService
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import io.finch.circe._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._
import scalaz._

class PeopleController(peopleService: PeopleService, authenticatedUser: Endpoint[GoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /people/me`: Endpoint[Json] = get("people" :: "me" :: authenticatedUser).apply { (user: GoogleUser) =>
    for {
      // TODO, the People API now also supports Google idTokens, so we can just pass that one along instead.
      me <- peopleService.findByEmail(user.email) // TODO, what happens on a 404 here?
    } yield Ok(me.asJson)
  }

}
