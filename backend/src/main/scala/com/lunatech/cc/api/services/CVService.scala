package com.lunatech.cc.api.services

import java.util.UUID

import cats.implicits._
import com.lunatech.cc.api.GoogleUser
import com.lunatech.cc.models.CVData

import scala.reflect.runtime.universe.TypeTag
import doobie.imports.{Meta, _}
import fs2.Task
import io.circe.{Decoder, Encoder, Json}
import io.circe.parser.parse
import io.circe.syntax._
import org.postgresql.util.PGobject

trait CVService {


  def findByPerson(user: GoogleUser): List[Json]

  def findById(email: String): List[Json]

  def findAll: List[CVData]

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

  def codecMeta[A >: Null : Encoder : Decoder : TypeTag]: Meta[A] =
    Meta[Json].nxmap[A](
      _.as[A].fold(p => sys.error(p.message), identity),
      _.asJson
    )

  implicit val PersonMeta = codecMeta[CVData]

  override def findByPerson(user: GoogleUser): List[Json] = findById(user.email)

  override def findById(email: String): List[Json] =
      sql"SELECT cv FROM cvs WHERE person = ${email} ORDER BY created_on DESC".query[Json].list.transact(transactor).unsafeRun()

  override def findAll: List[CVData] = sql"SELECT email, cv FROM cvs GROUP BY email ORDER BY email, timestamp".query[CVData].list.transact(transactor).unsafeRun()


  override def insert(email: String, cv: Json): Int =
    sql"INSERT INTO cvs (id, person, cv, created_on) VALUES (${UUID.randomUUID.toString} :: UUID, $email, $cv, CURRENT_TIMESTAMP)".update.run.transact(transactor).unsafeRun()
}

