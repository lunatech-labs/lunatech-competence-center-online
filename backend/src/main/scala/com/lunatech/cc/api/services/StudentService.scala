package com.lunatech.cc.api.services

import com.twitter.util.Future
import doobie.imports._
import scalaz._
import scalaz.Scalaz._
import doobie.imports.Transactor
import fs2.Task
import org.slf4j.Logger
import org.slf4j.LoggerFactory.getLogger

trait StudentService {
  import StudentService._

  def listStudents: Future[Vector[Student]]
  def getStudent(student: String): Future[Option[Student]]
}

object StudentService {
  final case class Config(name: String, token: String)
  final case class Student(person: Person, mentor: Option[Person])
}

class PostgresStudentService(transactor: Transactor[Task], peopleService: PeopleService) extends StudentService {

  lazy val logger: Logger = getLogger(getClass)

  import StudentService._

  override def listStudents: Future[Vector[Student]] = {
    val query = sql"""
      SELECT student, mentor
      FROM student_mentors
      WHERE "from" <= current_date AND ("to" >= current_date OR "to" is NULL)""".query[(String, String)]

    Future { query.vector.transact(transactor).unsafeRun }.flatMap { students =>
      val studentsOrFailures: Future[Seq[String \/ Student]] = Future.traverseSequentially(students) { case (a, b) => buildStudent(a, b) }

      studentsOrFailures.map { _.foldLeft[Vector[Student]](Vector.empty[Student]) {
        case (acc, \/-(student)) => acc :+ student
        case (acc, -\/(error)) =>
          logger.warn(error)
          acc
      }

      }
    }
  }

  override def getStudent(student: String): Future[Option[Student]] = {
    val query = sql"""
      SELECT student, mentor
      FROM student_mentors
      WHERE "from" <= current_date AND ("to" >= current_date OR "to" is NULL)
      AND student = $student""".query[(String, String)]

    Future { query.option.transact(transactor).unsafeRun }.flatMap {
      case Some((a, b)) => buildStudent(a, b).map { _.toOption }
      case None => Future.value(None)
    }
  }

  private def buildStudent(student: String, mentor: String): Future[String \/ Student] =
    Future.join(peopleService.findByEmail(student), peopleService.findByEmail(mentor)) map {
      case (Some(student), Some(mentor)) => Student(student, Some(mentor)).right[String]
      case (Some(student), _) => Student(student, None).right[String]
      case (_, _) => s"Student $student not found in the People Service, skipping student record".left[Student]
    }
}
