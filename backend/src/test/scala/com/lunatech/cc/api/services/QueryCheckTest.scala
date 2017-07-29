//package com.lunatech.cc.api.services
//
//import doobie.scalatest._
//import com.lunatech.cc.api._
//import doobie.imports.IOLite
//import doobie.util.transactor.DriverManagerTransactor
//import org.scalatest._
//
//class QueryCheckTest extends FunSuite with Matchers with QueryChecker {
//
//
//  val transactor = DriverManagerTransactor[IOLite](
//    "org.postgresql.Driver", "jdbc:postgresql:ul3rd8gpvpa8p9oqjk2c", "ul3rd8gpvpa8p9oqjk2c", "boFXCRITHwROTL960tZG"
//  )
//
//    test("findAll") {
//        pendingUntilFixed(
//      check(PassportQueries.findAllQuery)
//        )
//    }
//
//}


