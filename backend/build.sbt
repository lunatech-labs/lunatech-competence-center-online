scalaVersion := "2.11.8"

organization := "com.lunatech.cc"

name := "cco-backend"

libraryDependencies ++= Seq(
  "com.github.finagle" %% "finch-core" % "0.14.0",
  "com.github.finagle" %% "finch-circe" % "0.14.0",

  "io.circe" %% "circe-generic" % "0.7.0",
  "io.circe" %% "circe-parser" % "0.7.0",

  "com.google.http-client" % "google-http-client-jackson" % "1.22.0",
  "com.google.api-client" % "google-api-client" % "1.22.0",

  "org.tpolecat" %% "doobie-core-cats" % "0.4.1",
  "org.postgresql" % "postgresql" % "42.0.0",

  "org.apache.xmlgraphics" % "fop" % "2.2",
  "org.apache.xmlgraphics" % "batik-constants" % "1.9",
  "org.apache.xmlgraphics" % "batik-i18n" % "1.9",

  "org.scala-lang.modules" %% "scala-xml" % "1.0.6",
  "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.5",
  "net.databinder.dispatch" %% "dispatch-core" % "0.11.3",

  "org.scalatest" %% "scalatest" % "2.2.4" % "test",
  "com.typesafe" % "config" % "1.3.1"
)

packageOptions in (Compile, packageBin) +=  {
  import java.util.jar.{Attributes, Manifest}
  val manifest = new Manifest
  val attributes = new Attributes
  attributes.put(Attributes.Name.CONTENT_TYPE, "application/x-font")
  manifest.getEntries().put("font/Avenir Next.ttc", attributes)
  Package.JarManifest( manifest )
}

lazy val root = (project in file(".")).
  enablePlugins(ScalaxbPlugin).
  settings(
    scalaxbDispatchVersion in (Compile, scalaxb) := "0.11.3",
    scalaxbPackageName in (Compile, scalaxb)     := "xml"
  )


coverageExcludedPackages := "scalaxb;xml;"