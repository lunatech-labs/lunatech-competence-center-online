package com.lunatech.cc.api

import cats.implicits._
import com.lunatech.cc.api.Routes._
import com.lunatech.cc.api.services.{PeopleService, Person}
import com.lunatech.cc.formatter.{CVFormatter, FormatResult}
import com.lunatech.cc.models.{CV, Employee}
import com.twitter.io.{Buf, Reader}
import com.twitter.util.Future
import com.lunatech.cc.api.services.WorkshopService
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import io.finch.circe._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class WorkshopController(workshopService: WorkshopService, authenticated: Endpoint[ApiUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /workshops`: Endpoint[Json] = get("workshops" :: authenticated) { (_: ApiUser) =>
    for {
      workshops <- workshopService.listWorkshops
    } yield Ok(workshops.asJson)
  }

}
