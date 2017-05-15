scalaVersion := "2.11.8"

organization := "com.lunatech.cc"

name := "cco-backend-fonts"

version := "1.0"

publishMavenStyle := true

crossPaths := false

autoScalaLibrary := false

packageOptions in (Compile, packageBin) +=  {
  import java.util.jar.{Attributes, Manifest}
  val manifest = new Manifest
  val attributes = new Attributes
  attributes.put(Attributes.Name.CONTENT_TYPE, "application/x-font")
  // add a line like this for every font:
  manifest.getEntries().put("font/Avenir Next.ttc", attributes)
  //
  Package.JarManifest( manifest )
}
