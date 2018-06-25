libraryDependencies ++= {
  object Version {
    val jsonSchema = "2.2.8"
  }

  Seq(
    "com.github.java-json-tools"    % "json-schema-validator"     % Version.jsonSchema
  )
}