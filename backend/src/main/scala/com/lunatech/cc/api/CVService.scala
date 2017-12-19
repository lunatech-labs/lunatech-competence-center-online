package com.lunatech.cc.api

import java.util.UUID

import cats.implicits._
import doobie.imports.{Meta, _}
import fs2.Task
import io.circe.Json
import io.circe.parser.parse
import org.postgresql.util.PGobject

trait CVService {
  def findById(email: String): Option[Json]

  def findAll: List[Json]

  def insert(email: String, cv: Json): Int
}

class PostgresCVService(transactor: Transactor[Task]) extends CVService {

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

  override def findById(email: String): Option[Json] =
      sql"SELECT cv FROM cvs WHERE person = ${email} ORDER BY created_on DESC LIMIT 1".query[Json].option.transact(transactor).unsafeRun()

  override def findAll: List[Json] = sql"SELECT cv FROM cvs".query[Json].list.transact(transactor).unsafeRun()

  override def insert(email: String, cv: Json): Int =
    sql"INSERT INTO cvs (id, person, cv, created_on) VALUES (${UUID.randomUUID.toString} :: UUID, $email, $cv, CURRENT_TIMESTAMP)".update.run.transact(transactor).unsafeRun()
}
