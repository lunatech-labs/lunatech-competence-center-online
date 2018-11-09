package exampledb.data

import akka.Done
import akka.actor.{ActorRef, ActorSystem}
import akka.pattern.ask
import akka.util.Timeout

class Store(implicit system: ActorSystem, timeout: Timeout) {
  private val storeActor: ActorRef = system.actorOf(StoreActor.props())

  ??? // TODO
}
