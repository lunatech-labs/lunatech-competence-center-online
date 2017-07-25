package com.lunatech.cc.utils

import com.typesafe.config.{Config, ConfigFactory}
import org.flywaydb.core.Flyway

class DBMigration(config: Config) extends Flyway {
  setDataSource(config.getString("db.url"), config.getString("db.user"), config.getString("db.password"))
}

