package com.lunatech

import java.net.InetAddress

import akka.actor.{ ActorRef, ActorSystem, Props }
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{ Route, RouteConcatenation }
import akka.stream.ActorMaterializer
import com.lunatech.routes.{ ProtocolRoutes, SwaggerRoutes, UserRoutes }
import com.lunatech.services.DummyGameActor

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.Try

object LunatechBattleshipServer extends App with UserRoutes with ProtocolRoutes with RouteConcatenation {

  implicit val system: ActorSystem = ActorSystem("lunatechBattleshipServer")
  implicit val materializer: ActorMaterializer = ActorMaterializer()
  private val config = system.settings.config
  private val hostname = config.getString("battleship.hostname")
  private val port = config.getInt("battleship.port")
  private val userId = config.getString("battleship.user.id")
  private val userName = Try(config.getString("battleship.user.fullname")).toOption.getOrElse(userId)
  private val protocol = s"${InetAddress.getLocalHost().getHostAddress}:$port"
  private val swagger = new SwaggerRoutes(protocol)

  // TODO here goes your actor!
  val gameServiceActor: ActorRef = system.actorOf(Props(new DummyGameActor(userId, userName, protocol)), "gameServiceActor")

  lazy val routes: Route =
    pathPrefix("v1") {
      concat(
        userRoutes,
        protocolRoutes,
        swagger.swaggerRoutes)
    }

  Http().bindAndHandle(routes, hostname, port)

  println(
    s"""
       |================================================
       |         ${Console.BOLD}Lunatech Akka Battleship${Console.RESET}
       |================================================
       | - HTTP Server bound at '${Console.GREEN}http://$hostname:$port/${Console.RESET}'
       | - The Swagger docs are at '${Console.GREEN}http://$protocol/v1/swagger-ui/index.html${Console.RESET}'
       | - Your protocol is '${Console.GREEN}$protocol${Console.RESET}'
       | - You've identified yourself with id '${Console.GREEN}$userId${Console.RESET}' and name '${Console.GREEN}$userName${Console.RESET}'
       |
       | Have fun!
       |
    """.stripMargin)

  Await.result(system.whenTerminated, Duration.Inf)
}
