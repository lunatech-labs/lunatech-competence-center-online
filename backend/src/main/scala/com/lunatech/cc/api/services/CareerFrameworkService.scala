package com.lunatech.cc.api.services

import com.lunatech.cc.models.CareerLevel
import com.twitter.util.Future
import io.circe.parser.decode
import io.circe.generic.auto._
import org.slf4j.Logger
import org.slf4j.LoggerFactory.getLogger

import scala.io.Source

trait CareerFrameworkService {

  def findAll: Future[Seq[CareerLevel]]
  def findByShortName(shortName: String): Future[Option[CareerLevel]]

}

object CareerFrameworkService {
  case class Config(careerFile: String)
}

class CareerFrameworkServiceImpl(levels: Seq[CareerLevel]) extends CareerFrameworkService {

  override def findAll: Future[Seq[CareerLevel]] = Future.value(levels)

  override def findByShortName(shortName: String): Future[Option[CareerLevel]] = Future.value(levels.find(_.shortName.equalsIgnoreCase(shortName)))

}

object CareerFrameworkServiceImpl {

  lazy val logger: Logger = getLogger(getClass)

  def apply(careerConfig: CareerFrameworkService.Config): CareerFrameworkService = new CareerFrameworkServiceImpl(loadCareerData(careerConfig.careerFile))

  private def loadCareerData(filename: String): Seq[CareerLevel] = {
    println(s"Loading career framework data from $filename")
    val bufferedSource = Source.fromFile(filename)
    val contents: String = bufferedSource.mkString
    bufferedSource.close
    decode[Seq[CareerLevel]](Source.fromFile(filename).mkString).fold(
      error => {
        logger.warn("Invalid subject file " + filename + ": " + error)
        Seq.empty[CareerLevel]
      },
      success => success)
  }

}


