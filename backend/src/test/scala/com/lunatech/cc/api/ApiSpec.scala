package com.lunatech.cc.api

import java.io.ByteArrayInputStream

import com.lunatech.cc.api.Data._
import com.lunatech.cc.api.services.CVService
import com.lunatech.cc.formatter.{CVFormatter, DefaultTemplate, FormatResult, Template}
import com.lunatech.cc.models._
import com.twitter.io.Reader
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch.Error.NotPresent
import io.finch.Input
import org.scalatest.{Matchers, _}

import scala.collection.mutable

class ApiSpec extends FlatSpec with Matchers {

  import PeopleServiceSpec._

  private val tokenVerifier = new StaticTokenVerifier()
  private val cvService = new StaticCVService
  private val cvFormatter = new StaticCVFormatter
  private val cvController = new CVController(tokenVerifier, cvService, apiPeopleService, cvFormatter)

  private def withToken(input: Input) = input.withHeaders("X-ID-Token" -> "Token")

  "API" should "throw exception when token header is not present" in {
    val input = Input.get("/employees/me")
    val error = intercept[NotPresent] {
      cvController.`GET /employees/me`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Required header 'X-ID-Token' not present in the request."
  }

  it should "throw exception when header is not valid" in {
    val noTokenVerifier = new NoneTokenVerifier
    val cvController = new CVController(noTokenVerifier, cvService, apiPeopleService, cvFormatter)
    val input = withToken(Input.get("/employees/me"))
    val error = intercept[RuntimeException] {
      cvController.`GET /employees/me`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Invalid token"

    val inputF = withToken(Input.post("/cvs").withBody(cvJson))
    val errorF = intercept[RuntimeException] {
      cvController.`POST /cvs`(inputF).awaitValueUnsafe()
    }
    errorF.getMessage shouldBe "Invalid token"
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
  private val db: mutable.Map[String, Json] = mutable.Map.empty[String, Json]

  override def findByPerson(user: EnrichedGoogleUser): Option[Json] = findById(user.email)

  override def findById(email: String): Option[Json] = db.get(email)

  override def findAll: List[Json] = db.values.toList

  override def insert(email: String, cv: Json): Int = {
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
