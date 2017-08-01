package com.lunatech.cc.corecurriculum.utils

import java.io.{File, FilenameFilter}

import com.fasterxml.jackson.databind.JsonNode
import com.github.fge.jackson.JsonLoader
import com.github.fge.jsonschema.core.report.ProcessingReport
import com.github.fge.jsonschema.main.JsonSchemaFactory

case class JsonSchemaValidation(schema: JsonNode, jsons: List[JsonNode]) {

  def andCheck(path: String): JsonSchemaValidation = andCheck(new File(path))

  def andCheck(file: File): JsonSchemaValidation = {
    if (file.isDirectory) {
      val inFolder = file.listFiles(new FilenameFilter {
        override def accept(dir: File, name: String): Boolean = name.endsWith("json")
      }).toList

      this.copy(jsons = inFolder.map(JsonLoader.fromFile) ::: jsons)
    } else if (file.exists()) {
      this.copy(jsons = JsonLoader.fromFile(file) :: jsons)
    } else {
      this
    }
  }

  def validate(): List[ProcessingReport] = {
    val factory = JsonSchemaFactory.byDefault()
    val jsonSchema = factory.getJsonSchema(schema)

    jsons.map(jsonSchema.validate)
  }
}

object JsonSchemaValidation {

  def apply(schemaFile: File): JsonSchemaValidation = JsonSchemaValidation(JsonLoader.fromFile(schemaFile), Nil)

  def apply(schemaFilepath: String): JsonSchemaValidation = JsonSchemaValidation(JsonLoader.fromPath(schemaFilepath), Nil)

}
