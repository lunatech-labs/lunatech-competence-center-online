package com.lunatech.cc

import io.finch._
import scalaz._
import shapeless._
import io.circe.parser._
import io.circe.generic.auto._
import com.twitter.util.Future
import com.twitter.finagle.http.Status
import com.lunatech.cc.api.TokenVerifier

package object api {
  case class AuthConfig(clientsJson: String) {
    val clients: Map[String, AuthConfig.Client] = decode[List[AuthConfig.Client]](clientsJson).fold(
      failure => sys.error("Failed to parse clients-json value to a list of clients: " + failure),
      list => list.map { client => client.key -> client }.toMap)
  }
  object AuthConfig {
    case class Client(name: String, roles: Set[String], key: String)
  }

  case class DbConfig(driver: String, url: String, user: String, password: String)

  // A client represents an application calling this API, on behalf of the application and not a specific user.
  type ApiUser = AuthConfig.Client \/ GoogleUser

  def authenticatedBuilder(config: AuthConfig, tokenVerifier: TokenVerifier): Endpoint[ApiUser] = (paramOption("apiKey") :: headerOption("X-ID-Token")).mapOutput {
    case None :: None :: HNil => Output.failure(new RuntimeException("API Key or ID-Token required"), Status.Unauthorized)
    case (Some(_) :: Some(_) :: HNil) => Output.failure(new RuntimeException("API Key and ID-Token received, only one allowed"), Status.Unauthorized)
    case (Some(apiKey) :: None :: HNil) =>
      config.clients.get(apiKey) match {
        case Some(client) => Output.payload(-\/(client))
        case None => Output.failure(new RuntimeException("Bad API Key"), Status.Unauthorized)
      }
    case (None :: Some(idToken) :: HNil) => tokenVerifier.verifyToken(idToken) match {
      case None => Output.failure(new RuntimeException("Invalid ID-Token"), Status.Unauthorized)
      case Some(googleUser) => Output.payload(\/-(googleUser))

    }

  }

}
