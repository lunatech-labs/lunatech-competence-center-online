package com.lunatech.crawler

import java.net.URL

case class Page(url: URL, text: String, links: Set[URL])
