package exampledb.data

import akka.Done
import akka.actor.{Actor, ActorLogging, Props}
import exampledb.{Key, Value}

class StoreActor extends Actor with ActorLogging {
  import StoreActor._

  private def handler(store: Map[Key, Value]): Receive = ??? // TODO

  override def receive: Receive = handler(Map.empty)
}

object StoreActor {
  def props(): Props = Props(
    classOf[StoreActor]
  )
}
