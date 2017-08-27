package com.lunatech.cc.api

import com.lunatech.cc.api.services._
import com.lunatech.cc.formatter.PdfCVFormatter
import com.lunatech.cc.utils.DBMigration
import com.twitter.finagle.http.filter.Cors
import com.twitter.finagle.http.{Request, Response, Status}
import com.twitter.finagle.{Http, Service}
import com.twitter.util.{Await, Future}
import com.typesafe.config.ConfigFactory
import doobie.imports._
import fs2._
import io.finch._
import io.finch.circe._
import org.flywaydb.core.Flyway
import org.slf4j.Logger
import org.slf4j.LoggerFactory._
import pureconfig._
import scalaz._

object CompetenceCenterApi extends App {

  case class Config(application: Config.ApplicationConfig, http: Config.HttpConfig, google: Config.GoogleConfig, auth: AuthConfig, database: DbConfig, services: Config.ServicesConfig)
  object Config {
    case class ApplicationConfig(mode: String)
    case class HttpConfig(port: Int)
    case class GoogleConfig(oauthClientId: String)
    case class ServicesConfig(people: PeopleService.Config, workshops: WorkshopService.Config)
  }

  val config = loadConfig[Config].fold(
    errors => sys.error(errors.toString),
    identity)

  lazy val logger: Logger = getLogger(getClass)

  val transactor = DriverManagerTransactor[Task](
    driver = config.database.driver,
    url = config.database.url,
    user = config.database.user,
    pass = config.database.password)

  new DBMigration(config.database).migrate()

  val cvService = new PostgresCVService(transactor)
  val workshopService = EventBriteWorkshopService(config.services.workshops)
  val peopleService = ApiPeopleService(config.services.people)

  val tokenVerifier = config.application.mode match {
    case "dev" => new StaticTokenVerifier()
    case "prod" => new GoogleTokenVerifier(config.google.oauthClientId)
    case _ => throw new RuntimeException("no valid application mode found")
  }

  // For endpoints that require an API key OR a Google authenticated user.
  val authenticated: Endpoint[ApiUser] = authenticatedBuilder(config.auth, tokenVerifier)
  val authenticatedUser: Endpoint[GoogleUser] = authenticated.mapOutput {
    case -\/(_) => Output.failure(new RuntimeException("This endpoint only accepts an ID-Token"), Status.Unauthorized)
    case \/-(googleUser) => Output.payload(googleUser)
  }

  val cvFormatter = new PdfCVFormatter()

  val policy: Cors.Policy = Cors.Policy(
    allowsOrigin = _ => Some("*"),
    allowsMethods = _ => Some(Seq("GET", "POST", "PUT")),
    allowsHeaders = x => Some(x))

  val cvController = new CVController(cvService, peopleService, cvFormatter, authenticated, authenticatedUser)
  val workshopController = new WorkshopController(workshopService, authenticated)
  val peopleController = new PeopleController(peopleService, authenticatedUser)
  val service = (
    cvController.`GET /employees` :+:
    cvController.`GET /employees/me` :+:
    cvController.`GET /employees/employeeId` :+:
    cvController.`PUT /employees/me` :+:
    cvController.`POST /cvs` :+:
    cvController.`GET /cvs` :+:
    cvController.`GET /cvs/employeeId` :+:
    workshopController.`GET /workshops` :+:
    peopleController.`GET /people/me`
  ).toServiceAs[Application.Json]

  val corsService: Service[Request, Response] = new Cors.HttpFilter(policy).andThen(service)

  val server = Http.server.serve(s":${config.http.port}", corsService)
  logger.info(s"Server running on port ${config.http.port}")
  Await.ready(server)
}
