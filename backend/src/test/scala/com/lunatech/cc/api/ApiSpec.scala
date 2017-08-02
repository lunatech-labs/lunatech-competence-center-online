package com.lunatech.cc.api

import java.io.{ByteArrayInputStream, Serializable}

import com.lunatech.cc.api.Data._
import com.lunatech.cc.api.services.{CVService, PassportService}
import com.lunatech.cc.formatter.{CVFormatter, DefaultTemplate, FormatResult, Template}
import com.lunatech.cc.models._
import com.twitter.io.Reader
import io.circe.Decoder.Result
import io.circe.{Decoder, DecodingFailure, Json}
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch.Error.NotPresent
import io.finch.Input
import org.scalatest.{Matchers, _}
import cats.implicits._
import com.twitter.util.Try

import scala.collection.mutable

class ApiSpec extends FlatSpec with Matchers {

  import PeopleServiceSpec._

  private implicit val tokenVerifier = new StaticTokenVerifier()
  private val cvService = new StaticCVService
  private val passportService = new StaticPassportService
  private val cvFormatter = new StaticCVFormatter
  private val cvController = new CVController(cvService, apiPeopleService, cvFormatter)
  private val passportController = new PassportController(passportService, apiPeopleService)

  private def withToken(input: Input) = input.withHeaders("X-ID-Token" -> "Token")

  "API" should "throw exception when token header is not present" in {
    val input = Input.get("/passport")
    val error = intercept[NotPresent] {
      passportController.`GET /passport/me`(input).awaitValueUnsafe()
    }

    error.getMessage shouldBe "Required header 'X-ID-Token' not present in the request."
  }

  it should "throw exception when header is not valid" in {
    val noTokenVerifier = new NoneTokenVerifier
    val cvCtrl = new CVController(cvService, apiPeopleService, cvFormatter)(noTokenVerifier)
    val pctrl = new PassportController(passportService, apiPeopleService)(noTokenVerifier)

    val input = withToken(Input.get("/passport"))
    val error = intercept[RuntimeException] {
      pctrl.`GET /passport/me`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Invalid token"

    val inputF = withToken(Input.post("/cvs").withBody(cvJson))
    val errorF = intercept[RuntimeException] {
      cvCtrl.`POST /cvs`(inputF).awaitValueUnsafe()
    }
    errorF.getMessage shouldBe "Invalid token"
  }


  it should "throw exception when passport is not found for logged in user" in {

    pending
  }

  it should "return UnAuthorized when header is not valid" in {
    val noTokenVerifier = new NoneTokenVerifier
    val cvctrl = new CVController(cvService, apiPeopleService, cvFormatter)(noTokenVerifier)
    val pctrl = new PassportController(passportService, apiPeopleService)(noTokenVerifier)

    val input = withToken(Input.get("/passport"))
    val output = pctrl.`GET /passport/me`(input).awaitOutputUnsafe()

    assert(output.exists(_.status.code == 401))

    val inputC = withToken(Input.post("/cvs").withBody(cvJson))
    val errorC = cvctrl.`POST /cvs`(inputC).awaitOutputUnsafe()
    assert(errorC.exists(_.status.code == 401))

  }


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

//  it should "return an empty cv when a cv is not found for me" in {
//    val input = withToken(Input.get("/employees/me"))
//    val error = passportController.`GET /passport/me`(input).awaitOutputUnsafe()
//    error.exists(_.status.code == 200) // .getMessage shouldBe "No CV found"
//  }
//
//  it should "throw exception when employee is not found" in {
//    val employeeId = "unknown@lunatech.com"
//    val input = withToken(Input.get(s"/employees/$employeeId"))
//    val error = intercept[RuntimeException] {
//      passportController.`GET /passport/employeeId`(input).awaitValueUnsafe()
//    }
//    error.getMessage shouldBe s"No data found for $employeeId"
//  }

  it should "return Some(employee) on get /passport/me" in {
    val input = withToken(Input.get("/passport/me"))
    cvService.insert("developer@lunatech.com", employeeJson.asJson)
    passportController.`GET /passport/me`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
  }

  it should "return List(employee) with all Lunatech developers on get /employees" in {
    val input = withToken(Input.get("/employees"))
    val value: Option[Json] = passportController.`GET /employees`(input).awaitValueUnsafe()

    val l: Result[List[Employee]] = value.map(_.as[List[Employee]]).getOrElse(Right(List()))
    l match {
      case Left(a) => fail()
      case Right(b) => assert(b.size > 30)
    }
  }

  it should "throw exception when putting invalid json" in {
    val input = withToken(Input.put("/passport").withBody("invalid".asJson))
    val error = intercept[RuntimeException] {
      passportController.`PUT /passport`(input).awaitValueUnsafe()
    }
    error.getMessage should startWith("DecodingFailure")
  }

  it should "throw exception when body is not present for /passport" in {
    val input = withToken(Input.put("/passport"))
    val error = intercept[NotPresent] {
      passportController.`PUT /passport`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Required body not present in the request."
  }


  "CVAPI" should "throw exception when putting invalid json to cvs" in {
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

  it should "store multiple versions of a CV" in {
    val input1 = withToken(Input.post("/cvs").withBody(cv.asJson))

    val input2 = withToken(Input.post("/cvs").withBody(cv2.asJson))
    cvController.`POST /cvs`(input1).awaitValueUnsafe()
    Thread.sleep(5000)
    cvController.`POST /cvs`(input2).awaitValueUnsafe()

    val getCvs = withToken(Input.get("/cvs/developer@lunatech.com"))
    cvController.`GET /cvs/employeeId`(getCvs).awaitValueUnsafe().get.size should be >= 2
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
  val cv: CV = CV(employee, Meta("client1", "yesterday", "Rotterdam", "EN"))
  val cv2: CV = cv.copy(meta = Meta("client2", "today", "Rotterdam", "EN"))
  val cv3: CV = cv.copy(meta = Meta("client2", "today", "Rotterdam", "NL"))
  val cvJson: Json = cv.asJson
}

class NoneTokenVerifier extends TokenVerifier {
  override def verifyToken(idTokenString: String): Option[GoogleUser] = None
}

class StaticCVService extends CVService {

  private val db: mutable.Map[String, List[Json]] = mutable.Map.empty[String, List[Json]]

  override def findByPerson(user: GoogleUser): List[Json] = findById(user.email)

  override def findById(email: String): List[Json] = db.getOrElse(email,List())

  override def findByUUID(uuid: String): Option[Json] = ??? //db.getOrElse(email,List())

  override def findAll: List[Json] = db.values.toList.flatten

  override def insert(email: String, cv: Json): Int = {
    val cvs: List[Json] = cv :: findById(email)
    db += (email -> cvs)
    1
  }

}

class StaticPassportService extends PassportService {

  private val db: mutable.Map[String, Json] = mutable.Map.empty[String, Json]

  override def findAll: List[Json] = db.values.toList

  override def findByPerson(user: GoogleUser): Option[Json] = findById(user.email)

  override def findById(email: String): Option[Json] = db.get(email)

  override def save(email: String, passport: Json): Int = {
    db += (email -> passport)
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
