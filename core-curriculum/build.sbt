import java.io.FilenameFilter

import com.github.fge.jackson.JsonLoader
import com.github.fge.jsonschema.main.JsonSchemaFactory

name := "core-curriculum"
organization := "com.lunatech"

libraryDependencies ++= {
  object Version {
    val jsonSchema = "2.2.8"
  }

  Seq(
    "com.github.java-json-tools"    % "json-schema-validator"     % Version.jsonSchema
  )
}

//======================================================================================================
//                           Json Schema Validation Task
//======================================================================================================

lazy val validateSchema = taskKey[Unit]("Validates the json files located in 'knowledge' against a schema")

validateSchema := {
  // TODO make this as a plugin to make configuration nicer.
  // TODO reports should show which file is wrong.
  val graphsDir = new File("knowledge/")
  val schemaNode = JsonLoader.fromPath("schema/knowledge-graph.json")
  val graphNodes = graphsDir.listFiles(new FilenameFilter {
    override def accept(dir: File, name: String): Boolean = name.endsWith("json")
  }).toList.map { f =>
    try {
      val json = JsonLoader.fromFile(f)

      // check if ID matches file name
      Option(json.get("id")).map(_.asText).filter(id => f.getName.startsWith(id)) match {
        case Some(_) => json
        case None => throw new IllegalStateException(s"File $f ID is either missing or doesn't match the filename")
      }
    } catch {
      case jpe: com.fasterxml.jackson.core.JsonParseException =>
        throw new IllegalStateException(s"File $f has errors at ${jpe.getMessage}", jpe)
    }

  }


  val factory = JsonSchemaFactory.byDefault()
  val jsonSchema = factory.getJsonSchema(schemaNode)

  val report = graphNodes.map(jsonSchema.validate)
  val singleReport = report.reduce { (one, other) => one.mergeWith(other); one }

  if (!singleReport.isSuccess) {
    throw new IllegalStateException(singleReport.toString)
  }
}
