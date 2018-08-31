package com.lunatech.cc.api.services

import java.util.UUID

import com.lunatech.cc.api.EnrichedGoogleUser
import com.lunatech.cc.models.CVData
import doobie.imports._
import fs2.Task
import io.circe.Json

trait CVService {
  def findById(id: UUID): Option[Json]

  def findByPerson(user: EnrichedGoogleUser): List[CVData]

  def findByPersonId(email: String): List[CVData]

  def findAll: Map[String,List[CVData]]

  def insert(uuid: UUID, email: String, cv: Json): Int
}

class PostgresCVService(transactor: Transactor[Task]) extends CVService {

  import ServicesHelper._

  override def findByPersonId(email: String): List[CVData] = sql"SELECT id, cv FROM cvs WHERE person = ${email} ORDER BY created_on DESC"
    .query[(String,Json)].to[List].map {
    results =>
      results.groupBy(_._1).flatMap {
        case(i,d) => d map { case (s,j) => CVData(s,j) }
      }.toList
  }.transact(transactor).unsafeRun()

  override def findByPerson(user: EnrichedGoogleUser): List[CVData] = findByPersonId(user.email)

  override def findById(id: UUID): Option[Json] =
      sql"SELECT cv FROM cvs WHERE id = (${id.toString} :: UUID) ".query[Json].option.transact(transactor).unsafeRun()

  override def findAll: Map[String,List[CVData]] = sql"SELECT person, id, cv FROM cvs ORDER BY person ASC"
    .query[(String, String, Json)].to[List].map {
    results =>
      results.groupBy(_._1).map {
        case(i,d) => (i,d.map(x => CVData(x._2,x._3)))
      }
  }.transact(transactor).unsafeRun()

  override def insert(uuid: UUID, email: String, cv: Json): Int =
    sql"INSERT INTO cvs (id, person, cv, created_on) VALUES (${uuid.toString} :: UUID, $email, $cv, CURRENT_TIMESTAMP)".update.run.transact(transactor).unsafeRun()
}
