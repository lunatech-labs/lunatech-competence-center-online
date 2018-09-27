package com.lunatech.services

import akka.actor.Actor
import com.lunatech.JsonSupport
import com.lunatech.dto._

/**
 * This dummy actor will ignore every message (just for testing purposes).
 */
class DummyGameActor(thisUserId: String, thisUserFullName: String, thisProtocol: String) extends Actor with JsonSupport {

  override def receive: Receive = protocolReceive orElse userReceive

  /**
   * Protocol API requests and response
   */
  private def protocolReceive: Receive = {
    case BattleshipHttpRequest(None, RequestNewGame(opponentId, opponentFullName, opponentProtocol, rules), false) =>
    // Protocol: Create New Game

    case BattleshipHttpRequest(Some(gameId), RequestShot(shots), false) =>
    // Protocol: Receive Fire from opponent
  }

  /**
   * User API requests and response
   */
  private def userReceive: Receive = {
    case BattleshipHttpRequest(None, RequestNewGame(opponentId, opponentFullName, opponentProtocol, rules), true) =>
    // User: Create New Game

    case BattleshipHttpRequest(Some(gameId), RequestGameStatus, true) =>
    // User: Get Game Status

    case BattleshipHttpRequest(Some(gameId), RequestShot(shots), true) =>
    // User: Send Fire to opponent

    case BattleshipHttpRequest(Some(gameId), RequestAutopilot, true) =>
    // User: Set game on autopilot
  }

}
