package com.lunatech.cc.formatter

import java.io.File

sealed trait Template {
  def file: File
}

case object DefaultTemplate extends Template {
  override def file: File = new File(getClass.getResource("/cv/resume2fo.xsl").getPath)
}
