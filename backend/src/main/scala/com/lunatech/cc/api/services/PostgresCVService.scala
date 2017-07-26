package com.lunatech.cc.api.services

import java.util.UUID

import com.lunatech.cc.api.GoogleUser
import doobie.imports._
import fs2.Task
import io.circe.Json

/**
  * Created by erikjanssen on 21/07/2017.
  */
class PostgresCVService(transactor: Transactor[Task]) extends CVService {
  import ServicesHelper._

  override def findByPerson(user: GoogleUser): List[Json] = findById(user.email)

  override def findById(email: String): List[Json] =
      sql"SELECT cv FROM cvs WHERE person = ${email} ORDER BY created_on DESC".query[Json].list.transact(transactor).unsafeRun()

  //  select person, array_agg(cv) as cvs from cvs group by person;
  override def findAll: List[Json] = sql"SELECT cv FROM cvs ORDER BY person ASC".query[Json].list.transact(transactor).unsafeRun()

  override def insert(email: String, cv: Json): Int =
    sql"INSERT INTO cvs (id, person, cv, created_on) VALUES (${UUID.randomUUID.toString} :: UUID, $email, $cv, CURRENT_TIMESTAMP)".update.run.transact(transactor).unsafeRun()
}
