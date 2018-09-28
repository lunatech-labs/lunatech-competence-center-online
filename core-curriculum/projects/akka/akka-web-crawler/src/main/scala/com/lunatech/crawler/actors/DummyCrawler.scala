package com.lunatech.crawler.actors

import java.net.URL

import akka.actor.{Actor, ActorLogging}

class DummyCrawler extends Actor with ActorLogging {

  override def receive: Receive = {
    case url: URL => // This is the starting point for this actor, what must it create? what it must reply?
      log.debug("Will parse {}", url)
  }

}
