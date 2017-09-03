package com.lunatech.cc.api.services

import com.lunatech.cc.api.CompetenceCenterApi.config
import com.lunatech.cc.api.services.TestData
import com.twitter.finagle.http.{Response, Status}
import io.circe.generic.auto._
import org.scalatest.{Matchers, _}

object PeopleServiceSpec {
  val apiPeopleService = ApiPeopleService(config.services.people)
}

class PeopleServiceSpec extends FlatSpec with Matchers {
  //TODO Add tests cases

  behavior of "API response"

  it should " be parsed into People seqence" in {

    val data = TestData.peopleApiResponseString
    val response = Response(Status.Ok)
      response.setContentString(data)
    val result: Seq[Person] = ApiPeopleService.parseResponse[Seq[Person]](response)

    result shouldBe a[Seq[_]]
    assert(result.nonEmpty)
    assert(result.head.name.fullName == "Adrien Haxaire")
  }

//  it should "be correctly mocked for local testing" in {
//    PeopleServiceSpec.apiPeopleService.findByEmail("adrien.haxaire@lunatech.com")
//    pending
//  }
}







