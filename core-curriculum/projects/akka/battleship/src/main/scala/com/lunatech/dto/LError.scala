package com.lunatech.dto

/**
 * Base trait for all Error.
 */
sealed trait LError {
  def message: String
}

/**
 * Error returned when the endpoint has not being implemented.
 */
case object NotImplemented extends LError { val message = "This endpoint has not been implemented yet!" }

/**
 * Generic Protocol API error.
 */
case object ProtocolError extends LError { val message = "There was a problem with the protocol" }

/**
 * Error returned when a game it's not found.
 */
case object GameNotFound extends LError { val message = "The requested game doesn't exist" }

/**
 * Error returned when a request has invalid format or input.
 */
case object InvalidInput extends LError { val message = "The attached input is invalid" }

/**
 * Same as previous but also when you want to provide further details.
 * @param message message to show.
 */
case class InvalidInputWithMessage(message: String) extends LError

/**
 * Error returned when a request has been done during an incorrect game status.
 */
case object IncorrectGameStatus extends LError { val message = "The game status is incorrect for the action you're planning to do" }

/**
 * Error returned when a player tries to do something but it's not her/his turn.
 */
case object NotPlayersTurn extends LError { val message = "The game status is incorrect for the action you're planning to do, it's not your turn" }

/**
 * Error returned when has finished and has been deleted from our 'storage'.
 */
case object GameFinished extends LError { val message = "The requested game has been finished" }

/**
 * Error returned when a player tries to set a game into auto pilot more than once.
 */
case object GameAlreadyOnAutoPilot extends LError { val message = "The requested game it's already on auto-pilot" }
