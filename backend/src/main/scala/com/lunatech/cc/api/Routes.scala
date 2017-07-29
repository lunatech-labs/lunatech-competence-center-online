package com.lunatech.cc.api

import io.finch.{Endpoint, Endpoint0, header}

object Routes {

  val employees: Endpoint0 = "employees"
  val passport: Endpoint0 = "passport"
  val me: Endpoint0 = "me"
  val cvs: Endpoint0 = "cvs"
  val tokenHeader: Endpoint[String] = header("X-ID-Token")
}
