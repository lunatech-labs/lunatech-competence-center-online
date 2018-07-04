package com.lunatech.cc.api.services

import java.io.{File, FileFilter}

import com.twitter.util.Future
import doobie.imports._
import java.util.UUID

import io.circe._
import io.circe.parser.decode
import io.circe.generic.auto._
import fs2.Task
import org.slf4j.Logger
import org.slf4j.LoggerFactory.getLogger

import scala.io.Source

object CoreCurriculumService {
  case class TopicSummary(id: String,
                          name: String,
                          tags: Set[String])

  case class SubjectSummary(id: String,
                            name: String,
                            description: String,
                            tags: Set[String],
                            topics: Set[TopicSummary],
                            image: String,
                            primary: Boolean)

  object SubjectSummary {
    // Manual decoder, to deal with 'primary' being an optional field, defaulting to false.
    implicit val decodeSubjectSummary: Decoder[SubjectSummary] = new Decoder[SubjectSummary] {
      final def apply(c: HCursor): Decoder.Result[SubjectSummary] =
        for {
          id <- c.get[String]("id")
          name <- c.get[String]("name")
          description <- c.get[String]("description")
          tags <- c.get[Set[String]]("tags")
          topics <- c.get[Set[TopicSummary]]("topics")
          image <- c.get[String]("image")
          primary <- c.getOrElse[Boolean]("primary")(false)
        } yield {
          new SubjectSummary(id, name, description, tags, topics, image, primary)
        }
    }

    // Manual decoder, to deal with 'tags' being an optional field, defaulting to empty.
    implicit val decodeTopicSummary: Decoder[TopicSummary] = new Decoder[TopicSummary] {
      final def apply(c: HCursor): Decoder.Result[TopicSummary] =
        for {
          id <- c.get[String]("id")
          name <- c.get[String]("name")
          tags <- c.getOrElse[Set[String]]("tags")(Set.empty[String])
        } yield TopicSummary(id, name, tags)
    }
  }
}

trait CoreCurriculumService {

  import CoreCurriculumService._

  def getSubjectSummaries: Future[Vector[SubjectSummary]]

  def getPersonKnowledge(person: String, subject: String): Future[Vector[String]]
  def getAllPersonKnowledge(person: String): Future[Map[String, Vector[Vector[String]]]]
  def addPersonKnowledge(person: String, subject: String, topic: String): Future[Unit]
  def removePersonKnowledge(person: String, subject: String, topic: String): Future[Unit]
}

class PostgresCoreCurriculumService(transactor: Transactor[Task], subjectDirectory: File) extends CoreCurriculumService {
  import CoreCurriculumService._

  lazy val logger: Logger = getLogger(getClass)

  logger.info(s"Reading Core Curriculum content from directory [$subjectDirectory]")

  override val getSubjectSummaries: Future[Vector[CoreCurriculumService.SubjectSummary]] = Future {
    val subjectFiles = subjectDirectory.listFiles(new FileFilter {
      override def accept(pathname: File): Boolean = pathname.getName.endsWith(".json")
    })

    subjectFiles.flatMap { file =>
      decode[SubjectSummary](Source.fromFile(file).mkString).fold(
        error => {
          logger.warn("Invalid subject file " + file + ": " + error)
          None
        },
        success => Some(success))
    }.toVector
  }

  override def getPersonKnowledge(person: String, subject: String): Future[Vector[String]] = {

    val query = sql"""
      SELECT topic
      FROM person_knowledge
      WHERE person = ${person}
      AND subject = ${subject}""".query[String]

    Future { query.vector.transact(transactor).unsafeRun }
  }

  override def getAllPersonKnowledge(person: String): Future[Map[String, Vector[Vector[String]]]] = {
    val query = sql"""
      SELECT subject, topic, created_on
      FROM person_knowledge
      WHERE person = ${person}""".query[(String, (String, String))]

    Future {
      query.vector.transact(transactor).unsafeRun
    }.map { pairs => {
        pairs.groupBy(_._1).map { case (s, v) => s -> v.map(_._2).map { case (m,n) => Vector(m, n)} }
      }
    }
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