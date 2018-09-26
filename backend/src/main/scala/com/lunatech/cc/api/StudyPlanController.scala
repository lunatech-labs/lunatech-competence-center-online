package com.lunatech.cc.api

import com.lunatech.cc.api.services.StudyPlanService
import com.lunatech.cc.api.services.StudyPlanService._
import com.lunatech.cc.api.services.StudyPlanService.Goal
import com.twitter.util.Future
import io.finch.Endpoint
import io.finch._
import io.finch.circe._
import io.circe.Json
import io.circe.syntax._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._


class StudyPlanController(studyPlanService: StudyPlanService, authenticated: Endpoint[ApiUser],
                          authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /people/me/goals`: Endpoint[Json] = get("people" :: "me" :: "goals" :: authenticatedUser) {
    (user: EnrichedGoogleUser) =>
    for {
      goals <- studyPlanService.getAllStudentGoals(user.email)
    } yield Ok(goals.asJson)
  }

  val `GET /people/{email}/goals`: Endpoint[Json] = get("people" :: string :: "goals" :: authenticated) {
    (email: String, user: ApiUser) =>
    if(user.hasRole("admin") || user.hasRole("mentor") || user.toOption.map(_.email).contains(email)) {
      for {
        goals <- studyPlanService.getAllStudentGoals(email)
      } yield Ok(goals.asJson)
    } else {
      Future.value(Forbidden(new RuntimeException("'admin' or 'mentor' role required for this endpoint")))
    }
  }

  val `PUT /people/me/goals`: Endpoint[String] =
    put("people" :: "me" :: "goals" :: authenticated :: jsonBody[Goal]) {
      (user: ApiUser, goal: Goal) => {
          val goalCopy = goal.copy(createdBy = user.toOption.map(_.email))
          for (id <- studyPlanService.createGoal(goalCopy)) yield Ok(id)
      }
  }

  val `PUT /people/{email}/goals`: Endpoint[String] =
    put("people" :: string :: "goals" :: authenticated :: jsonBody[Goal]) {
      (email: String, user: ApiUser, goal: Goal) =>
        if (user.hasRole("admin") || user.hasRole("mentor") || user.toOption.map(_.email).contains(email)) {
          val goalCopy = goal.copy(createdBy = user.toOption.map(_.email))
          for (id <- studyPlanService.createGoal(goalCopy)) yield Ok(id)
        } else {
          Future.value(Forbidden(new RuntimeException("'admin' or 'mentor' role required for this endpoint")))
        }
  }

  val `POST /people/me/goals/{goalId}`: Endpoint[Unit] =
    post("people" :: "me" :: "goals" :: string :: authenticated :: jsonBody[Goal]) {
      (goalId: String, user: ApiUser, goal: Goal) =>
        for (_ <- studyPlanService.updateGoal(goal)) yield Ok(())
  }

  val `POST /people/{email}/goals/{goalId}`: Endpoint[Unit] =
    post("people" :: string :: "goals" :: string :: authenticated :: jsonBody[Goal]) {
    (email: String, goalId: String, user: ApiUser, goal: Goal) =>
      if (user.hasRole("admin") || user.hasRole("mentor") || user.toOption.map(_.email).contains(email)) {
        for (_ <- studyPlanService.updateGoal(goal)) yield Ok(())
      } else {
        Future.value(Forbidden(new RuntimeException("'admin' or 'mentor' role required for this endpoint")))
      }
  }

  val `DELETE /people/me/goals/{goalId}`: Endpoint[Unit] =
    delete("people" :: "me" :: "goals" :: string :: authenticatedUser) {
      (id: String, user: EnrichedGoogleUser) =>
        for {
          _ <- studyPlanService.deleteGoal(id)
        } yield Ok(())
  }

  val `DELETE /people/{email}/goals/{goalId}`: Endpoint[Unit] =
    delete("people" :: string :: "goals" :: string :: authenticatedUser) {
      (email: String, id: String, user: EnrichedGoogleUser) =>
        if (user.roles.contains("admin") || user.roles.contains("mentor") || email == user.email) {
          for {
            _ <- studyPlanService.deleteGoal(id)
          } yield Ok(())
        } else {
          Future.value(Forbidden(new RuntimeException("'admin' or 'mentor' role required for this endpoint")))
        }
  }
}
