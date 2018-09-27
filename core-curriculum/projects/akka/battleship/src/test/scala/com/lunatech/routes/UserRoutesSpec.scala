package com.lunatech.routes

import java.util.UUID

import akka.actor.{ ActorRef, ActorSystem, Props }
import akka.http.scaladsl.marshalling.Marshal
import akka.http.scaladsl.model._
import akka.http.scaladsl.testkit.{ RouteTestTimeout, ScalatestRouteTest }
import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.client.WireMock._
import com.lunatech.dto.{ RequestNewGame, RequestShot, ResponseGameStatus, ResponseNewGame }
import com.lunatech.game.Constants
import com.lunatech.services.DummyGameActor
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.{ BeforeAndAfterAll, Matchers, WordSpec }

import scala.concurrent.duration.DurationInt
import scala.util.Random

class UserRoutesSpec
  extends WordSpec
  with Matchers
  with ScalaFutures
  with ScalatestRouteTest
  with BeforeAndAfterAll
  with UserRoutes {

  private val thisUserId = "foo-player"
  private val thisUserName = "Mr. Foo"
  private val thisProtocol = "127.0.0.1:8081"
  private val oppoUserId = "bar-player"
  private val oppoUserName = "Mr. Bar"
  private val oppoProtoPort = 8080
  private val oppoProtocol = s"127.0.0.1:$oppoProtoPort"
  private val maxTries = 50
  private val wireMockServer = new WireMockServer(oppoProtoPort)

  override val gameServiceActor: ActorRef = system.actorOf(Props(new DummyGameActor(thisUserId, thisUserName, thisProtocol)))
  implicit def default(implicit system: ActorSystem) = RouteTestTimeout(5.seconds)

  private def newGameRequest(protocol: String = oppoProtocol): (RequestNewGame, HttpRequest) = {
    val game = RequestNewGame(
      thisUserId,
      Option(thisUserName),
      protocol,
      Constants.Rules.standard)
    val reqEntity = Marshal(
      game).to[MessageEntity].futureValue

    game -> Post("/user/game/new").withEntity(reqEntity)
  }

  private def withValidGameRequest(body: (RequestNewGame, ResponseNewGame) => Unit): Unit = {
    val (game, request) = newGameRequest()

    mockNormalRequestNewGame()
    request ~> routes ~> check {
      withClue("Game should be created correctly") {
        status should ===(StatusCodes.Created)
        contentType should ===(ContentTypes.`application/json`)
      }
      body(game, entityAs[ResponseNewGame])
    }
  }

  lazy val routes = userRoutes

  "UserRoutes" should {
    "create a game correctly (POST /user/game/new)" in {
      val (game, request) = newGameRequest()

      mockNormalRequestNewGame()
      request ~> routes ~> check {
        status should ===(StatusCodes.Created)
        contentType should ===(ContentTypes.`application/json`)
        val res = entityAs[ResponseNewGame]
        withClue("The response we get from an New Game request should contain the Opponent's ID") {
          res.userId should ===(oppoUserId)
        }
        withClue("The response we get from an New Game request should contain the Opponent's full name") {
          res.fullName should ===(oppoUserName)
        }
        withClue("The response we get from an New Game request should the same rules we requested") {
          res.rules should ===(game.rules)
        }
        assert(res.starting == thisUserId || res.starting == oppoUserId, "Starting player must be one or the other")
      }
    }

    "not create a game when opponent's protocol has an error (POST /user/game/new)" in {
      val (_, request) = newGameRequest()

      mockInternalServerErrorRequestNewGame()
      request ~> routes ~> check {
        status should ===(StatusCodes.InternalServerError)
      }
    }

    "not create a game when opponent's protocol doesn't exist (POST /user/game/new)" in {
      val (_, request) = newGameRequest("172.0.0.1:55842")

      request ~> routes ~> check {
        handled shouldBe false
      }
    }

    "fire to a game correctly (PUT /user/game/<gameId>/fire)" in {
      withValidGameRequest { (req, res) =>
        val gameId = res.gameId

        val fireRequest = Put(s"/user/game/$gameId/fire")
          .withEntity(Marshal(
            RequestShot(Array("0x0"))).to[MessageEntity].futureValue)
        fireRequest ~> routes ~> check {
          status should ===(StatusCodes.OK)
        }
      }
    }

    "set a game in auto pilot correctly (POST /user/game/<gameId>/auto)" in {
      withValidGameRequest { (_, res) =>
        val gameId = res.gameId

        val autoPilotRequest = Post(s"/user/game/$gameId/auto")
        autoPilotRequest ~> routes ~> check {
          status should ===(StatusCodes.OK)
        }
      }
    }

    "fail to set a game in auto pilot for a second time (POST /user/game/<gameId>/auto)" in {
      withValidGameRequest { (_, res) =>
        val gameId = res.gameId

        val firstAutoPilotRequest = Post(s"/user/game/$gameId/auto")
        firstAutoPilotRequest ~> routes ~> check {
          withClue("First time should be possible to set the game on auto-pilot") {
            status should ===(StatusCodes.OK)
          }

          val secondAutoPilotRequest = Post(s"/user/game/$gameId/auto")
          secondAutoPilotRequest ~> routes ~> check {
            status should ===(StatusCodes.BadRequest)
          }
        }
      }
    }

    "get the status of a game correctly (GET /user/game/<gameId>)" in {
      withValidGameRequest { (_, res) =>
        val gameId = res.gameId

        val gameStatusRequest = Get(s"/user/game/$gameId")
        gameStatusRequest ~> routes ~> check {
          status should ===(StatusCodes.OK)
          contentType should ===(ContentTypes.`application/json`)

          val res = entityAs[ResponseGameStatus]
          assert(res.game.owner == thisUserId || res.game.owner == oppoUserId, "Owner player must be one or the other")
          res.game.status should ===(Constants.GameStatus.playerTurn)
        }
      }
    }

    "get 404 on every route with wrong Game ID" in {
      val gameId = UUID.randomUUID()

      withClue("Game Status url should give 404:") {
        val gameStatusRequest = Get(s"/user/game/$gameId")
        gameStatusRequest ~> routes ~> check {
          status should ===(StatusCodes.NotFound)
        }
      }

      withClue("Fire url should give 404:") {
        val fireRequest = Put(s"/user/game/$gameId/fire")
          .withEntity(Marshal(
            RequestShot(Array("0x0"))).to[MessageEntity].futureValue)
        fireRequest ~> routes ~> check {
          status should ===(StatusCodes.NotFound)
        }
      }

      withClue("Autopilot url should give 404:") {
        val autoPilot = Post(s"/user/game/$gameId/auto")
        autoPilot ~> routes ~> check {
          status should ===(StatusCodes.NotFound)
        }
      }
    }
  }

  private def mockNormalRequestNewGame(): Unit = {
    wireMockServer.stubFor(post(urlEqualTo("/v1/protocol/game/new"))
      .withHeader("Content-Type", equalTo("application/json"))
      .willReturn(aResponse()
        .withStatus(StatusCodes.Created.intValue)
        .withHeader("Content-Type", "application/json")
        .withBody(
          resNewGameFormat.write(
            ResponseNewGame(
              oppoUserId,
              oppoUserName,
              UUID.randomUUID(),
              thisUserId, // This should be random, but it's easier to test fires.
              Constants.Rules.standard)).compactPrint)))
  }

  private def mockInternalServerErrorRequestNewGame(): Unit = {
    wireMockServer.stubFor(post(urlEqualTo("/v1/protocol/game/new"))
      .withHeader("Content-Type", equalTo("application/json"))
      .willReturn(aResponse()
        .withStatus(StatusCodes.InternalServerError.intValue)))
  }

  override def beforeAll(): Unit = {
    super.beforeAll()
    wireMockServer.start()
  }

  override def afterAll(): Unit = {
    super.afterAll()
    wireMockServer.stop()
  }
}
