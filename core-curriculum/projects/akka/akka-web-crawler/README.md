# Akka Web Crawler #
The goal of this project is to implement a web crawler using Akka Actors. We've provided you with the basics for an Akka
project, all dependendies included.

## Requirements
Design and implement an Akka application that crawls through the web parsing html pages. The application has a starting
point where a single URL is provided, then your task is to crawl the web starting from this webpage.

## Implementation
The object `AkkaWebCrawler` is the main class of this project, it will parse the provided URL and send that url as a
message to an actor you must implement. There is a `DummyCrawler` that will just log the request URL, you must replace
this actor with your implementation.

For parsing HTML pages we've the class `PageParser`, that given a URL will return a `Future[Page]` where `Page` contains
the url, that page's text (without the HTML tags) and the links you must continue crawling. This is done in a `Future`
to avoid blocking.

**Things to consider:**
- How would you structure the actor hierarchy?
- What should happen when something goes wrong? (Unauthorized Resource, lost connection, etc.
- The process should end eventually, mind search depth.


The end result of this application should be an histogram containing word count frequency. For that we've the
`WordSizeCounter` class that will count word size and print an historgram:

```
scala> val text = "Hello! this is a line. It can't be hard to split into "words", can it?"
scala> histogram(WordSizeCounter.wordSize(text))
------------------------------------------------
 Count | Histogram
------------------------------------------------
      1|****************
      2|****************************************
      3|****************
      4|********************************
      5|************************
```

## Running the project
To run the project simply do:

```
sbt run "http://en.wikipedia.org"
```

## Troubleshooting
If you have any doubts, you can talk to anyone on the Core Curriculum maintainers.

If you have ideas on how to improve this project, please let us know, we're happy to improve it.

