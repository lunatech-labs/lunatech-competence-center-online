package com.lunatech.cc.utils

import com.lunatech.cc.api.DbConfig
import com.typesafe.config.{Config, ConfigFactory}
import org.flywaydb.core.Flyway

class DBMigration(config: DbConfig) extends Flyway {
  setDataSource(config.url, config.user, config.password)
}
