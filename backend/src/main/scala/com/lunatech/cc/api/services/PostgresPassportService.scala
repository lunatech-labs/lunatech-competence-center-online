package com.lunatech.cc.api.services

import com.lunatech.cc.api.GoogleUser
import doobie.imports._
import fs2.Task
import io.circe.Json

class PostgresPassportService(transactor: Transactor[Task]) extends PassportService {
  import ServicesHelper._
  import PassportQueries._

  override def findByPerson(user: GoogleUser): Option[Json] = findById(user.email)

  override def findById(email: String): Option[Json] =
    findByIDQuery(email).option.transact(transactor).unsafeRun()

  override def findAll: List[Json] = findAllQuery.list.transact(transactor).unsafeRun()

  override def save(email: String, passport: Json): Int =
    saveQuery(email,passport).run.transact(transactor).unsafeRun()


}

/**
  * Separate Query object to be able to check the queries against the db before runtime
  * e.g. findById("erik.janssen@lunatech.com").check.run
  */
object PassportQueries {
  //IntelliJ doesn't understand but this import brings Composite[io.circe.Json] in scope
  import ServicesHelper._

  def findByIDQuery(email: String) = sql"SELECT passport FROM passports WHERE person = ${email} ORDER BY created_on DESC".query[Json]
  def findAllQuery:Query0[Json] = sql"SELECT passport FROM passports".query[Json]
  def saveQuery(email: String, passport: Json) =
    sql"INSERT INTO passports (person, passport, created_on, last_modified_on) VALUES ($email, $passport, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT (person) DO UPDATE SET passport = EXCLUDED.passport,last_modified_on = CURRENT_TIMESTAMP".update


}