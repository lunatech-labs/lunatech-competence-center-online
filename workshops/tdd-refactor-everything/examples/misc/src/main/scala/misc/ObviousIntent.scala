package misc

// Making a piece of code more obvious of its intent
object ObviousIntent {
  case class Point(x: Int, y: Int)

  val maxDistance: Int = ???
  val currentPath: Seq[Point] = ???
  val returnPath: Seq[Point] = ???

  def goBack(): Unit = ???
  def keepGoing(): Unit = ???

  def a(): Unit =
    if (currentPath.lengthCompare(maxDistance) < 0 && returnPath.lengthCompare(currentPath.size / 2) < 0) {
      goBack()
    } else {
      keepGoing()
    }

  // VS

  def b(): Unit = {
    val maxDistanceNotReached: Boolean = currentPath.lengthCompare(maxDistance) < 0
    val backtrackedTooFar: Boolean = returnPath.lengthCompare(currentPath.size / 2) < 0

    if (maxDistanceNotReached && backtrackedTooFar) {
      goBack()
    } else {
      keepGoing()
    }
  }
}
