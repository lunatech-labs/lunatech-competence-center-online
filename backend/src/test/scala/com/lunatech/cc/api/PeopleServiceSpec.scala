package com.lunatech.cc.api

import com.typesafe.config.ConfigFactory
import org.scalatest.{Matchers, _}

object PeopleServiceSpec {
  private val config = ConfigFactory
    .load()
//    .withValue("services.people.name", ConfigValueFactory.fromAnyRef("lunatech-people-api.cleverapps.io:80"))
//    .withValue("services.people.apiKey", ConfigValueFactory.fromAnyRef("s987ewj2lk08sfd98sg7u2jlkkhnvzbuy"))
//  val apiPeopleService: ApiPeopleService = ApiPeopleService(config)
}

class PeopleServiceSpec extends FlatSpec with Matchers {

  //TODO Add tests cases
}







