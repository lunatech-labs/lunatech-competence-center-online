package com.lunatech.cc.api

import com.lunatech.cc.formatter.PdfCVFormatter
import com.twitter.finagle.http.filter.Cors
import com.twitter.finagle.http.{Request, Response}
import com.twitter.finagle.{Http, Service}
import com.twitter.util.Await
import com.typesafe.config.ConfigFactory
import doobie.imports._
import fs2._
import io.finch._
import io.finch.circe._

object CompetenceCenterApi extends App {

  val config = ConfigFactory.load()

  val transactor = DriverManagerTransactor[Task](
    driver = config.getString("db.driver"),
    url = config.getString("db.url"),
    user = config.getString("db.user"),
    pass = config.getString("db.password")
  )

  val cvService = new PostgresCVService(transactor)

  val tokenVerifier = new GoogleTokenVerifier(config.getString("google.clientId"))

  val cvFormatter = new PdfCVFormatter()

  val policy: Cors.Policy = Cors.Policy(
    allowsOrigin = _ => Some("*"),
    allowsMethods = _ => Some(Seq("GET", "POST", "PUT")),
    allowsHeaders = x => Some(x))

  val cvController = new CVController(tokenVerifier, cvService, cvFormatter)

  val service = (cvController.`GET /employees` :+: cvController.`GET /employees/me` :+: cvController.`GET /employees/employeeId` :+: cvController.`PUT /employees/me` :+: cvController.`POST /cvs`).toServiceAs[Application.Json]

  val corsService: Service[Request, Response] = new Cors.HttpFilter(policy).andThen(service)

  val server = Http.server.serve(":9000", corsService)
  Await.ready(server)
}
