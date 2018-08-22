package com.lunatech.battleship;

import java.util.Random;

/**
 * Possible rotations for each ship.
 */
public enum Rotation {
  HORIZONTAL, VERTICAL;

  public static Rotation random(Random r) {
    return r.nextBoolean() ? HORIZONTAL : VERTICAL;
  }
}
