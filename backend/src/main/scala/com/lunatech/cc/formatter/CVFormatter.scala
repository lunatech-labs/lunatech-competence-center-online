package com.lunatech.cc.formatter

import java.io._
import java.util.UUID
import javax.xml.transform.TransformerFactory
import javax.xml.transform.sax.SAXResult
import javax.xml.transform.stream.StreamSource

import com.lunatech.cc.models._
import com.twitter.io.Reader
import org.apache.avalon.framework.configuration.DefaultConfigurationBuilder
import org.apache.fop.apps.FopFactoryBuilder
import org.apache.xmlgraphics.util.MimeConstants
import xml.{Resume, defaultScope}

import scala.language.postfixOps
import scala.util.{Failure, Success, Try}
import scala.xml.NodeSeq

trait CVFormatter {
  def format(cv: CV): Either[Exception, FormatResult]

  def format(cv: CV, template: Template): Either[Exception, FormatResult]
}

class PdfCVFormatter extends CVFormatter {

  override def format(cv: CV): Either[Exception, FormatResult] = format(cv, DefaultTemplate)

  override def format(cv: CV, template: Template): Either[Exception, FormatResult] = {
    val pdf = new File(s"/tmp/${UUID.randomUUID()}.pdf")
    val out = new BufferedOutputStream(new FileOutputStream(pdf))
    val data = scalaxb.toXML[Resume](Models.toXML(cv), None, Some("resume"), defaultScope)

    Try(run(data, template.file, out)) match {
      case Success(_) => Right(FormatResult(Reader.fromFile(pdf), pdf.toString))
      case Failure(e) =>
        pdf.delete()
        e.printStackTrace()
        Left(new RuntimeException(e.getMessage))
    }
  }

  private def run(cv: NodeSeq, template: File, out: OutputStream) = {
    val cfgBuilder = new DefaultConfigurationBuilder
    val cfg = cfgBuilder.build(getClass.getResource("/cv/fop.xconf").toURI.toString)
    val fopFactoryBuilder = new FopFactoryBuilder(getClass.getResource("/cv/").toURI).setConfiguration(cfg)
    fopFactoryBuilder.setComplexScriptFeatures(false)
    val fopFactory = fopFactoryBuilder.build()
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
