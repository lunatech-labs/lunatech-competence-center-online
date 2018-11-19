package com.lunatech.cc.api

import com.lunatech.cc.api.services.WorkshopService
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class WorkshopController(workshopService: WorkshopService, authenticated: Endpoint[ApiUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /workshops`: Endpoint[Json] = get("workshops") {
    for {
      workshops <- workshopService.listWorkshops
    } yield Ok(workshops.asJson)
  }

}
