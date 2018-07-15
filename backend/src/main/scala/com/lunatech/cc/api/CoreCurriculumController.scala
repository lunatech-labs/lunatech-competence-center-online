package com.lunatech.cc.api

import com.lunatech.cc.api.services.CoreCurriculumService
import com.twitter.util.Future
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch.Endpoint
import io.finch._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class CoreCurriculumController(coreCurriculumService: CoreCurriculumService, authenticated: Endpoint[ApiUser], authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /core-curriculum`: Endpoint[Json] = get("core-curriculum") {
    for {
      summaries <- coreCurriculumService.getSubjectSummaries
    } yield Ok(summaries.asJson)
  }

  val `GET /people/me/knowledge/{subject}`: Endpoint[Vector[String]] = get("people" :: "me" :: "knowledge" :: string :: authenticatedUser) { (subject: String, user: EnrichedGoogleUser) =>
    for {
      knowledge <- coreCurriculumService.getPersonKnowledge(user.email, subject)
    } yield Ok(knowledge)
  }

  val `GET /people/{email}/knowledge/{subject}`: Endpoint[Vector[String]] = get("people" :: string :: "knowledge" :: string :: authenticated) { (email: String, subject: String, user: ApiUser) =>
    if(user.hasRole("admin") || user.hasRole("mentor")) {
      for {
        knowledge <- coreCurriculumService.getPersonKnowledge(email, subject)
      } yield Ok(knowledge)
    } else {
      Future.value(Forbidden(new RuntimeException("'admin' or 'mentor' role required for this endpoint")))
    }
  }

  val `PUT /people/me/knowledge/{subject}/{topic}`: Endpoint[Unit] = put("people" :: "me" :: "knowledge" :: string :: string :: authenticatedUser) { (subject: String, topic: String, user: EnrichedGoogleUser) =>
    for {
      _ <- coreCurriculumService.addPersonKnowledge(user.email, subject, topic)
    } yield Ok(())
  }

  val `DELETE /people/me/knowledge/{subject}/{topic}`: Endpoint[Unit] = delete("people" :: "me" :: "knowledge" :: string :: string :: authenticatedUser) { (subject: String, topic: String, user: EnrichedGoogleUser) =>
    for {
      _ <- coreCurriculumService.removePersonKnowledge(user.email, subject, topic)
    } yield Ok(())
  }

  val `GET /people/{email}/knowledge`: Endpoint[Map[String, Vector[Vector[String]]]] = get("people" :: string :: "knowledge" :: authenticated) { (person: String, apiUser: ApiUser) =>
    for {
      knowledge <- coreCurriculumService.getAllPersonKnowledge(person)
    } yield Ok(knowledge)
  }
}