package com.lunatech.cc.api

import io.finch._
import com.twitter.finagle.http.filter.Cors
import com.twitter.finagle.Http
import com.twitter.finagle.Service
import com.twitter.finagle.http.{Request, Response }
import com.twitter.finagle.http.Response
import com.twitter.util.Await
import com.twitter.io.{ Buf, Reader }
import io.finch.circe._

import io.circe._
import io.circe.generic.semiauto._

object CompetenceCenterApi extends App {

  val googleTokenVerifier = new GoogleTokenVerifier("172845937673-smq0kn52ie1spg9irdrhk4stgk7nrp0g.apps.googleusercontent.com")

  val policy: Cors.Policy = Cors.Policy(
    allowsOrigin = _ => Some("*"),
    allowsMethods = _ => Some(Seq("GET", "POST")),
    allowsHeaders = x => Some(x))

  val cvController = new CVController(googleTokenVerifier)

  val service = (cvController.`GET /cvs/me`).toServiceAs[Application.Json]

  val corsService: Service[Request, Response] = new Cors.HttpFilter(policy).andThen(service)

  val server = Http.server.serve(":9000", corsService)
  Await.ready(server)
}
