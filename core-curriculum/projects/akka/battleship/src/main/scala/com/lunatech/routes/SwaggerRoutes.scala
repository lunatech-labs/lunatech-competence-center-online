package com.lunatech.routes

import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.directives.PathDirectives.path
import akka.http.scaladsl.server.directives.RouteDirectives.complete
import com.lunatech.JsonSupport

import scala.io.Source

class SwaggerRoutes(protocol: String) extends JsonSupport {

  private val swaggerSpec = Source
    .fromInputStream(this.getClass.getClassLoader.getResourceAsStream("swagger-ui/swagger.json"))
    .mkString.replace("localhost", protocol)

  lazy val swaggerRoutes: Route =
    concat(
      path("swagger-ui" / "swagger.json") {
        complete(StatusCodes.OK -> HttpEntity.apply(ContentTypes.`application/json`, swaggerSpec))
      },
      pathPrefix("swagger-ui") {
        encodeResponse {
          // Serve swagger-ui as static content from a jar resource
          getFromResourceDirectory("swagger-ui")
        }
      })

}
