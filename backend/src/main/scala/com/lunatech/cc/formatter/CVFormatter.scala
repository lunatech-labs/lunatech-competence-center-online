package com.lunatech.cc.formatter

import java.io._
import java.util.UUID
import javax.xml.transform.TransformerFactory
import javax.xml.transform.sax.SAXResult
import javax.xml.transform.stream.StreamSource

import com.lunatech.cc.models.{CV, Models}
import org.apache.fop.apps.FopFactory
import org.apache.xmlgraphics.util.MimeConstants
import xml.{ Resume, defaultScope }

import scala.util.{Failure, Success, Try}
import scala.xml.NodeSeq


object CVFormatter {

  def format(cv: CV): Either[Exception, File] = format(cv, DefaultTemplate)

  def format(cv: CV, template: Template): Either[Exception, File] = {
    val pdf = new File(s"/tmp/${UUID.randomUUID()}.pdf")
    val out = new BufferedOutputStream(new FileOutputStream(pdf))
    val data = scalaxb.toXML[Resume](Models.toXML(cv), None, Some("resume"), defaultScope)

    Try(run(data, template.file, out)) match {
      case Success(_) => Right(pdf)
      case Failure(e) =>
        pdf.delete()
        println(e.getMessage)
        Left(new RuntimeException(e.getMessage))
    }
  }

  private def run(cv: NodeSeq, template: File, out: OutputStream) = {
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
      val src = new StreamSource(new StringReader(cv.toString))

      // Resulting SAX events (the generated FO) must be piped through to FOP
      val res = new SAXResult(fop.getDefaultHandler)

      // Step 6: Start XSLT transformation and FOP processing
      transformer.transform(src, res)
    } finally {
      out.close()
    }
  }
}
