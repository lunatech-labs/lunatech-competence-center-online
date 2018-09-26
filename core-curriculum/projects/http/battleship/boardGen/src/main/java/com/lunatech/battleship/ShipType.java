package com.lunatech.battleship;

/**
 * Ship types.
 */
public enum ShipType {
  DESTROYER(2),
  SUBMARINE(3),
  CRUISER(3),
  BATTLESHIP(4),
  CARRIER(5);

  public final int length;

  ShipType(int length) {
    this.length = length;
  }

}
