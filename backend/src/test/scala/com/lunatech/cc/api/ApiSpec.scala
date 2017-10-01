package com.lunatech.cc.api

import java.io.ByteArrayInputStream
import java.util.UUID

import com.lunatech.cc.api.CompetenceCenterApi.Config
import com.lunatech.cc.api.services.TestData._
import com.lunatech.cc.api.services._
import com.lunatech.cc.formatter.{CVFormatter, DefaultTemplate, FormatResult, Template}
import com.lunatech.cc.models._
import com.twitter.finagle.http.Status
import com.twitter.io.Reader
import com.twitter.util.Future
import doobie.imports.DriverManagerTransactor
import fs2.Task
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch.Error.NotPresent
import io.finch.{Endpoint, Input, Output}
import org.scalatest.{Matchers, _}
import pureconfig._

import scala.collection.mutable
import scalaz.{-\/, \/-}

class ApiSpec extends FlatSpec with Matchers {


  private val tokenVerifier = new StaticTokenVerifier()
  private val managerTokenVerifier = new StaticManagerTokenVerifier()
  private val noTokenVerifier = new NoneTokenVerifier


  val config = loadConfig[Config].fold(
    errors => sys.error(errors.toString),
    identity)


  val transactor = DriverManagerTransactor[Task](
    driver = config.database.driver,
    url = config.database.url,
    user = config.database.user,
    pass = config.database.password)


  private val authenticatedManager = authenticatedBuilder(config.auth, managerTokenVerifier)
  private val authenticated = authenticatedBuilder(config.auth, tokenVerifier)
  private val unauthenticated: Endpoint[ApiUser] = authenticatedBuilder(config.auth, noTokenVerifier)

  private def authenticateUser(user: Endpoint[ApiUser]): Endpoint[GoogleUser] = user.mapOutput {
    case -\/(_) => Output.failure(new RuntimeException("This endpoint only accepts an ID-Token"), Status.Unauthorized)
    case \/-(googleUser) => Output.payload(googleUser)
  }
  val authenticatedUser = authenticateUser(authenticated)
  val unAuthenticatedUser = authenticateUser(unauthenticated)

  private val cvService = new StaticCVService
  private val pg_cvService = new PostgresCVService(transactor)


  val peopleService = ApiPeopleService(config.services.people)
  val static_peopleService = new StaticPeopleService() //ApiPeopleService(config.services.people)

  private val passportService: PassportService = new StaticPassportService()
  private val pg_passportService: PassportService = new PostgresPassportService(transactor)
  private val cvFormatter = new StaticCVFormatter
  private val cvController = new CVController(cvService, peopleService, cvFormatter,authenticated, authenticatedUser)
  private val pg_cvController = new CVController(pg_cvService, peopleService, cvFormatter,authenticated, authenticatedUser)
  private val passportController = new PassportController(passportService,peopleService, authenticatedUser)
  private val pg_passportController = new PassportController(pg_passportService,peopleService, authenticatedUser)
  private def withToken(input: Input) = input.withHeaders("X-ID-Token" -> "Token")


  behavior of "Passport API"

  it should "return Some(json) when putting json" in {
    val input = withToken(Input.put("/passport").withBody(employeeJson))
    passportController.`PUT /passport`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return Some(json) when putting json in db" in {
    val input = withToken(Input.put("/passport").withBody(employeeJson))
    pg_passportController.`PUT /passport`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return Some(employee) when passport is found by id" in {
    val input = withToken(Input.get("/passport/developer@lunatech.com"))
    passportController.`GET /passport/employeeId`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return Some(employee) when passport is found by id in db" in {
    val input = withToken(Input.get("/passport/developer@lunatech.com"))
    pg_passportController.`GET /passport/employeeId`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return Some(employee) when passport for me is found" in {
    val input = withToken(Input.get("/passport/me"))
    passportController.`GET /passport/me`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return Some(employee) when passport for me is found in db" in {
    val input = withToken(Input.get("/passport/me"))
    pg_passportController.`GET /passport/me`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return None when employee is NOT found" in {
    val input = withToken(Input.get("/passport/staff@lunatech.com"))
    val error = intercept[RuntimeException] {
      passportController.`GET /passport/employeeId`(input).awaitValueUnsafe() shouldBe None
    }
    error.getMessage should startWith("No data found for staff@lunatech.com")
  }

  it should "throw exception when putting invalid json" in {
    val input = withToken(Input.put("/passport").withBody("invalid".asJson))
    val error = intercept[RuntimeException] {
      passportController.`PUT /passport`(input).awaitValueUnsafe()
    }
    error.getMessage should startWith("DecodingFailure")
  }

  behavior of "Token Authentication"

  it should "throw exception when token header is not present" in {
      val input = Input.get("/passport/me")
      val error = intercept[RuntimeException] {
        passportController.`GET /passport/me`(input).awaitValueUnsafe()
      }
      error.getMessage shouldBe "API Key or ID-Token required"
    }

    it should "throw exception when header is not valid" in {

      val cvController = new CVController(cvService, peopleService, cvFormatter,unauthenticated, unAuthenticatedUser)
      val passportController = new PassportController(passportService, peopleService, unAuthenticatedUser)

      val input = withToken(Input.get("/passport/me"))
      val error = intercept[RuntimeException] {
        passportController.`GET /passport/me`(input).awaitValueUnsafe()
      }
      error.getMessage shouldBe "Invalid ID-Token"

      val inputF = withToken(Input.post("/cvs").withBody(cvJson))
      val errorF = intercept[RuntimeException] {
        cvController.`POST /cvs`(inputF).awaitValueUnsafe()
      }
      errorF.getMessage shouldBe "Invalid ID-Token"
    }


  behavior of "CV API"


  it should "return bytes when posting json for cvs" in {
    val input = withToken(Input.post("/cvs").withBody(cvJson))
    cvController.`POST /cvs`(input).awaitValueUnsafe() should not be empty
  }

  it should "return Seq[CVS] on GET /cvs" in {
    val output = withToken(Input.get("/cvs"))
    cvController.`GET /cvs`(output).awaitValueUnsafe().getOrElse(Json.fromString("[]")).as[List[CVS]] match {
      case Left(value) => fail("expected a right")
      case Right(value) => assert(value.nonEmpty)
    }
  }

  it should "return Seq[CVS] on GET /cvs from db" in {
    val input = withToken(Input.post("/cvs").withBody(cvJson))
    pg_cvController.`POST /cvs`(input).awaitValueUnsafe()
    val data = withToken(Input.get("/cvs"))
    val cvs = pg_cvController.`GET /cvs`(data).awaitValueUnsafe().get
      cvs.as[List[CVS]] match {
      case Left(value) => fail("expected a right")
      case Right(value) =>
        assert(value.nonEmpty)
    }
  }

  it should "throw exception when putting invalid json to cvs" in {
    val input = withToken(Input.post("/cvs").withBody("invalid".asJson))
    val error = intercept[RuntimeException] {
      cvController.`POST /cvs`(input).awaitValueUnsafe()
    }
    error.getMessage should startWith("DecodingFailure")
  }

  it should "throw exception when error occurs during processing" in {
    val input = withToken(Input.post("/cvs").withBody(cv.copy(meta = cv.meta.copy(client = "error")).asJson))
    val error = intercept[RuntimeException] {
      cvController.`POST /cvs`(input).awaitValueUnsafe()
    }
    error.getMessage should startWith("error generating file")
  }

  it should "throw exception when body is not present for /cvs" in {
    val input = withToken(Input.post("/cvs"))
    val error = intercept[NotPresent] {
      cvController.`POST /cvs`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Required body not present in the request."
  }

  it should "throw exception when cv with id can't be deleted from DB" in {
    val id = "972aafac-e5e2-4564-87b6-48c62b5f19d2"
    val input = withToken(Input.delete(s"/cvs/$id"))
    val error = intercept[RuntimeException] {
      pg_cvController.`DELETE /cvs/uuid`(input).awaitValueUnsafe()
    }

    error.getMessage should startWith(s"Can't delete cv with id $id")
  }


}

class NoneTokenVerifier extends TokenVerifier {
  override def verifyToken(idTokenString: String): Option[GoogleUser] = None
}

class StaticPeopleService extends PeopleService {
  private val db: mutable.Map[String, Person] = mutable.Map.empty[String, Person]

  def load( data: mutable.Map[String, Person]): mutable.Map[String, Person] = db ++ data
  override def findAll: Future[Seq[Person]] = Future.value(db.values.toSeq)

  override def findByRole(role: String): Future[Seq[Person]] = Future.value(db.values.filter(p => p.roles.contains(role)).toSeq)

  override def findByEmail(email: String): Future[Option[Person]] = Future.value(db.values.find(_.email == email))

}


class StaticCVService extends CVService {
  private val db: mutable.Map[String, List[Json]] = mutable.Map.empty[String, List[Json]]

  override def findByPerson(user: GoogleUser): List[Json] = findById(user.email)

  override def findById(email: String): List[Json] = db.getOrElse(email,List())

  override def findAll: Map[String, List[Json]] = db.toMap //.flatMap((data) => data._2.map(j => CVData(data._1,j))).toList

  override def insert(email: String, cv: Json): Int = {
    db(email) = cv :: findById(email)
    1
  }

  override def delete(cvid: UUID): Int = ???

  override def get(cvid: UUID): Option[Json] = ???
}

class StaticPassportService extends PassportService {
  private val db: mutable.Map[String, Json] = mutable.Map.empty[String, Json]

  override def findByPerson(user: GoogleUser): Option[Json] = findById(user.email)

  override def findById(email: String): Option[Json] = db.get(email)

  override def findAll: List[Json] = db.values.toList

  override def save(email: String, cv: Json): Int = {
    db += (email -> cv)
    1
  }

}

class StaticCVFormatter extends CVFormatter {
  override def format(cv: CV): Either[Exception, FormatResult] = format(cv, DefaultTemplate)

  override def format(cv: CV, template: Template): Either[Exception, FormatResult] =
    cv match {
      case CV(_, Meta("error", _, _, _)) => Left(new RuntimeException("error generating file"))
      case _ => Right(FormatResult(Reader.fromStream(new ByteArrayInputStream(cv.toString.getBytes())), "test"))
    }
}
