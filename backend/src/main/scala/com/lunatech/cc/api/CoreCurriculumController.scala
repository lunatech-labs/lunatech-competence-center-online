package com.lunatech.cc.api

import com.lunatech.cc.api.services.CoreCurriculumService
import com.lunatech.cc.api.services.CoreCurriculumService.{KnowledgeItem, ProjectItem}
import com.twitter.util.Future
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch.{Endpoint, _}
import org.slf4j.Logger
import org.slf4j.LoggerFactory._

class CoreCurriculumController(coreCurriculumService: CoreCurriculumService,
                               authenticated: Endpoint[ApiUser],
                               authenticatedUser: Endpoint[EnrichedGoogleUser]) {

  lazy val logger: Logger = getLogger(getClass)

  val `GET /core-curriculum`: Endpoint[Json] = get("core-curriculum") {
    for {
      summaries <- coreCurriculumService.getSubjectSummaries
    } yield Ok(summaries.asJson)
  }

  val `GET /people/me/knowledge/{subject}`: Endpoint[Vector[String]] =
    get("people" :: "me" :: "knowledge" :: string :: authenticatedUser) { (subject: String, user: EnrichedGoogleUser) =>
    for {
      knowledge <- coreCurriculumService.getPersonSubjectTopics(user.email, subject)
    } yield Ok(knowledge)
  }

  val `GET /people/{email}/knowledge/{subject}`: Endpoint[Vector[String]] =
    get("people" :: string :: "knowledge" :: string :: authenticated) { (email: String, subject: String, user: ApiUser) =>
    if(user.hasRole("admin") || user.hasRole("mentor")) {
      for {
        knowledge <- coreCurriculumService.getPersonSubjectTopics(email, subject)
      } yield Ok(knowledge)
    } else {
      Future.value(Forbidden(new RuntimeException("'admin' or 'mentor' role required for this endpoint")))
    }
  }

  val `PUT /people/me/knowledge/{subject}/{topic}`: Endpoint[Unit] =
    put("people" :: "me" :: "knowledge" :: string :: string :: authenticatedUser) { (subject: String, topic: String, user: EnrichedGoogleUser) =>
    for {
      _ <- coreCurriculumService.addPersonKnowledge(user.email, subject, topic)
    } yield Ok(())
  }

  val `DELETE /people/me/knowledge/{subject}/{topic}`: Endpoint[Unit] =
    delete("people" :: "me" :: "knowledge" :: string :: string :: authenticatedUser) { (subject: String, topic: String, user: EnrichedGoogleUser) =>
    for {
      _ <- coreCurriculumService.removePersonKnowledge(user.email, subject, topic)
    } yield Ok(())
  }

  val `GET /people/me/knowledge`: Endpoint[Map[String, Vector[String]]] = get("people" :: "me" :: "knowledge" :: authenticatedUser) { (user: EnrichedGoogleUser) =>
    for {
      knowledge <- coreCurriculumService.getAllPersonKnowledge(user.email)
    } yield Ok(knowledge.groupBy(_.subject).mapValues(_.map(_.topic)))
  }

  val notMeString = string.shouldNot("be me")(_ == "me")

  val `GET /people/{email}/knowledge`: Endpoint[Map[String, Vector[String]]] = get("people" :: notMeString :: "knowledge" :: authenticated) { (person: String, apiUser: ApiUser) =>
    for {
      knowledge <- coreCurriculumService.getAllPersonKnowledge(person)
    } yield Ok(knowledge.groupBy(_.subject).mapValues(_.map(_.topic)))
  }

  val `GET /people/{email}/projects`: Endpoint[Vector[ProjectItem]] =
    get("people" :: string :: "projects" :: authenticated) { (person: String, apiUser: ApiUser) =>
    for {
      projects <- coreCurriculumService.getAllPersonProjects(person)
    } yield Ok(projects)
  }

  val `GET /people/me/projects/{subject}`: Endpoint[Vector[ProjectItem]] =
    get("people" :: "me" :: "projects" :: string :: authenticatedUser) { (subject: String, user: EnrichedGoogleUser) =>
    for {
      projects <- coreCurriculumService.getPersonSubjectProjects(user.email, subject)
    } yield Ok(projects)
  }

  val `GET /people/{email}/projects/{subject}`: Endpoint[Vector[ProjectItem]] =
    get("people" :: string :: "projects" :: string :: authenticated) { (email: String, subject: String, user: ApiUser) =>
    if(user.hasRole("admin") || user.hasRole("mentor")) {
      for {
        projects <- coreCurriculumService.getPersonSubjectProjects(email, subject)
      } yield Ok(projects)
    } else {
      Future.value(Forbidden(new RuntimeException("'admin' or 'mentor' role required for this endpoint")))
    }
  }

  val `PUT /people/me/projects/{subject}/{project}/{status}`: Endpoint[Unit] =
    put("people" :: "me" :: "projects" :: string :: string :: string :: authenticatedUser) {
    (subject: String, project: String, status: String, user: EnrichedGoogleUser) => {
      if (status.equals("in-progress")) {
        for {
          _ <- coreCurriculumService.setProjectInProgress(user.email, subject, project)
        } yield Ok(())
      }
      else if (status.equals("done")) {
        for {
          _ <- coreCurriculumService.setProjectDone(user.email, subject, project)
        } yield Ok(())
      }
      else {
        Future.value(Forbidden(new RuntimeException("unrecognized status for project")))
      }
    }
  }

  val `DELETE /people/me/projects/{subject}/{project}`: Endpoint[Unit] =
    delete("people" :: "me" :: "projects" :: string :: string :: authenticatedUser) {
    (subject: String, project: String, user: EnrichedGoogleUser) =>
    for {
      _ <- coreCurriculumService.setProjectNotStarted(user.email, subject, project)
    } yield Ok(())
  }

  val `PUT /people/me/projects/{subject}/{project}?url={url}`: Endpoint[Unit] =
    put("people" :: "me" :: "projects" :: string :: string :: authenticatedUser :: param("url")) {
    (subject: String, project: String, user: EnrichedGoogleUser, url: String) => {
      var projectUrl = {if (url.equals("empty")) None else Some(url)}
      for {
        _ <- coreCurriculumService.setProjectUrl(user.email, subject, project, projectUrl)
      } yield Ok(())
    }
  }

}
