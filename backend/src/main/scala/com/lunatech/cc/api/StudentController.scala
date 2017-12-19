package com.lunatech.cc.api

import com.lunatech.cc.api.services.StudentService
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class StudentController(studentService: StudentService, authenticated: Endpoint[ApiUser], authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /students`: Endpoint[Json] = get("students" :: authenticated) { (_: ApiUser) =>
    for {
      students <- studentService.listStudents
    } yield Ok(students.asJson)
  }

  val `GET /students/me`: Endpoint[Json] = get("students" :: "me" :: authenticatedUser) { (user: EnrichedGoogleUser) =>
    for {
      student <- studentService.getStudent(user.email)
    } yield student match {
      case Some(student) => Ok(student.asJson)
      case None => NotFound(new RuntimeException("Student not found"))
    }
  }

  val `GET /students/{studentEmail}`: Endpoint[Json] = get("students" :: string :: authenticated) { (student: String, _: ApiUser) =>
    for {
      student <- studentService.getStudent(student)
    } yield student match {
      case Some(student) => Ok(student.asJson)
      case None => NotFound(new RuntimeException("Student not found"))
    }

  }



}
