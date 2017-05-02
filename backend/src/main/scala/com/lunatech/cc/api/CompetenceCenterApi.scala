package com.lunatech.cc.api

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

  val googleTokenVerifier = new GoogleTokenVerifier("172845937673-smq0kn52ie1spg9irdrhk4stgk7nrp0g.apps.googleusercontent.com")

  val policy: Cors.Policy = Cors.Policy(
    allowsOrigin = _ => Some("*"),
    allowsMethods = _ => Some(Seq("GET", "POST", "PUT", "DELETE")),
    allowsHeaders = x => Some(x))

  val cvController = new CVController(googleTokenVerifier, transactor)

  val service = (cvController.`GET /employees` :+: cvController.`GET /employees/employeeId` :+: cvController.`GET /employees/me` :+: cvController.`PUT /employees/me` :+: cvController.`POST /cvs`).toServiceAs[Application.Json]

  val corsService: Service[Request, Response] = new Cors.HttpFilter(policy).andThen(service)

  val server = Http.server.serve(":9000", corsService)
  Await.ready(server)
}
