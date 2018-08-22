package com.lunatech.battleship;

import java.util.Random;

/**
 * Position class with x and y coordinates.
 */
public class Position {

  public final int x;
  public final int y;

  public Position(int x, int y) {
    if (x < 0 || x >= BoardGen.BOARD_SIZE) {
      throw new IllegalArgumentException("X coordinate should be between 0 and BOARD_SIZE");
    }
    if (y < 0 || y >= BoardGen.BOARD_SIZE) {
      throw new IllegalArgumentException("Y coordinate should be between 0 and BOARD_SIZE");
    }

    this.x = x;
    this.y = y;
  }

  public static Position random(Random r) {
    return new Position(r.nextInt(BoardGen.BOARD_SIZE), r.nextInt(BoardGen.BOARD_SIZE));
  }

  public static Position randomHor(Random r, int length) {
    return new Position(r.nextInt(BoardGen.BOARD_SIZE - length), r.nextInt(BoardGen.BOARD_SIZE));
  }

  public static Position randomVer(Random r, int length) {
    return new Position(r.nextInt(BoardGen.BOARD_SIZE), r.nextInt(BoardGen.BOARD_SIZE - length));
  }
}
