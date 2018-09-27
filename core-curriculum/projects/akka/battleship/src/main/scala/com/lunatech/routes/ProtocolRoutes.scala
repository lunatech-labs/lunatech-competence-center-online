package com.lunatech.routes

import akka.actor.{ ActorRef, ActorSystem }
import akka.event.Logging
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers.Location
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{ MalformedRequestContentRejection, RejectionHandler, Route }
import akka.http.scaladsl.server.directives.MethodDirectives.post
import akka.http.scaladsl.server.directives.PathDirectives.path
import akka.http.scaladsl.server.directives.RouteDirectives.complete
import akka.pattern.ask
import akka.util.Timeout
import com.lunatech.JsonSupport
import com.lunatech.dto._

import scala.concurrent.duration._
import scala.util.{ Failure, Success }

trait ProtocolRoutes extends JsonSupport {

  // we leave these abstract, since they will be provided by the App
  implicit def system: ActorSystem

  private lazy val log = Logging(system, classOf[ProtocolRoutes])

  // other dependencies that UserRoutes use
  def gameServiceActor: ActorRef

  // Required by the `ask` (?) method below
  private implicit lazy val timeout = Timeout(5.seconds) // usually we'd obtain the timeout from the system's configuration

  lazy val protocolRoutes: Route =
    pathPrefix("protocol" / "game") {
      handleRejections(RejectionHandler.newBuilder()
        .handle { case MalformedRequestContentRejection(msg, _) => complete(StatusCodes.BadRequest -> msg) }
        .result()) {
        concat(
          path("new") { // POST: New Game
            post {
              log.debug("Got a request for creating a new game")
              entity(as[RequestNewGame]) { reqNewGame =>
                onComplete((gameServiceActor ? BattleshipHttpRequest(reqNewGame, isUserRequest = false)).mapTo[Either[LError, ResponseNewGame]]) {
                  case Success(Right(resNewGame)) =>
                    respondWithHeaders(Location(Uri(s"/v1/user/game/${resNewGame.gameId.toString}"))) {
                      complete(StatusCodes.Created -> resNewGame)
                    }

                  case Success(Left(error)) =>
                    complete(HttpResponse(StatusCodes.BadRequest, entity = error.message))

                  case Failure(ex) =>
                    complete(HttpResponse(StatusCodes.InternalServerError, entity = ex.getMessage))
                }
              }
            }
          },
          path(JavaUUID) { gameId => // PUT: Fire upon this instance
            put {
              log.debug("Got a request for receiving fire {}", gameId)
              entity(as[RequestShot]) { reqShot =>
                onComplete((gameServiceActor ? BattleshipHttpRequest(Some(gameId), reqShot, isUserRequest = false)).mapTo[Either[LError, ResponseShot]]) {
                  case Success(Right(resShot)) =>
                    complete(StatusCodes.OK -> resShot)

                  case Success(Left(GameNotFound)) =>
                    complete(HttpResponse(StatusCodes.NotFound, entity = GameNotFound.message))

                  case Success(Left(NotPlayersTurn)) =>
                    complete(HttpResponse(StatusCodes.Conflict, entity = NotPlayersTurn.message))

                  case Success(Left(GameFinished)) =>
                    complete(HttpResponse(StatusCodes.Gone, entity = GameFinished.message))

                  case Failure(ex) =>
                    complete(HttpResponse(StatusCodes.InternalServerError, entity = ex.getMessage))
                }
              }
            }
          })
      }
    }
}
