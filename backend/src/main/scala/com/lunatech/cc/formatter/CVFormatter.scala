package com.lunatech.cc.formatter

import java.io._
import java.util.UUID
import javax.xml.transform.TransformerFactory
import javax.xml.transform.sax.SAXResult
import javax.xml.transform.stream.StreamSource

import org.apache.fop.apps.FopFactory
import org.apache.xmlgraphics.util.MimeConstants

import scala.util.{Failure, Success, Try}


object CVFormatter {

  def format(cv: File): Either[Throwable, File] = format(cv, DefaultTemplate)

  def format(cv: File, template: Template): Either[Throwable, File] = {
    val pdf = new File(s"/tmp/${UUID.randomUUID()}.pdf")
    val out = new BufferedOutputStream(new FileOutputStream(pdf))

    Try(run(cv, template.file, out)) match {
      case Success(_) => Right(pdf)
      case Failure(e) =>
        pdf.delete()
        println(e.getMessage)
        Left(e)
    }
  }

  private def run(cv: File, template: File, out: OutputStream) = {
    // Step 1: Construct a FopFactory by specifying a reference to the configuration file
    // (reuse if you plan to render multiple documents!)
    val fopFactory = FopFactory.newInstance(getClass.getResource("/cv/fop.xconf").toURI)
    // Step 2: Set up output stream.
    // Note: Using BufferedOutputStream for performance reasons (helpful with FileOutputStreams).
    try {
      // Setup additional event listeners
      val foUserAgent = fopFactory.newFOUserAgent
      foUserAgent.setAuthor("Lunatech")
      foUserAgent.getEventBroadcaster.addEventListener(new ThrowExceptionEventListener)
      foUserAgent.getEventBroadcaster.addEventListener(new SysOutEventListener)

      // Step 3: Construct fop with desired output format
      val fop = fopFactory.newFop(MimeConstants.MIME_PDF, foUserAgent, out)

      // Step 4: Setup JAXP using transformer
      val factory = TransformerFactory.newInstance()

      val xslt = new StreamSource(template)
      val transformer = factory.newTransformer(xslt)

      // Step 5: Setup input and output for XSLT transformation
      // Setup input stream
      val src = new StreamSource(cv)

      // Resulting SAX events (the generated FO) must be piped through to FOP
      val res = new SAXResult(fop.getDefaultHandler)

      // Step 6: Start XSLT transformation and FOP processing
      transformer.transform(src, res)
    } finally {
      out.close()
    }
  }
}

