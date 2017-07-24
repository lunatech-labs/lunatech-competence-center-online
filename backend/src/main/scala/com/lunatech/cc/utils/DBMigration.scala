package com.lunatech.cc.utils

import com.typesafe.config.ConfigFactory
import org.flywaydb.core.Flyway

object DBMigration extends Flyway {
  lazy val config = ConfigFactory.load()
  setDataSource(config.getString("db.url"), config.getString("db.user"), config.getString("db.password"))
}

