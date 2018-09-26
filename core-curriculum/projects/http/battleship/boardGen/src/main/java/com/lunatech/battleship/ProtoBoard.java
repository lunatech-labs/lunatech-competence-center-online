package com.lunatech.battleship;

import java.util.List;

public class ProtoBoard {

  public final String board;
  public final List<Ship> ships;

  public ProtoBoard(String board, List<Ship> ships) {
    this.board = board;
    this.ships = ships;
  }

}
