package com.lunatech.cc.api

import com.google.api.client.googleapis.auth.oauth2.{GoogleIdTokenVerifier, GooglePublicKeysManager}
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson.JacksonFactory
import io.circe._
import io.circe.generic.semiauto._

import scala.collection.JavaConverters._

object GoogleTokenVerifier {

  case class GoogleUser(userId: String, email: String, name: String, familyName: String, givenName: String)

  object GoogleUser {
    implicit val GoogleUserEncoder: Encoder[GoogleUser] = deriveEncoder
  }

}

class GoogleTokenVerifier(clientId: String) {

  import GoogleTokenVerifier._

  def verifyToken(idTokenString: String): Option[GoogleUser] = {

    val transport = new NetHttpTransport()
    val jsonFactory = new JacksonFactory()
    val googlePublicKeysManager = new GooglePublicKeysManager.Builder(transport, jsonFactory).build()

    val verifier = new GoogleIdTokenVerifier.Builder(googlePublicKeysManager)
      .setAudience(List(clientId).asJava)
      .build()

    Option(verifier.verify(idTokenString)).map { idToken =>

      val payload = idToken.getPayload

      // Print user identifier
      val userId = payload.getSubject
      println("User ID: " + userId)
      println("PayLoad: " + payload)

      // Get profile information from payload
      val user = GoogleUser(
        payload.getSubject,
        payload.getEmail,
        payload.get("name").asInstanceOf[String],
        payload.get("family_name").asInstanceOf[String],
        payload.get("given_name").asInstanceOf[String])

      println(user)

      user


    }
  }


}
