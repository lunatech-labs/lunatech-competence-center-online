addSbtPlugin("io.spray" % "sbt-revolver" % "0.8.0")
addSbtPlugin("org.scalaxb" % "sbt-scalaxb" % "1.5.0")
addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.5.0")
addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.2.0")
addSbtPlugin("org.flywaydb" % "flyway-sbt" % "4.2.0")

resolvers ++= Seq(
  "Flyway" at "https://flywaydb.org/repo",
  Resolver.sonatypeRepo("public"))
