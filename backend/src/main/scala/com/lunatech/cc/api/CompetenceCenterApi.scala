package com.lunatech.cc.api

import java.io.File

import com.lunatech.cc.api.services._
import com.lunatech.cc.formatter.PdfCVFormatter
import com.lunatech.cc.utils.DBMigration
import com.twitter.finagle.http.filter.Cors
import com.twitter.finagle.http.{Request, Response, Status}
import com.twitter.finagle.{Http, Service, SimpleFilter}
import com.twitter.finagle.http.Status.MovedPermanently
import com.twitter.util.{Await, Future}
import doobie.imports._
import fs2._
import io.finch._
import io.finch.circe._
import org.slf4j.bridge.SLF4JBridgeHandler
import org.slf4j.Logger
import org.slf4j.LoggerFactory._
import pureconfig._

import scalaz._

object CompetenceCenterApi extends App {

  SLF4JBridgeHandler.removeHandlersForRootLogger()
  SLF4JBridgeHandler.install()

  case class Config(
      application: Config.ApplicationConfig,
      tokenVerifier: Config.TokenVerifierConfig,
      http: Config.HttpConfig,
      auth: AuthConfig,
      database: DbConfig,
      services: Config.ServicesConfig,
      coreCurriculum: Config.CoreCurriculumConfig
  )
  object Config {
    case class ApplicationConfig(mode: String)
    case class HttpConfig(port: Int)
    case class ServicesConfig(people: PeopleService.Config,
                              workshops: StudentService.Config,
                              career: CareerFrameworkService.Config)

    sealed trait TokenVerifierConfig
    case class Google(google: GoogleConfig, allowedDomains: List[String]) extends TokenVerifierConfig
    case class Fake(fake: FakeConfig) extends TokenVerifierConfig

    case class FakeConfig(overrideEmail: String)
    case class GoogleConfig(oauthClientId: String)

    case class CoreCurriculumConfig(directory: String)
  }

  val config =
    loadConfig[Config].fold(errors => sys.error(errors.toString), identity)

  lazy val logger: Logger = getLogger(getClass)

  val transactor = DriverManagerTransactor[Task](
    driver = config.database.driver,
    url = config.database.url,
    user = config.database.user,
    pass = config.database.password)

  new DBMigration(config.database).migrate()

  val cvService = new PostgresCVService(transactor)
  val workshopService = EventBriteWorkshopService(config.services.workshops)
  val peopleService = ApiPeopleService(config.services.people)
  val coreCurriculumService = new PostgresCoreCurriculumService(
    transactor,
    new File(config.coreCurriculum.directory))
  val studentService = new PostgresStudentService(transactor, peopleService)
  val careerFrameworkService = CareerFrameworkServiceImpl(
    config.services.career)
  val studyPlanService = new PostgresStudyPlanService(transactor)

  val tokenVerifier = config.tokenVerifier match {
    case Config.Fake(fakeConfig) =>
      new StaticTokenVerifier(fakeConfig.overrideEmail)
    case Config.Google(googleConfig, allowed) =>
      new GoogleTokenVerifier(googleConfig.oauthClientId, allowed)
  }

  // For endpoints that require an API key OR a Google authenticated user.
  val authenticated: Endpoint[ApiUser] =
    authenticatedBuilder(config.auth, tokenVerifier, peopleService)
  val authenticatedUser: Endpoint[EnrichedGoogleUser] =
    authenticated.mapOutput {
      case -\/(_) =>
        Output.failure(
          new RuntimeException("This endpoint only accepts an ID-Token"),
          Status.Unauthorized)
      case \/-(user) => Output.payload(user)
    }

  val cvFormatter = new PdfCVFormatter()

  val policy: Cors.Policy = Cors.Policy(allowsOrigin = _ => Some("*"),
                                        allowsMethods =
                                          _ => Some(Seq("GET", "POST", "PUT")),
                                        allowsHeaders = x => Some(x))

  val cvController = new CVController(cvService,
                                      peopleService,
                                      cvFormatter,
                                      authenticated,
                                      authenticatedUser)
  val workshopController =
    new WorkshopController(workshopService, authenticated)
  val peopleController = new PeopleController(peopleService, authenticatedUser)
  val coreCurriculumController = new CoreCurriculumController(
    coreCurriculumService,
    authenticated,
    authenticatedUser)
  val studentController =
    new StudentController(studentService, authenticated, authenticatedUser)
  val careerFrameworkController = new CareerFrameworkController(
    careerFrameworkService,
    authenticated,
    authenticatedUser)
  val studyPlanController = new StudyPlanController(
    studyPlanService,
    authenticated,
    authenticatedUser)
  val service = (
    cvController.`GET /employees` :+:
      cvController.`GET /employees/me` :+:
      cvController.`GET /employees/employeeId` :+:
      cvController.`PUT /employees/me` :+:
      cvController.`POST /cvs` :+:
      cvController.`GET /cvs` :+:
      cvController.`GET /cvs/employeeId` :+:
      workshopController.`GET /workshops` :+:
      peopleController.`GET /people/me` :+:
      coreCurriculumController.`GET /core-curriculum` :+:
      coreCurriculumController.`GET /people/{email}/knowledge` :+:
      coreCurriculumController.`GET /people/me/knowledge/{subject}` :+:
      coreCurriculumController.`GET /people/me/projects/{subject}` :+:
      coreCurriculumController.`GET /people/{email}/knowledge/{subject}` :+:
      coreCurriculumController.`GET /people/{email}/projects` :+:
      coreCurriculumController.`GET /people/{email}/projects/{subject}` :+:
      coreCurriculumController.`PUT /people/me/knowledge/{subject}/{topic}` :+:
      coreCurriculumController.`DELETE /people/me/knowledge/{subject}/{topic}` :+:
      coreCurriculumController.`PUT /people/me/projects/{subject}/{project}/{status}` :+:
      coreCurriculumController.`DELETE /people/me/projects/{subject}/{project}` :+:
      coreCurriculumController.`PUT /people/me/projects/{subject}/{project}?url={url}` :+:
      studentController.`GET /students` :+:
      studentController.`GET /students/me` :+:
      studentController.`GET /students/{studentEmail}` :+:
      careerFrameworkController.`GET /career` :+:
      careerFrameworkController.`GET /career/{shortname}` :+:
      studyPlanController.`GET /people/me/goals` :+:
      studyPlanController.`GET /people/{email}/goals` :+:
      studyPlanController.`PUT /people/me/goals` :+:
      studyPlanController.`PUT /people/{email}/goals` :+:
      studyPlanController.`POST /people/me/goals/{goalId}` :+:
      studyPlanController.`POST /people/{email}/goals/{goalId}` :+:
      studyPlanController.`DELETE /people/me/goals/{goalId}` :+:
      studyPlanController.`DELETE /people/{email}/goals/{goalId}`
  ).toServiceAs[Application.Json]

  val HttpsOnlyFilter = new SimpleFilter[Request, Response] {
    override def apply(
        request: Request,
        service: Service[Request, Response]): Future[Response] = {
      if (request.headerMap.get("X-Forwarded-Proto") == Some("http")) {
        val response = Response(MovedPermanently)
        response.location = "https://" + request.host.get + request.uri
        Future.value(response)
      } else service(request)
    }
  }

  val corsService: Service[Request, Response] =
    HttpsOnlyFilter.andThen(new Cors.HttpFilter(policy).andThen(service))

  logger.info(s"Starting server on port ${config.http.port}")
  val server = Http.server.serve(s":${config.http.port}", corsService)
  logger.info(s"Server running on port ${config.http.port}")
  Await.ready(server)
}
