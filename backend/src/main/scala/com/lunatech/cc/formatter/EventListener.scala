package com.lunatech.cc.formatter

import org.apache.fop.events.model.EventSeverity
import org.apache.fop.events.{Event, EventFormatter, EventListener}

class SysOutEventListener extends EventListener {
  override def processEvent(event: Event): Unit = {
    val msg = EventFormatter.format(event)
    event.getSeverity match {
      case EventSeverity.INFO => System.out.println("[INFO ] " + msg)
      case EventSeverity.WARN => System.out.println("[WARN ] " + msg)
      case EventSeverity.ERROR => System.err.println("[ERROR] " + msg)
      case EventSeverity.FATAL => System.err.println("[FATAL] " + msg)
    }
  }
}

class ThrowExceptionEventListener extends EventListener {
  override def processEvent(event: Event): Unit =
    event.getEventID match {
      case "org.apache.fop.svg.SVGEventProducer.svgNotBuilt" => throw new RuntimeException(EventFormatter.format(event))
      case _ => ()
  }
}