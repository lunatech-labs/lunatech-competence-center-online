package com.lunatech.routes

import akka.actor.{ ActorRef, ActorSystem }
import akka.event.Logging
import akka.http.scaladsl.model.headers.Location
import akka.http.scaladsl.model.{ HttpResponse, StatusCodes, Uri }
import akka.http.scaladsl.server.Directives.{ entity, _ }
import akka.http.scaladsl.server.{ MalformedRequestContentRejection, RejectionHandler, Route }
import akka.http.scaladsl.server.directives.MethodDirectives.{ get, post }
import akka.http.scaladsl.server.directives.PathDirectives.path
import akka.http.scaladsl.server.directives.RouteDirectives.complete
import akka.pattern.ask
import akka.util.Timeout
import com.lunatech.JsonSupport
import com.lunatech.dto._

import scala.concurrent.duration._
import scala.util.{ Failure, Success }

trait UserRoutes extends JsonSupport {

  // we leave these abstract, since they will be provided by the App
  implicit def system: ActorSystem

  private lazy val log = Logging(system, classOf[UserRoutes])

  // other dependencies that UserRoutes use
  def gameServiceActor: ActorRef

  // Required by the `ask` (?) method below
  private implicit lazy val timeout = Timeout(5.seconds) // usually we'd obtain the timeout from the system's configuration

  lazy val userRoutes: Route =
    pathPrefix("user" / "game") {
      handleRejections(RejectionHandler.newBuilder()
        .handle { case MalformedRequestContentRejection(msg, _) => complete(StatusCodes.BadRequest -> msg) }
        .result()) {
        concat(
          path("new") { // POST: User requests a new game to another instance
            post {
              log.debug("Got a request for creating a new game")
              entity(as[RequestNewGame]) { reqNewGame =>
                onComplete((gameServiceActor ? BattleshipHttpRequest(reqNewGame, isUserRequest = true)).mapTo[Either[LError, ResponseNewGame]]) {
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
          path(JavaUUID) { gameId => // GET: User requests game status
            get {
              log.debug("Got a request for game status {}", gameId)
              onComplete((gameServiceActor ? BattleshipHttpRequest(Some(gameId), RequestGameStatus, isUserRequest = true)).mapTo[Either[LError, ResponseGameStatus]]) {
                case Success(Right(gameStatus)) =>
                  complete(StatusCodes.OK -> gameStatus)

                case Success(Left(GameNotFound)) =>
                  complete(HttpResponse(StatusCodes.NotFound, entity = GameNotFound.message))

                case Success(Left(GameFinished)) =>
                  complete(HttpResponse(StatusCodes.Gone, entity = GameFinished.message))
              }
            }
          },
          path(JavaUUID / "fire") { gameId => // PUT: User requests to fire upon another instance
            put {
              log.debug("Got a request for receiving fire {}", gameId)
              entity(as[RequestShot]) { reqShot =>
                onComplete((gameServiceActor ? BattleshipHttpRequest(Some(gameId), reqShot, isUserRequest = true)).mapTo[Either[LError, ResponseShot]]) {
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
          },
          path(JavaUUID / "auto") { gameId => // POST: User request a get to set into auto-pilot
            post {
              log.debug("Got a request for auto pilot {}", gameId)
              onComplete((gameServiceActor ? BattleshipHttpRequest(Some(gameId), RequestAutopilot, isUserRequest = true)).mapTo[Either[LError, ResponseAutopilot.type]]) {
                case Success(Right(ResponseAutopilot)) =>
                  complete(StatusCodes.OK)

                case Success(Left(GameAlreadyOnAutoPilot)) =>
                  complete(StatusCodes.BadRequest -> GameAlreadyOnAutoPilot.message)

                case Success(Left(GameNotFound)) =>
                  complete(StatusCodes.NotFound -> GameNotFound.message)

                case Success(Left(GameFinished)) =>
                  complete(StatusCodes.Gone -> GameFinished.message)
              }
            }
          })
      }
    }
}
