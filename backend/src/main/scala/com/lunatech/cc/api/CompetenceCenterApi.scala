package com.lunatech.cc.api

import com.lunatech.cc.formatter.{CVFormatter, PdfCVFormatter}
import com.twitter.finagle.{Http, Service}
import com.twitter.finagle.http.{Request, Response}
import com.twitter.finagle.http.filter.Cors
import com.twitter.util.Await
import doobie.imports._
import fs2._
import io.finch._
import io.finch.circe._

object CompetenceCenterApi extends App {

  val transactor = DriverManagerTransactor[Task](
    "org.postgresql.Driver", "jdbc:postgresql:competence-center?loggerLevel=DEBUG", "postgres", "")

  val cvService = new PostgresCVService(transactor)

  val tokenVerifier = new GoogleTokenVerifier("172845937673-smq0kn52ie1spg9irdrhk4stgk7nrp0g.apps.googleusercontent.com")

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
