package com.lunatech.cc.api

import io.finch.{Endpoint, Endpoint0, header}
import shapeless.HNil

object Routes {

  val employees: Endpoint[HNil] = "employees"
  val passport: Endpoint[HNil] = "passport"
  val cvs: Endpoint[HNil] = "cvs"
  val tokenHeader: Endpoint[String] = header("X-ID-Token")
}
