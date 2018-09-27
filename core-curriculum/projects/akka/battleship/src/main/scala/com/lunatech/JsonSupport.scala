package com.lunatech

import java.util.UUID

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import com.lunatech.dto._
import spray.json.{ DefaultJsonProtocol, DeserializationException, JsString, JsValue, JsonFormat }

/**
 * Json Un/Marshallers.
 */
trait JsonSupport extends SprayJsonSupport {
  // import the default encoders for primitive types (Int, String, Lists etc)
  import DefaultJsonProtocol._

  implicit object UUIDFormat extends JsonFormat[UUID] {
    def write(uuid: UUID) = JsString(uuid.toString)
    def read(value: JsValue) = {
      value match {
        case JsString(uuid) => UUID.fromString(uuid)
        case _ => throw new DeserializationException("Expected hexadecimal UUID string")
      }
    }
  }

  implicit val gameInfoFormat = jsonFormat2(GameInfo)
  implicit val boardFormat = jsonFormat2(Board)
  implicit val gameStatusFormat = jsonFormat3(ResponseGameStatus)
  implicit val reqNewGameFormat = jsonFormat4(RequestNewGame)
  implicit val resNewGameFormat = jsonFormat5(ResponseNewGame)
  implicit val reqShotsFormat = jsonFormat1(RequestShot)
  implicit val resShotsFormat = jsonFormat2(ResponseShot)
}
