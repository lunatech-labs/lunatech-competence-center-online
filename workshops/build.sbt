import java.io.{FilenameFilter, FileFilter}

import com.github.fge.jackson.JsonLoader
import com.github.fge.jsonschema.main.JsonSchemaFactory

name := "workshops"
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

lazy val validateSchema = taskKey[Unit]("Validates the manifest files against a schema")

validateSchema := {
  // TODO make this as a plugin to make configuration nicer.
  // TODO reports should show which file is wrong.
  val graphsDir = new File(".")
  val schemaNode = JsonLoader.fromPath("schema.json")

  def getWorkshopFolders(parent: File): List[File] =
    parent.listFiles(new FileFilter() {
      override def accept(file: File): Boolean = file.isDirectory && file.getName() != "template"
    }).toList
  def getWorkshopManifest(folder: File): File =
    new File(folder, "manifest.json")

  val graphNodes = getWorkshopFolders(graphsDir).map(getWorkshopManifest).filter(_.exists).map { f =>
    try {
      JsonLoader.fromFile(f)
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
