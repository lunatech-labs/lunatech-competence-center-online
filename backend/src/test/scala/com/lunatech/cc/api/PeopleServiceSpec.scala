package com.lunatech.cc.api

import com.lunatech.cc.api.Data._
import com.lunatech.cc.api.services.ApiPeopleService
import com.lunatech.cc.api.CompetenceCenterApi.config
import com.typesafe.config.{ConfigFactory, ConfigValueFactory}
import io.circe.generic.auto._
import io.circe.syntax._
import io.finch.Error.NotPresent
import io.finch.Input
import org.scalatest.{Matchers, _}
import com.twitter.util.{Return, Throw}
import org.scalatest.concurrent.Futures

object PeopleServiceSpec {
//    .withValue("services.people.name", ConfigValueFactory.fromAnyRef("lunatech-people-api.cleverapps.io:80"))
//    .withValue("services.people.apiKey", ConfigValueFactory.fromAnyRef("s987ewj2lk08sfd98sg7u2jlkkhnvzbuy"))
//  val apiPeopleService: ApiPeopleService = ApiPeopleService(config)
  val apiPeopleService = ApiPeopleService(config.services.people)

}

class PeopleServiceSpec extends FlatSpec with Matchers {

  import PeopleServiceSpec._
  //TODO Add tests cases
}







