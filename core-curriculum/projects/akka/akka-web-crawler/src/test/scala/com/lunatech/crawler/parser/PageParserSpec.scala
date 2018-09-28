package com.lunatech.crawler.parser

import java.net.{ConnectException, URL, UnknownHostException}

import org.scalatest.concurrent.ScalaFutures
import org.scalatest.{AsyncWordSpec, Matchers}

class PageParserSpec extends AsyncWordSpec with Matchers {

  "PageParser" should {
    "parse a page correctly" in {
      val darkDiscoveryUrl = "https://en.wikipedia.org/wiki/The_Dark_Discovery"
      PageParser.parse(darkDiscoveryUrl).map { page =>
        page.url should be(new URL(darkDiscoveryUrl))
        page.text should include("Evergrey")
        page.links should not be empty
      }
    }

    "fail on wrong hostname" in {
      ScalaFutures.whenReady(PageParser.parse("http://www.wangasdasdasca.com/foobar").failed) { f =>
        f shouldBe a [UnknownHostException]
      }
    }

    "fail on wrong port" in {
      ScalaFutures.whenReady(PageParser.parse("https://en.wikipedia.org:32131/wiki/The_Dark_Discovery").failed) { f =>
        f shouldBe a [ConnectException]
      }
    }
  }
}
