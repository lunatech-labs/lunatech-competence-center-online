package com.lunatech.cc.api

import com.lunatech.cc.api.services.CareerFrameworkService
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class CareerFrameworkController(careerFrameworkService: CareerFrameworkService, authenticated: Endpoint[ApiUser], authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /career`: Endpoint[Json] = get("career") { () =>
    for {
      levels <- careerFrameworkService.findAll
    } yield Ok(levels.asJson)
  }

  val `GET /career/{shortname}`: Endpoint[Json] = get("career" :: string) { (shortname: String) =>
    for {
      level <- careerFrameworkService.findByShortName(shortname)
    } yield Ok(level.asJson)
  }

}

