package com.lunatech.cc.api

import java.io.ByteArrayInputStream
import java.util.UUID

import com.lunatech.cc.api.Data._
import com.lunatech.cc.api.services.{CVService, PeopleService, Person, PersonName}
import com.lunatech.cc.formatter.{CVFormatter, DefaultTemplate, FormatResult, Template}
import com.lunatech.cc.models._
import com.twitter.io.Reader
import com.twitter.util.Future
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch.Error.NotPresent
import io.finch.{Endpoint, Input}
import org.scalatest.{Matchers, _}

import scala.collection.mutable

class ApiSpec extends FlatSpec with Matchers {

  private val cvService = new StaticCVService
  private val cvFormatter = new StaticCVFormatter
  private val staticPeopleService = new StaticPeopleService
  private val staticTokenVerifier = new StaticTokenVerifier("erik.janssen@lunatech.nl")

  private val authenticatedUser: Endpoint[EnrichedGoogleUser] = Endpoint.const(Data.enrichedgoogleUser)

  val auth_clients_json = """[{ "name": "Sample Client", "roles": ["admin"], "key": "a0s98df7a890sdf7ads" }]"""
  val authConfig = AuthConfig(auth_clients_json)

  val authenticated: Endpoint[ApiUser] =
    authenticatedBuilder(authConfig, staticTokenVerifier, staticPeopleService)

  private val cvController = new CVController(cvService, staticPeopleService, cvFormatter,
    authenticated,
    authenticatedUser)

  private def withToken(input: Input) = input.withHeaders("X-ID-Token" -> "Token")

//  "API" should "throw exception when token header is not present" in {
//    val input = Input.get("/employees/me")
//    val error = intercept[NotPresent] {
//      cvController.`GET /employees/me`(input).awaitValueUnsafe()
//    }
//    error.getMessage shouldBe "Required header 'X-ID-Token' not present in the request."
//  }
//
//  it should "throw exception when header is not valid" in {
//    val input = withToken(Input.get("/employees/me"))
//    val error = intercept[RuntimeException] {
//      cvController.`GET /employees/me`(input).awaitValueUnsafe()
//    }
//    error.getMessage shouldBe "Invalid token"
//
//    val inputF = withToken(Input.post("/cvs").withBody(cvJson))
//    val errorF = intercept[RuntimeException] {
//      cvController.`POST /cvs`(inputF).awaitValueUnsafe()
//    }
//    errorF.getMessage shouldBe "Invalid token"
//  }

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

//  it should "throw exception when employee is not found" in {
//    val input = withToken(Input.get("/employees/unknown@lunatech.com"))
//    val error = intercept[RuntimeException] {
//      cvController.`GET /employees/employeeId`(input).awaitValueUnsafe()
//    }
//    error.getMessage shouldBe "No CV found"
//  }
//
//  it should "return Some(employee) on get /employees/me" in {
//    val input = withToken(Input.get("/employees/me"))
//    cvService.insert("developer@lunatech.com", employeeJson.asJson)
//    cvController.`GET /employees/me`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
//  }
//
//  it should "return List(employee) on get /employees" in {
//    val input = withToken(Input.get("/employees"))
//    cvController.`GET /employees`(input).awaitValueUnsafe() shouldBe Some(List(employeeJson).asJson)
//  }
//
//  it should "return Some(employee) when employee is found" in {
//    val input = withToken(Input.get("/employees/developer@lunatech.com"))
//    cvController.`GET /employees/employeeId`(input).awaitValueUnsafe() shouldBe Some(employeeJson)
//  }
//
//  it should "return Some(json) when putting json" in {
//    val input = withToken(Input.put("/employees/me").withBody(cvJson))
//    cvController.`PUT /employees/me`(input).awaitValueUnsafe() shouldBe Some(cvJson)
//  }
//
//  it should "throw exception when putting invalid json" in {
//    val input = withToken(Input.put("/employees/me").withBody("invalid".asJson))
//    val error = intercept[RuntimeException] {
//      cvController.`PUT /employees/me`(input).awaitValueUnsafe()
//    }
//    error.getMessage should startWith("DecodingFailure")
//  }

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

//  it should "throw exception when body is not present for /employees/me" in {
//    val input = withToken(Input.put("/employees/me"))
//    val error = intercept[NotPresent] {
//      cvController.`PUT /employees/me`(input).awaitValueUnsafe()
//    }
//    error.getMessage shouldBe "Required body not present in the request."
//  }

  it should "throw exception when body is not present for /cvs" in {
    val input = withToken(Input.post("/cvs"))
    val error = intercept[NotPresent] {
      cvController.`POST /cvs`(input).awaitValueUnsafe()
    }
    error.getMessage shouldBe "Required body not present in the request."
  }
}

object Data {
  val admin = Person("admin@lunatech.com",PersonName("A.D. Min", "Min", "Anton"), Set("admin"))
  val dev = Person("developer@lunatech.com", PersonName("D.E. Vector", "Vector", "Danny"),Set("developer"))

  val googleUser: GoogleUser = GoogleUser(dev.email,dev.email,dev.name.fullName,dev.name.familyName,dev.name.givenName,"")

  val enrichedgoogleUser = EnrichedGoogleUser(googleUser,Set("developer"))
  val e = Employee(dev)
  val basics = e.basics.copy(contact = Contact(
    name = "Lunatech Labs",
    address = "Baan 74",
    postalCode = "3011 CD",
    city = "Rotterdam",
    phone = "010",
    email = "info@lunatech.com",
    countryCode = "NL"
  ))
  val employee = e.copy(basics = basics)

  val employeeJson: Json = employee.asJson
  val cv: CV = CV(employee, Meta("test", "today", "Rotterdam", "EN"))
  val cvJson: Json = cv.asJson
}

class NoneTokenVerifier extends TokenVerifier {
  override def verifyToken(idTokenString: String): Option[GoogleUser] = None
}

class StaticCVService extends CVService {
  private val db: mutable.Map[UUID, (Person, Json)] = mutable.Map.empty[UUID, (Person, Json)]


  override def findById(id: UUID): Option[Json] = db.get(id).map(_._2)

  override def findByPersonId(email: String): List[Json] = db.values.collect{ case d if d._1 == email => d._2 }.toList

  override def findByPerson(user: EnrichedGoogleUser): List[Json] = findByPersonId(user.email)

  private val nameGrouping = (x: (UUID, (Person, Json))) => x._2._1.name.fullName

  override def findAll: Map[String, List[(UUID, Json)]] =
    db.groupBy[String](nameGrouping)
      .mapValues( _.toList.map { case (k,v) => (k,v._2)})

  override def insert(email: String, cv: Json): Int = {
    val p = Person(email.take(8),PersonName(email,email.takeRight(4),email.take(4)),Set("developer"))
    db += (UUID.randomUUID -> (p,cv))
    db.size
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


class StaticPeopleService extends PeopleService {

  private val db: Map[String, Person] = Map[String, Person](admin.email -> admin, dev.email -> dev)

  override def findAll: Future[Seq[Person]] = Future.value(db.values.toSeq)

  override def findByRole(role: String): Future[Seq[Person]] = Future.value(db.values.filter(_.roles.contains(role)).toSeq)

  override def findByEmail(email: String): Future[Option[Person]] = Future.value(db.get(email))
}