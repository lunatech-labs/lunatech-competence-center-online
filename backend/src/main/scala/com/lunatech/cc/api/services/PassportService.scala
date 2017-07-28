package com.lunatech.cc.api.services

import com.lunatech.cc.api.GoogleUser
import io.circe.Json


trait PassportService {

  def findByPerson(user: GoogleUser): Option[Json]

  def findById(email: String): Option[Json]

  def findAll: List[Json]

  def save(email: String, passport: Json): Int
}
