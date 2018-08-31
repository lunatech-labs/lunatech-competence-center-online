package com.lunatech.cc.api.services

import java.util.UUID

import doobie.imports._
import io.circe.Json
import io.circe.parser._
import org.postgresql.util.PGobject
import cats.implicits._


object ServicesHelper {

  implicit val JsonMeta: Meta[Json] =
    Meta.other[PGobject]("json").nxmap[Json](
      a => parse(a.getValue).leftMap[Json](e => throw e).merge, // failure raises an exception
      a => {
        val o = new PGobject
        o.setType("json")
        o.setValue(a.noSpaces)
        o
      }
    )

  implicit val UUIDMeta: Meta[UUID] =
    Meta.other[PGobject]("uuid").nxmap[UUID](
      a => UUID.fromString(a.getValue), // failure raises an exception
      a => {
        val o = new PGobject
        o.setType("uuid")
        o.setValue(a.toString)
        o
      }
    )

}