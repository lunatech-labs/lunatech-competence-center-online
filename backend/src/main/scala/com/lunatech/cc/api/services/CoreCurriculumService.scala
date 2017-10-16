package com.lunatech.cc.api.services

import com.twitter.util.Future
import doobie.imports._
import java.util.UUID
import fs2.Task


trait CoreCurriculumService {
  def getPersonKnowledge(person: String, subject: String): Future[Vector[String]]
  def addPersonKnowledge(person: String, subject: String, topic: String): Future[Unit]
  def removePersonKnowledge(person: String, subject: String, topic: String): Future[Unit]
}

class PostgresCoreCurriculumService(transactor: Transactor[Task]) extends CoreCurriculumService {

  override def getPersonKnowledge(person: String, subject: String): Future[Vector[String]] = {

    val query = sql"""
      SELECT topic
      FROM person_knowledge
      WHERE person = ${person}
      AND subject = ${subject}""".query[String]

    Future { query.vector.transact(transactor).unsafeRun }
  }

  override def addPersonKnowledge(person: String, subject: String, topic: String): Future[Unit] = {

    val id = UUID.randomUUID().toString // TODO, can we stick to UUID here?

    val query = sql"""
      INSERT INTO person_knowledge (id, person, created_on, subject, topic, assessed_on, assessed_by, assessment_notes)
      VALUES ($id :: uuid, ${person}, current_date, $subject, $topic, null, null, null)""".update

    Future { query.run.transact(transactor).unsafeRun }
  }

  override def removePersonKnowledge(person: String, subject: String, topic: String): Future[Unit] = {
    val query = sql"""
                      DELETE FROM person_knowledge
                      WHERE person = $person
                      AND subject = $subject
                      AND topic = $topic""".update

    Future { query.run.transact(transactor).unsafeRun }
  }

}
