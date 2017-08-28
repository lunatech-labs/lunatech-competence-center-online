package com.lunatech.cc.api

import java.io.ByteArrayInputStream

import com.lunatech.cc.api.CompetenceCenterApi.{Config}
import com.lunatech.cc.api.Data._
import com.lunatech.cc.api.services.{ApiPeopleService, CVService, PassportService}
import com.lunatech.cc.formatter.{CVFormatter, DefaultTemplate, FormatResult, Template}
import com.lunatech.cc.models._
import com.twitter.finagle.http.Status
import com.twitter.io.Reader
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

  import PeopleServiceSpec._

  private val tokenVerifier = new StaticTokenVerifier()
  private val noTokenVerifier = new NoneTokenVerifier


  val config = loadConfig[Config].fold(
    errors => sys.error(errors.toString),
    identity)

  private val authenticated = authenticatedBuilder(config.auth, tokenVerifier)
  private val unauthenticated: Endpoint[ApiUser] = authenticatedBuilder(config.auth, noTokenVerifier)

  private def authenticateUser(user: Endpoint[ApiUser]): Endpoint[GoogleUser] = user.mapOutput {
    case -\/(_) => Output.failure(new RuntimeException("This endpoint only accepts an ID-Token"), Status.Unauthorized)
    case \/-(googleUser) => Output.payload(googleUser)
  }
  val authenticatedUser = authenticateUser(authenticated)
  val unAuthenticatedUser = authenticateUser(unauthenticated)

  private val cvService = new StaticCVService
  val peopleService = ApiPeopleService(config.services.people)

  private val passportService: PassportService = new StaticPassportService()
  private val cvFormatter = new StaticCVFormatter
  private val cvController = new CVController(cvService, peopleService, cvFormatter,authenticated, authenticatedUser)
  private val passportController = new PassportController(passportService,peopleService, authenticatedUser)
  private def withToken(input: Input) = input.withHeaders("X-ID-Token" -> "Token")

  "PassportAPI" should "return Some(json) when putting json" in {
    val input = withToken(Input.put("/passport").withBody(employeeJson))
    passportController.`PUT /passport`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return Some(employee) when employee is found" in {
    val input = withToken(Input.get("/passport/developer@lunatech.com"))
    passportController.`GET /passport/employeeId`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
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

  it  should "throw exception when token header is not present" in {
    val input = Input.get("/employees/me")
    val error = intercept[RuntimeException] {
      cvController.`GET /employees/me`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "API Key or ID-Token required"
  }

//  it should "throw exception when header is not valid" in {
//
//    val cvController = new CVController(cvService, peopleService, cvFormatter,unauthenticated, unAuthenticatedUser)
//
//    val input = withToken(Input.get("/employees/me"))
//    val error = intercept[RuntimeException] {
//      cvController.`GET /employees/me`(input).awaitValueUnsafe()
//    }
//    error.getMessage shouldBe "Invalid ID-Token"
//
//    val inputF = withToken(Input.post("/cvs").withBody(cvJson))
//    val errorF = intercept[RuntimeException] {
//      cvController.`POST /cvs`(inputF).awaitValueUnsafe()
//    }
//    errorF.getMessage shouldBe "Invalid ID-Token"
//  }






  "API" should "throw exception when token header is not present" in {
    val input = Input.get("/employees/me")
    val error = intercept[RuntimeException] {
      cvController.`GET /employees/me`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "API Key or ID-Token required"
  }

  it should "throw exception when header is not valid" in {

    val cvController = new CVController(cvService, peopleService, cvFormatter,unauthenticated, unAuthenticatedUser)

    val input = withToken(Input.get("/employees/me"))
    val error = intercept[RuntimeException] {
      cvController.`GET /employees/me`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Invalid ID-Token"

    val inputF = withToken(Input.post("/cvs").withBody(cvJson))
    val errorF = intercept[RuntimeException] {
      cvController.`POST /cvs`(inputF).awaitValueUnsafe()
    }
    errorF.getMessage shouldBe "Invalid ID-Token"
  }

  it should "throw exception when cv is not found for me" in {
    /*
    val input = withToken(Input.get("/employees/me"))
    val error = intercept[RuntimeException] {
      cvController.`GET /employees/me`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "No CV found"
    */
    pending
  }

  it should "throw exception when employee is not found" in {
    val input = withToken(Input.get("/employees/unknown@lunatech.com"))
    val error = intercept[RuntimeException] {
      cvController.`GET /employees/employeeId`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "No CV found"
  }

  it should "return Some(employee) on get /employees/me" in {
    val input = withToken(Input.get("/employees/me"))
    cvService.insert("developer@lunatech.com", employeeJson.asJson)
    cvController.`GET /employees/me`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return List(employee) on get /employees" in {
    val input = withToken(Input.get("/employees"))
    cvController.`GET /employees`(input).awaitValueUnsafe() shouldBe Some(List(employeeJson).asJson)
  }

  it should "return Some(employee) when employee is found" in {
    val input = withToken(Input.get("/employees/developer@lunatech.com"))
    cvController.`GET /employees/employeeId`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return Some(json) when putting json" in {
    val input = withToken(Input.put("/employees/me").withBody(cvJson))
    cvController.`PUT /employees/me`(input).awaitValueUnsafe() shouldBe Some(cvJson)
  }

  it should "throw exception when putting invalid json" in {
    val input = withToken(Input.put("/employees/me").withBody("invalid".asJson))
    val error = intercept[RuntimeException] {
      cvController.`PUT /employees/me`(input).awaitValueUnsafe()
    }
    error.getMessage should startWith("DecodingFailure")
  }

  it should "throw exception when putting invalid json to cvs" in {
    val input = withToken(Input.post("/cvs").withBody("invalid".asJson))
    val error = intercept[RuntimeException] {
      cvController.`POST /cvs`(input).awaitValueUnsafe()
    }
    error.getMessage should startWith("DecodingFailure")
  }

  it should "return bytes when putting json for cvs" in {
    val input = withToken(Input.post("/cvs").withBody(cvJson))
    cvController.`POST /cvs`(input).awaitValueUnsafe() should not be empty
  }

  it should "throw exception when error occurs during processing" in {
    val input = withToken(Input.post("/cvs").withBody(cv.copy(meta = cv.meta.copy(client = "error")).asJson))
    val error = intercept[RuntimeException] {
      cvController.`POST /cvs`(input).awaitValueUnsafe()
    }
    error.getMessage should startWith("error generating file")
  }

  it should "throw exception when body is not present for /employees/me" in {
    val input = withToken(Input.put("/employees/me"))
    val error = intercept[NotPresent] {
      cvController.`PUT /employees/me`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Required body not present in the request."
  }

  it should "throw exception when body is not present for /cvs" in {
    val input = withToken(Input.post("/cvs"))
    val error = intercept[NotPresent] {
      cvController.`POST /cvs`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Required body not present in the request."
  }
}

object Data {
  val employee = Employee(
    basics = BasicDetails(
      givenName = "Developer",
      familyName = "Lunatech",
      label = "Software Engineer",
      startYear = "Employee since 1992",
      email = "developer@lunatech.com",
      image = "developer.jpg",
      profile = "Awesome developer",
      contact = Contact(
        name = "Lunatech Labs",
        address = "Baan 74",
        postalCode = "3011 CD",
        city = "Rotterdam",
        phone = "010",
        email = "info@lunatech.com",
        countryCode = "NL"
      )
    ),
    skills = Nil,
    achievements = Nil,
    projects = Nil,
    educations = Nil
  )
  val employeeJson: Json = employee.asJson
  val cv: CV = CV(employee, Meta("test", "today", "Rotterdam", "EN"))
  val cvJson: Json = cv.asJson
}

class NoneTokenVerifier extends TokenVerifier {
  override def verifyToken(idTokenString: String): Option[GoogleUser] = None
}

class StaticCVService extends CVService {
  private val db: mutable.Map[String, List[Json]] = mutable.Map.empty[String, List[Json]]

  override def findByPerson(user: GoogleUser): List[Json] = findById(user.email)

  override def findById(email: String): List[Json] = db.getOrElse(email,List())

  override def findAll: List[List[Json]] = db.values.toList

  override def insert(email: String, cv: Json): Int = {
    cv :: findById(email)
    1
  }

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
