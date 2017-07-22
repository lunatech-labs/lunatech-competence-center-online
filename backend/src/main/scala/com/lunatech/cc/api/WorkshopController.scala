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

class WorkshopController(tokenVerifier: TokenVerifier, workshopService: WorkshopService) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /workshops`: Endpoint[Json] = get("workshops" :: tokenHeader) { (token: String) =>
    logger.debug(s"GET /workshops with $token")
    authF(token) { _ =>

      for {
        workshops <- workshopService.listWorkshops
      } yield Ok(workshops.asJson)

    }
  }

  // FIXME, reuse of this shizzle between controllers
  private def auth[A](token: String)(f: GoogleUser => Output[A]): Output[A] =
    tokenVerifier.verifyToken(token) match {
      case Some(user) => f(user)
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }

  // FIXME, reuse of this shizzle between controllers
  private def authF[A](token: String)(f: GoogleUser => Future[Output[A]]): Future[Output[A]] =
    tokenVerifier.verifyToken(token) match {
      case Some(user) => f(user)
      case None => Future(Unauthorized(new RuntimeException("Invalid token")))
    }
}
