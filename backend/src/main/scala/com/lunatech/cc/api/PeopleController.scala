package com.lunatech.cc.api

import com.lunatech.cc.api.services.PeopleService
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class PeopleController(peopleService: PeopleService, authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /people/me`: Endpoint[Json] = get("people" :: "me" :: authenticatedUser).apply { (user: EnrichedGoogleUser) =>
    for {
      // TODO, the People API now also supports Google idTokens, so we can just pass that one along instead.
      me <- peopleService.findByEmail(user.email) // TODO, what happens on a 404 here?
    } yield Ok(me.asJson)
  }

}
