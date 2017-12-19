package com.lunatech.cc

import com.lunatech.cc.api.services.PeopleService
import io.finch._

import scalaz._
import shapeless._
import io.circe.parser._
import io.circe.generic.auto._
import com.twitter.finagle.http.Status
import com.twitter.util.Future

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
  type ApiUser = AuthConfig.Client \/ EnrichedGoogleUser

  implicit class RichApiUser(user: ApiUser) {
    def hasRole(role: String) = user.fold(
      _.roles contains role,
      _.roles contains role)
  }

  def authenticatedBuilder(config: AuthConfig, tokenVerifier: TokenVerifier, peopleService: PeopleService): Endpoint[ApiUser] = (paramOption("apiKey") :: headerOption("X-ID-Token")).mapOutputAsync {
    case None :: None :: HNil =>
      Future.value(Output.failure(new RuntimeException("API Key or ID-Token required"), Status.Unauthorized))
    case (Some(_) :: Some(_) :: HNil) =>
      Future.value(Output.failure(new RuntimeException("API Key and ID-Token received, only one allowed"), Status.Unauthorized))
    case (Some(apiKey) :: None :: HNil) =>
      config.clients.get(apiKey) match {
        case Some(client) =>
          Future.value(Output.payload(-\/(client)))
        case None => Future.value(Output.failure(new RuntimeException("Bad API Key"), Status.Unauthorized))
      }
    case (None :: Some(idToken) :: HNil) =>
      tokenVerifier.verifyToken(idToken) match {
        case None => Future.value(Output.failure(new RuntimeException("Invalid ID-Token"), Status.Unauthorized))
        case Some(googleUser) => peopleService.findByEmail(googleUser.email).map {
          case None => Output.failure(new RuntimeException("Found valid ID-Token, but failed to find user in people service"), Status.Unauthorized)
          case Some(person) => Output.payload(\/-(EnrichedGoogleUser(googleUser, person.roles)))
        }
    }

  }

}
