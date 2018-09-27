lazy val akkaHttpVersion = "10.1.4"
lazy val akkaVersion    = "2.5.16"

lazy val root = (project in file(".")).
  settings(
    inThisBuild(List(
      organization    := "com.lunatech",
      scalaVersion    := "2.11.8"
    )),
    name := "battleship",
    libraryDependencies ++= Seq(
      "com.typesafe.akka" %% "akka-http"            % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-http-xml"        % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-stream"          % akkaVersion,

      "com.typesafe.akka" %% "akka-http-testkit"    % akkaHttpVersion % Test,
      "com.typesafe.akka" %% "akka-testkit"         % akkaVersion     % Test,
      "com.typesafe.akka" %% "akka-stream-testkit"  % akkaVersion     % Test,
      "org.scalatest"     %% "scalatest"            % "3.0.5"         % Test,
      "com.github.tomakehurst" % "wiremock"         % "2.19.0"        % Test
    )
  )
