package com.lunatech.dto

import com.lunatech.game.Constants
import org.scalatest.{ MustMatchers, WordSpec }

import scala.util.Try

class ResponseGameStatusSpec extends WordSpec with MustMatchers {

  private val fooPlayer = "foo"
  private val barPlayer = "bar"

  "A GameStatus" should {
    val info = GameInfo(Constants.GameStatus.playerTurn, fooPlayer)
    val fooBoard = Utils.emptyBoard(fooPlayer)
    val barBoard = Utils.emptyBoard(barPlayer)

    "not be created with null values" in {
      withClue(s"With all null values") {
        intercept[IllegalArgumentException] {
          ResponseGameStatus(null, null, null)
        }
      }
      withClue(s"With first null values") {
        intercept[IllegalArgumentException] {
          ResponseGameStatus(null, fooBoard, barBoard)
        }
      }
      withClue(s"With second null values") {
        intercept[IllegalArgumentException] {
          ResponseGameStatus(info, null, barBoard)
        }
      }
      withClue(s"With third null values") {
        intercept[IllegalArgumentException] {
          ResponseGameStatus(info, fooBoard, null)
        }
      }
    }

    "be created correctly" in {
      Try(ResponseGameStatus(info, fooBoard, barBoard)).toOption mustBe defined
    }
  }

  "A GameInfo" should {
    "not be created with null values" in {
      withClue(s"With all null values") {
        intercept[IllegalArgumentException] {
          GameInfo(null, null)
        }
      }
      withClue(s"With first null values") {
        intercept[IllegalArgumentException] {
          GameInfo(null, fooPlayer)
        }
      }
      withClue(s"With second null values") {
        intercept[IllegalArgumentException] {
          GameInfo(Constants.GameStatus.playerTurn, null)
        }
      }
    }

    "be created correctly" in {
      Try(GameInfo(Constants.GameStatus.playerTurn, fooPlayer)).toOption mustBe defined
    }
  }

  "A Board" should {
    val emptyArray = (1 to Constants.boardSize).map { _ =>
      (1 to Constants.boardSize).map(_ => Constants.emptyCell).mkString("")
    }.toArray

    "not be created with null values" in {
      withClue(s"With all null values") {
        intercept[IllegalArgumentException] {
          Board(null, null)
        }
      }
      withClue(s"With first null values") {
        intercept[IllegalArgumentException] {
          Board(null, emptyArray)
        }
      }
      withClue(s"With second null values") {
        intercept[IllegalArgumentException] {
          Board(fooPlayer, null)
        }
      }
    }

    "be created correctly" in {
      Try(Board(fooPlayer, emptyArray)).toOption mustBe defined
    }

    "be created correctly when using 'emptyBoard'" in {
      Try(Utils.emptyBoard(fooPlayer)).toOption mustBe defined
    }
  }

  "A RequestShot" should {
    "not be created with null values" in {
      intercept[IllegalArgumentException] {
        RequestShot(null)
      }
    }

    "not be created with incorrect shots" in {
      intercept[IllegalArgumentException] {
        RequestShot(Array("22x3"))
      }
      intercept[IllegalArgumentException] {
        RequestShot(Array("2x34"))
      }
      intercept[IllegalArgumentException] {
        RequestShot(Array("xx3"))
      }
      intercept[IllegalArgumentException] {
        RequestShot(Array("2xr"))
      }
    }

    "be created with lowercase values" in {
      (0 until Constants.boardSize).foreach { i =>
        (0 until Constants.boardSize).foreach { j =>
          RequestShot(
            Array(
              s"${Integer.toHexString(i).toLowerCase}x${Integer.toHexString(j).toLowerCase}"))
        }
      }
    }

    "be created with uppercase values" in {
      (0 until Constants.boardSize).foreach { i =>
        (0 until Constants.boardSize).foreach { j =>
          RequestShot(
            Array(
              s"${Integer.toHexString(i).toUpperCase}x${Integer.toHexString(j).toUpperCase}"))
        }
      }
    }
  }

  "A ResponseShot" should {
    val gameInfo = GameInfo(Constants.GameStatus.playerTurn, fooPlayer)
    val shotStatus = Map(
      "0x0" -> Constants.Shots.miss)
    "not be created with null values" in {
      withClue(s"With all null values") {
        intercept[IllegalArgumentException] {
          ResponseShot(null, null)
        }
      }
      withClue(s"With first null value") {
        intercept[IllegalArgumentException] {
          ResponseShot(null, shotStatus)
        }
      }
      withClue(s"With second null value") {
        intercept[IllegalArgumentException] {
          ResponseShot(gameInfo, null)
        }
      }
    }

    "not created with empty shots" in {
      intercept[IllegalArgumentException] {
        ResponseShot(gameInfo, Map.empty[String, String])
      }
    }

    "not be created with incorrect shots" in {
      intercept[IllegalArgumentException] {
        ResponseShot(gameInfo, Map("22x3" -> Constants.Shots.miss))
      }
      intercept[IllegalArgumentException] {
        ResponseShot(gameInfo, Map("2x34" -> Constants.Shots.miss))
      }
      intercept[IllegalArgumentException] {
        ResponseShot(gameInfo, Map("xx3" -> Constants.Shots.miss))
      }
      intercept[IllegalArgumentException] {
        ResponseShot(gameInfo, Map("2xr" -> Constants.Shots.miss))
      }
    }

    "be created with lowercase values" in {
      (0 until Constants.boardSize).foreach { i =>
        (0 until Constants.boardSize).foreach { j =>
          ResponseShot(
            gameInfo,
            Map(
              s"${Integer.toHexString(i).toLowerCase}x${Integer.toHexString(j).toLowerCase}" -> Constants.Shots.miss))
        }
      }
    }

    "be created with uppercase values" in {
      (0 until Constants.boardSize).foreach { i =>
        (0 until Constants.boardSize).foreach { j =>
          ResponseShot(
            gameInfo,
            Map(
              s"${Integer.toHexString(i).toUpperCase}x${Integer.toHexString(j).toUpperCase}" -> Constants.Shots.miss))
        }
      }
    }
  }
}
