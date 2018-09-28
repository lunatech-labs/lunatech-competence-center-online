package com.lunatech.cc.api

import com.google.api.client.googleapis.auth.oauth2.{GoogleIdTokenVerifier, GooglePublicKeysManager}
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson.JacksonFactory
import com.lunatech.cc.api.services.{Person, PersonName}

import scala.collection.JavaConverters._

case class GoogleUser(userId: String, email: String, name: String, familyName: String, givenName: String, imageUrl: String)
case class EnrichedGoogleUser(userId: String, email: String, name: String, familyName: String, givenName: String, imageUrl: String, roles: Set[String]) {
  def toPerson = Person(email,PersonName(name,familyName,givenName),roles)
}

object EnrichedGoogleUser {
  def apply(googleUser: GoogleUser, roles: Set[String]): EnrichedGoogleUser = EnrichedGoogleUser(
    userId = googleUser.userId,
    email = googleUser.email,
    name = googleUser.name,
    familyName = googleUser.familyName,
    givenName = googleUser.givenName,
    imageUrl = googleUser.imageUrl,
    roles = roles)
}

trait TokenVerifier {
  def verifyToken(idTokenString: String): Option[GoogleUser]
}

class GoogleTokenVerifier(clientId: String, allowedDomains: List[String]) extends TokenVerifier {

  override def verifyToken(idTokenString: String): Option[GoogleUser] = {
    val transport = new NetHttpTransport()
    val jsonFactory = new JacksonFactory()
    val googlePublicKeysManager = new GooglePublicKeysManager.Builder(transport, jsonFactory).build()

    val verifier = new GoogleIdTokenVerifier.Builder(googlePublicKeysManager)
      .setAudience(List(clientId).asJava)
      .build()

    Option(verifier.verify(idTokenString))
      .map(_.getPayload)
      .filter(payload => allowedDomains.contains(payload.getHostedDomain))
      .map { payload =>
        // Get profile information from payload
        GoogleUser(
          payload.getSubject,
          payload.getEmail,
          payload.get("name").asInstanceOf[String],
          payload.get("family_name").asInstanceOf[String],
          payload.get("given_name").asInstanceOf[String],
          payload.get("imageUrl").asInstanceOf[String])
    }
  }
}

class StaticTokenVerifier(email: String) extends TokenVerifier {
  override def verifyToken(idTokenString: String): Option[GoogleUser] =
    Some(GoogleUser(
      userId = email,
      email = email,
      name = "Erik Janssen",
      givenName = "Erik",
      familyName = "Janssen",
      imageUrl = ""))
}
