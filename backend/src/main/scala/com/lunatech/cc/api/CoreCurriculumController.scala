package com.lunatech.cc.api

import com.lunatech.cc.api.services.CoreCurriculumService
import io.finch.Endpoint
import io.finch._
import org.slf4j.Logger
import org.slf4j.LoggerFactory._


class CoreCurriculumController(coreCurriculumService: CoreCurriculumService, authenticated: Endpoint[ApiUser], authenticatedUser: Endpoint[GoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /people/me/knowledge/{subject}`: Endpoint[Vector[String]] = get("people" :: "me" :: "knowledge" :: string :: authenticatedUser) { (subject: String, user: GoogleUser) =>
    for {
      knowledge <- coreCurriculumService.getPersonKnowledge(user.email, subject)
    } yield Ok(knowledge)
  }

  val `PUT /people/me/knowledge/{subject}/{topic}`: Endpoint[Unit] = put("people" :: "me" :: "knowledge" :: string :: string :: authenticatedUser) { (subject: String, topic: String, user: GoogleUser) =>
    for {
      _ <- coreCurriculumService.addPersonKnowledge(user.email, subject, topic)
    } yield Ok(())
  }

  val `DELETE /people/me/knowledge/{subject}/{topic}`: Endpoint[Unit] = delete("people" :: "me" :: "knowledge" :: string :: string :: authenticatedUser) { (subject: String, topic: String, user: GoogleUser) =>
    for {
      _ <- coreCurriculumService.removePersonKnowledge(user.email, subject, topic)
    } yield Ok(())
  }
}
