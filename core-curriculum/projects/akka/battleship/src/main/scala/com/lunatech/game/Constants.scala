package com.lunatech.game

/**
 * Constants used throughout the game.
 */
object Constants {

  /** Size of the board (Width and Height) */
  final val boardSize = 16

  // Cell types.
  final val emptyCell = '.'
  final val shotCell = 'X'
  final val shipCell = '*'
  final val missCell = '-'

  object GameStatus {
    final val playerTurn = "player_turn"
    final val won = "won"
  }

  object Rules {
    final val standard = "standard"
    final val desperation = "desperation"
    final val superCharge = "super-charge"
    def xShot(rule: String): Boolean = rule.matches("\\d-shot")
    final val allRules = List(standard, desperation, superCharge) ++ (1 to 10).map(n => s"${n}-shot").toList
  }

  object Shots {
    final val hit = "hit"
    final val miss = "miss"
    final val kill = "kill"
    def isShot(shot: String): Boolean = shot.matches("[0-9a-fA-F]x[0-9a-fA-F]")
    final val allShots = List(hit, miss, kill)
  }
}
