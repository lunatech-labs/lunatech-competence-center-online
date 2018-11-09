package exampledb.api

import scala.concurrent.{ExecutionContext, Future}

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import akka.util.ByteString
import exampledb.data.Store

class Service(store: Store)(implicit system: ActorSystem) {
  private implicit val materializer: ActorMaterializer = ActorMaterializer()
  private implicit val executionContext: ExecutionContext = system.dispatcher

  def start(address: String, port: Int): Future[Http.ServerBinding] =
    Http().bindAndHandle(routes, address, port)

  val routes: Route = ??? // TODO
}
