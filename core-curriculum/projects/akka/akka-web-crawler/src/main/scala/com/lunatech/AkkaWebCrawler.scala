//#full-example
package com.lunatech

import java.net.URL

import akka.actor.{ActorSystem, Props}
import com.lunatech.crawler.actors.DummyCrawler

object AkkaWebCrawler extends App {

  if (args.length != 1) {
    println(
      """
        |Usage:
        |
        |To run this program properly you must provide only one URL as entry point for the crawler.
        |
        |Try:
        |
        |$ sbt run "https://en.wikipedia.org/wiki/Judas_Priest"
        |
      """.stripMargin)
  } else {
    val system: ActorSystem = ActorSystem("web-crawler")
    val first = system.actorOf(Props(new DummyCrawler), "initial-crawler")

    first ! new URL(args(0))
  }
}
