package com.lunatech.cc.api.services

import com.lunatech.cc.api.GoogleUser
import io.circe.Json

/**
  * Created by erikjanssen on 21/07/2017.
  */
trait CVService {
  def findByPerson(user: GoogleUser): List[Json]

  def findById(email: String): List[Json]

  def findAll: List[Json]

  def insert(email: String, cv: Json): Int
}
