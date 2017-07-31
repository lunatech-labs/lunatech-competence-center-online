package com.lunatech.cc.api

import com.lunatech.cc.api.filters.AuthFilter
import com.lunatech.cc.api.services.{ApiPeopleService, EventBriteWorkshopService, PostgresCVService, PostgresPassportService}
import com.lunatech.cc.formatter.PdfCVFormatter
import com.lunatech.cc.utils.DBMigration
import com.twitter.finagle.http.filter.Cors
import com.twitter.finagle.http.{Request, Response}
import com.twitter.finagle.{Http, Service}
import com.twitter.util.Await
import com.typesafe.config.ConfigFactory
import doobie.imports._
import fs2._
import io.finch._
import io.finch.circe._
import org.flywaydb.core.Flyway
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

object CompetenceCenterApi extends App {

  /**
    * Configs
    */
  val config = ConfigFactory.load()

  lazy val logger: Logger = getLogger(getClass)

  val transactor = transactorBuilder(config)

  new DBMigration(config).migrate()

  val port = config.getInt("server.port")


  val cvFormatter = new PdfCVFormatter()

  val policy: Cors.Policy = Cors.Policy(
    allowsOrigin = _ => Some("*"),
    allowsMethods = _ => Some(Seq("GET", "POST", "PUT")),
    allowsHeaders = x => Some(x))



  /**
    * Services
    */
  val cvService = new PostgresCVService(transactor)
  val passportService = new PostgresPassportService(transactor)
  val peopleService =  ApiPeopleService(config)
  val workshopService = EventBriteWorkshopService(config)



  /**
    * Controllers
    */
  implicit val tokenVerifier: TokenVerifier = config.getString("application.mode") match {
    case "dev" => new StaticTokenVerifier()
    case "prod" => new GoogleTokenVerifier(config.getString("google.clientId"))
    case _ => throw new RuntimeException("no valid application mode found")
  }

  val cvController = new CVController(cvService, peopleService, cvFormatter)
  val passportController = new PassportController(passportService, peopleService)
  val workshopController = new WorkshopController(workshopService)
  val peopleController = new PeopleController(peopleService)

  /**
    * API
    */
  val service = (passportController.endpoints :+: cvController.endpoints :+:
    workshopController.endpoints :+:
    peopleController.endpoints
  ).toServiceAs[Application.Json]

  val corsService: Service[Request, Response] = new Cors.HttpFilter(policy).andThen(AuthFilter).andThen(service)

  val server = Http.server.serve(s":$port", corsService)
  logger.info(s"Server running on port $port")
  Await.ready(server)
}
