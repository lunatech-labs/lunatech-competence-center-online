package com.lunatech.cc.api.services

import java.util.UUID

import com.lunatech.cc.api.EnrichedGoogleUser
import doobie.imports._
import fs2.Task
import io.circe.Json

trait CVService {
  def findById(id: UUID): Option[Json]

  def findByPerson(user: EnrichedGoogleUser): List[Json]

  def findByPersonId(email: String): List[Json]

  def findAll: Map[String,List[(UUID,Json)]]

  def insert(email: String, cv: Json): Int
}

class PostgresCVService(transactor: Transactor[Task]) extends CVService {

  import ServicesHelper._

  override def findByPersonId(email: String): List[Json] = sql"SELECT cv FROM cvs WHERE person = ${email} ORDER BY created_on DESC".query[Json].list.transact(transactor).unsafeRun()

  override def findByPerson(user: EnrichedGoogleUser): List[Json] = findByPersonId(user.email)

  override def findById(id: UUID): Option[Json] =
      sql"SELECT cv FROM cvs WHERE id = ${id.toString} ORDER BY created_on DESC".query[Json].option.transact(transactor).unsafeRun()

  override def findAll: Map[String,List[(UUID,Json)]] = sql"SELECT person, id, cv FROM cvs ORDER BY person ASC".query[(String, UUID, Json)].to[List].map {
    results =>
      results.groupBy(_._1).map {
        case(i,d) => (i,d.map(x => (x._2,x._3)))
      }
  }.transact(transactor).unsafeRun()

  override def insert(email: String, cv: Json): Int =
    sql"INSERT INTO cvs (id, person, cv, created_on) VALUES (${UUID.randomUUID.toString} :: UUID, $email, $cv, CURRENT_TIMESTAMP)".update.run.transact(transactor).unsafeRun()
}
