package com.lunatech.crawler.parser

import java.net.URL

import com.lunatech.crawler.Page
import org.jsoup.Jsoup

import scala.collection.JavaConverters._
import scala.concurrent.Future
import scala.util.Try

object PageParser {
  import scala.concurrent.ExecutionContext.Implicits.global // We could share EC with Akka, but for now it's okay.

  def parse(url: String): Future[Page] = Future {
    val safeUrl = new URL(url)
    val doc = Jsoup.connect(url).get()
    val links = doc.select("a").iterator().asScala.flatMap { link =>
      val absHref = link.attr("abs:href")

      Try(new URL(absHref)).toOption.map { url =>
        if (absHref.contains("#")) { // strip landmarks since it's essentially the same page.
          new URL(url.getProtocol, url.getHost, url.getPort, url.getFile)
        } else {
          url
        }
      }
    }.toSet

    Page(safeUrl, doc.text(), links)
  }

}
