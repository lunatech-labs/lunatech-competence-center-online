package com.lunatech.routes

import java.util.UUID

import akka.actor.{ ActorRef, ActorSystem, Props }
import akka.http.javadsl.model.HttpEntities
import akka.http.scaladsl.marshalling.Marshal
import akka.http.scaladsl.model.{ ContentTypes, HttpRequest, MessageEntity, StatusCodes }
import akka.http.scaladsl.testkit.{ RouteTestTimeout, ScalatestRouteTest }
import com.lunatech.dto.{ RequestNewGame, RequestShot, ResponseNewGame, ResponseShot }
import com.lunatech.game.Constants
import com.lunatech.services.DummyGameActor
import org.scalatest.{ Matchers, WordSpec }
import org.scalatest.concurrent.ScalaFutures

import scala.concurrent.duration.DurationInt

class ProtocolRoutesSpec
  extends WordSpec
  with Matchers
  with ScalaFutures
  with ScalatestRouteTest
  with ProtocolRoutes {

  private val thisUserId = "foo-player"
  private val thisUserName = "Mr. Foo"
  private val thisProtocol = "127.0.0.1:8081"
  private val oppoUserId = "bar-player"
  private val oppoUserName = "Mr. Bar"
  private val oppoProtocol = "127.0.0.1:8080"
  private val maxTries = 50

  override val gameServiceActor: ActorRef = system.actorOf(Props(new DummyGameActor(thisUserId, thisUserName, thisProtocol)))
  implicit def default(implicit system: ActorSystem) = RouteTestTimeout(5.seconds)

  lazy val routes = protocolRoutes

  "ProtocolRoutes" should {
    "create a game correctly (POST /protocol/game/new)" in {
      val game = RequestNewGame(
        oppoUserId,
        Option(oppoUserName),
        oppoProtocol,
        Constants.Rules.standard)
      val reqEntity = Marshal(
        game).to[MessageEntity].futureValue

      val request = Post("/protocol/game/new").withEntity(reqEntity)

      request ~> routes ~> check {
        status should ===(StatusCodes.Created)
        contentType should ===(ContentTypes.`application/json`)
        val res = entityAs[ResponseNewGame]
        res.userId should ===(thisUserId)
        res.fullName should ===(thisUserName)
        res.rules should ===(game.rules)
        assert(res.starting == thisUserId || res.starting == oppoUserId, "Starting player must be one or the other")
      }
    }

    "respond 400 when the request is invalid (PUT /protocol/game/new)" in {
      val request = Post(s"/protocol/game/new")
        .withEntity(HttpEntities.create(
          ContentTypes.`application/json`,
          """{"foo": 123, "bar": "baz"}"""))

      request ~> routes ~> check {
        status should ===(StatusCodes.BadRequest)
      }
    }

    "respond to a ShotRequest properly (PUT /protocol/game/<game-id>)" in {
      val newGameReqEntity = Marshal(
        RequestNewGame(
          oppoUserId,
          Option(oppoUserName),
          oppoProtocol,
          Constants.Rules.standard)).to[MessageEntity].futureValue

      val tries = (0 to maxTries).exists { _ =>
        val newGameRequest = Post("/protocol/game/new").withEntity(newGameReqEntity)

        newGameRequest ~> routes ~> check {
          val res = entityAs[ResponseNewGame]
          if (res.starting == oppoUserId) {
            // The opponent can fire, because he starts
            val position = "0x0"
            val shotEntity = Marshal(
              RequestShot(Array(position))).to[MessageEntity].futureValue

            val reqShot = Put(s"/protocol/game/${res.gameId.toString}").withEntity(shotEntity)
            reqShot ~> routes ~> check {
              status should ===(StatusCodes.OK)
              contentType should ===(ContentTypes.`application/json`)
              val res = entityAs[ResponseShot]

              res.game.owner should ===(thisUserId)
              res.game.status should ===(Constants.GameStatus.playerTurn)
              res.shots.get(position) shouldBe defined
              res.shots.get(position).filter(Constants.Shots.allShots.contains) shouldBe defined
            }
            true
          } else {
            false
          }

        }
      }

      withClue("The 'starting' user must be either this or opponent, looks like it's never the opponent") {
        tries should ===(true)
      }
    }

    "respond 400 when the request is invalid (PUT /protocol/game/<game-id>)" in {
      val invalidGameId = UUID.randomUUID().toString
      val reqShot = Put(s"/protocol/game/$invalidGameId")
        .withEntity(HttpEntities.create(
          ContentTypes.`application/json`,
          """{"foo": 123, "bar": "baz"}"""))

      reqShot ~> routes ~> check {
        status should ===(StatusCodes.BadRequest)
      }
    }

    "respond 404 when the game doesn't exist (PUT /protocol/game/<game-id>)" in {
      val invalidGameId = UUID.randomUUID().toString
      val position = "0x0"
      val shotEntity = Marshal(
        RequestShot(Array(position))).to[MessageEntity].futureValue

      val reqShot = Put(s"/protocol/game/$invalidGameId").withEntity(shotEntity)
      reqShot ~> routes ~> check {
        status should ===(StatusCodes.NotFound)
      }
    }

    "respond 409 when it's not opponent's turn (PUT /protocol/game/<game-id>)" in {
      val newGameReqEntity = Marshal(
        RequestNewGame(
          oppoUserId,
          Option(oppoUserName),
          oppoProtocol,
          Constants.Rules.standard)).to[MessageEntity].futureValue

      val tries = (0 to maxTries).exists { _ =>
        val newGameRequest = Post("/protocol/game/new").withEntity(newGameReqEntity)

        newGameRequest ~> routes ~> check {
          val res = entityAs[ResponseNewGame]
          if (res.starting == thisUserId) {
            // The opponent can fire, because he starts
            val position = "0x0"
            val shotEntity = Marshal(
              RequestShot(Array(position))).to[MessageEntity].futureValue

            val reqShot = Put(s"/protocol/game/${res.gameId.toString}").withEntity(shotEntity)
            reqShot ~> routes ~> check {
              status should ===(StatusCodes.Conflict)
            }
            true
          } else {
            false
          }

        }
      }

      withClue("The 'starting' user must be either this or opponent, looks like it's never thisUser") {
        tries should ===(true)
      }
    }
  }
}
