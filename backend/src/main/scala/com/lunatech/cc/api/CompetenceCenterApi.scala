package com.lunatech.cc.api

import com.lunatech.cc.api.services.ApiPeopleService
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

  val config = ConfigFactory.load()

  lazy val logger: Logger = getLogger(getClass)

  val transactor = DriverManagerTransactor[Task](
    driver = config.getString("db.driver"),
    url = config.getString("db.url"),
    user = config.getString("db.user"),
    pass = config.getString("db.password")
  )

  DBMigration.migrate()

  val port = config.getInt("server.port")

  val cvService = new PostgresCVService(transactor)

  val apiPeopleService = ApiPeopleService(config)
  val tokenVerifier = config.getString("application.mode") match {
    case "dev" => new StaticTokenVerifier()
    case "prod" => new GoogleTokenVerifier(config.getString("google.clientId"))
    case _ => throw new RuntimeException("no valid application mode found")
  }

  val cvFormatter = new PdfCVFormatter()

  val policy: Cors.Policy = Cors.Policy(
    allowsOrigin = _ => Some("*"),
    allowsMethods = _ => Some(Seq("GET", "POST", "PUT")),
    allowsHeaders = x => Some(x))

  val cvController = new CVController(tokenVerifier, cvService, apiPeopleService, cvFormatter)

  val service = (cvController.`GET /employees` :+: cvController.`GET /employees/me` :+: cvController.`GET /employees/employeeId` :+: cvController.`PUT /employees/me` :+: cvController.`POST /cvs` :+: cvController.`GET /cvs` :+: cvController.`GET /cvs/employeeId`).toServiceAs[Application.Json]

  val corsService: Service[Request, Response] = new Cors.HttpFilter(policy).andThen(service)

  val server = Http.server.serve(s":$port", corsService)
  logger.info(s"Server running on port $port")
  Await.ready(server)
}
