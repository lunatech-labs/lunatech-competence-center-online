package com.lunatech.battleship;

import java.util.Random;

/**
 * Minimal ship with position, rotation and length.
 */
public class Ship {

  public final Position pos;
  public final Rotation rot;
  public final int length;

  public Ship(Position pos, Rotation rot, int length) {
    if (length <= 0) {
      throw new IllegalArgumentException("Ship's length cannot be negative or zero");
    }
    this.pos = pos;
    this.rot = rot;
    this.length = length;
  }

  public static Ship random(Random r, ShipType type) {
    Rotation rot = Rotation.random(r);
    return new Ship(rot == Rotation.HORIZONTAL ? Position.randomHor(r, type.length) : Position.randomVer(r, type.length), rot, type.length);
  }
}
