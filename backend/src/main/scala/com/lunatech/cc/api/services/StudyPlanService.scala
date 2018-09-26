package com.lunatech.cc.api.services

import com.twitter.util.Future
import doobie.imports._
import java.util.UUID
import org.slf4j.Logger
import org.slf4j.LoggerFactory.getLogger
import fs2.Task
import io.circe.Decoder, io.circe.Encoder, io.circe.generic.semiauto._

object StudyPlanService {
  case class Goal(id: Option[String], goalNumber: Option[Int], student: String, name: String, description: Option[String],
                  createdOn: Option[String], createdBy: Option[String], startedOn: Option[String],
                  doneOn: Option[String], deadline: Option[String], result: Option[String],
                  subject: Option[String], retro: Option[String], assessedOn: Option[String],
                  assessedBy: Option[String], assessmentNotes: Option[String])
  implicit val goalDecoder: Decoder[Goal] = deriveDecoder[Goal]
  implicit val goalEncoder: Encoder[Goal] = deriveEncoder[Goal]
}

trait StudyPlanService {
  import StudyPlanService._
  def getAllStudentGoals(student: String): Future[Vector[Goal]]
  def updateGoal(goal: Goal): Future[Unit]
  def deleteGoal(id: String): Future[Unit]
  def createGoal(goal: Goal): Future[String]
}

class PostgresStudyPlanService(transactor: Transactor[Task]) extends StudyPlanService {
  import StudyPlanService._

  lazy val logger: Logger = getLogger(getClass)

  override def getAllStudentGoals(student: String): Future[Vector[Goal]] = {
    val query = sql"""
      SELECT id, goal_number, student, goal_title, goal_description, created_on, created_by, started_on,
      done_on, deadline, result, subject, retro, assessed_on, assessed_by, assessment_notes
      FROM study_plan
      WHERE student = $student""".query[(Option[String], Option[Int], String, String, Option[String],
      Option[String], Option[String], Option[String], Option[String],
      Option[String], Option[String], Option[String], Option[String], Option[String], Option[String], Option[String])]

    Future { query.vector.transact(transactor).unsafeRun }.map { goals => {
      goals.map {
        case (id, goalNumber, studentEmail, goal, goalDesc, createdOn, createdBy, startedOn,
        doneOn, deadline, result, subject, retro, assessedOn, assessedBy, assessmentNotes) =>
          Goal(id = id, goalNumber = goalNumber, student = studentEmail, name = goal, description = goalDesc,
            createdOn = createdOn, createdBy = createdBy, startedOn = startedOn, doneOn = doneOn, deadline = deadline,
            result = result, subject = subject, retro = retro, assessedOn = assessedOn, assessedBy = assessedBy,
            assessmentNotes = assessmentNotes) }
    }}
  }

  override def updateGoal(goal: Goal): Future[Unit] = {
    val query = sql"""
      update study_plan
      set goal_number = ${goal.goalNumber.getOrElse(0)},
      goal_title = ${goal.name},
      goal_description = ${goal.description},
      started_on = to_date(${goal.startedOn}, 'yyyy-mm-dd'),
      done_on = to_date(${goal.doneOn}, 'yyyy-mm-dd'),
      deadline = to_date(${goal.deadline}, 'yyyy-mm-dd'),
      result = ${goal.result},
      subject = ${goal.subject},
      retro = ${goal.retro},
      assessed_on = to_date(${goal.assessedOn}, 'yyyy-mm-dd'),
      assessed_by = ${goal.assessedBy},
      assessment_notes = ${goal.assessmentNotes}
      where id = ${goal.id} :: uuid""".update
    Future { query.run.transact(transactor).unsafeRun }
  }

  override def deleteGoal(id: String): Future[Unit] = {
    val query = sql"""
      delete from study_plan
      where id = $id :: uuid""".update
    Future { query.run.transact(transactor).unsafeRun }
  }

  override def createGoal(goal: Goal): Future[String] = {
    val id = UUID.randomUUID().toString
    val query = sql"""
      insert into study_plan (id, goal_number, student, goal_title,
        goal_description, created_by, started_on, done_on,
        deadline, result, subject, retro, assessed_on, assessed_by, assessment_notes)
      values ($id :: uuid, ${goal.goalNumber.getOrElse(0)}, ${goal.student}, ${goal.name},
      ${goal.description}, ${goal.createdBy}, to_date(${goal.startedOn}, 'yyyy-mm-dd'),
      to_date(${goal.doneOn}, 'yyyy-mm-dd'), to_date(${goal.deadline}, 'yyyy-mm-dd'), ${goal.result},
      ${goal.subject}, ${goal.retro}, to_date(${goal.assessedOn}, 'yyyy-mm-dd'),
      ${goal.assessedBy}, ${goal.assessmentNotes})""".update
    Future {
      query.run.transact(transactor).unsafeRun
      id
    }
  }
}