package com.lunatech.cc

import com.twitter.util.Future
import com.typesafe.config.Config
import doobie.imports._
import fs2.Task
import io.finch.{Output, _}

/**
  * Created by erikjanssen on 23/07/2017.
  */
package object api {

  def auth[A](token: String)(f: GoogleUser => Output[A])(implicit tokenVerifier: TokenVerifier): Output[A] =
    tokenVerifier.verifyToken(token) match {
      case Some(user) => f(user)
      case None => Unauthorized(new RuntimeException("Invalid token"))
    }

  def authF[A](token: String)(f: GoogleUser => Future[Output[A]])(implicit tokenVerifier: TokenVerifier): Future[Output[A]] =
    tokenVerifier.verifyToken(token) match {
      case Some(user) => f(user)
      case None => Future(Unauthorized(new RuntimeException("Invalid token")))
    }


  val transactorBuilder = (config:Config) => DriverManagerTransactor[Task](
    driver = config.getString("db.driver"),
    url = config.getString("db.url"),
    user = config.getString("db.user"),
    pass = config.getString("db.password")
  )

}
