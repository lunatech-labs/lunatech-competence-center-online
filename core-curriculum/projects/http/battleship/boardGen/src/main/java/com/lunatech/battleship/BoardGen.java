package com.lunatech.battleship;

import java.util.*;

/**
 * Board Generator
 */
public class BoardGen {

  public static int BOARD_SIZE = 16;
  private static int MAX_TRIES = 256;
  private final char EMPTY = '.';
  private final char SHIP = '*';

  private char[][] tmpBoard;

  private BoardGen() {
    this.tmpBoard = generateEmpty();
  }

  private char[][] generateEmpty() {
    char[][] tmp = new char[BOARD_SIZE][BOARD_SIZE];
    for (char[] row : tmp) {
      Arrays.fill(row, EMPTY);
    }

    return tmp;
  }

  private String boardToString() {
    StringBuilder sb = new StringBuilder();
    for (char[] row : tmpBoard) {
      for (char cell : row) {
        sb.append(cell);
      }
      sb.append('\n');
    }

    return sb.toString().trim();
  }

  private List<Ship> buildBoard(Random r) {
    int tries = 0;
    ShipType[] types = ShipType.values();
    List<Ship> ships = new LinkedList<>();
    for (int i = 0; i < types.length; i++) {
      ShipType type = types[i];
      Optional<Ship> shipOpt = tryToPlaceShip(r, type);
      shipOpt.map(ship -> ships.add(ship));
      if (!shipOpt.isPresent()) {
        // If placement wasn't correct, increment tries and step back.
        tries++;
        i--;
      }

      if (tries > MAX_TRIES) {
        throw new IllegalStateException("Reached MAX_TRIES to build a Board");
      }
    }

    return ships;
  }

  private Optional<Ship> tryToPlaceShip(Random r, ShipType type) {
    Ship ship = Ship.random(r, type);
    for (int i = 0; i < ship.length; i++) {
      int x = ship.pos.x;
      int y = ship.pos.y;

      if (ship.rot == Rotation.HORIZONTAL) {
        x += i;
      } else if (ship.rot == Rotation.VERTICAL) {
        y += i;
      }

      if (tmpBoard[y][x] != EMPTY) { // The board is row major.
        return Optional.empty();
      }
    }
    placeShip(ship);

    return Optional.of(ship);
  }

  private void placeShip(Ship ship) {
    for (int i = 0; i < ship.length; i++) {
      int x = ship.pos.x;
      int y = ship.pos.y;

      if (ship.rot == Rotation.HORIZONTAL) {
        x += i;
      } else if (ship.rot == Rotation.VERTICAL) {
        y += i;
      }

      tmpBoard[y][x] = SHIP;
    }
  }

  /**
   * Generate a new random board Board
   * @param seed seed to be used for the RNG.
   * @return ProtoBoard with the board and the ships.
   */
  public static ProtoBoard generate(long seed) {
    return generate(new Random(seed));
  }

  /**
   * Generate a new random board Board
   * @param r RNG.
   * @return ProtoBoard with the board and the ships.
   */
  public static ProtoBoard generate(Random r) {
    BoardGen gen = new BoardGen();
    List<Ship> ships = gen.buildBoard(r);
    return new ProtoBoard(gen.boardToString(), ships);
  }
}
