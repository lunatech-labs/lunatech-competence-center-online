package misc

// Code should be expressive enough to not need comments
object Expressiveness {
  sealed trait StatusCode
  case object OK extends StatusCode
  case object InternalServerError extends StatusCode

  case class ServiceState(isCollectorActive: Boolean, isScalerActive: Boolean)

  val states: Map[String, Either[Throwable, ServiceState]] = ???

  def a(): StatusCode =
    if (!states.values
          .exists { serviceState =>
            // checks if service is unhealthy (an exception was thrown or one of the components is not active)
            serviceState.isLeft || serviceState.right
              .map(state => !state.isCollectorActive || !state.isScalerActive)
              .getOrElse(false)
          }) {
      OK
    } else {
      InternalServerError
    }

  // VS

  def b(): StatusCode =
    if (servicesAreUnhealthy(states)) {
      InternalServerError
    } else {
      OK
    }

  def servicesAreUnhealthy(states: Map[String, Either[Throwable, ServiceState]]): Boolean = {
    val existsUnhealthyService = states.values
      .map(isServiceUnhealthy)
      .exists(identity)

    existsUnhealthyService
  }

  def isServiceUnhealthy(state: Either[Throwable, ServiceState]): Boolean =
    state match {
      case Left(_)      => true
      case Right(state) => !state.isCollectorActive || !state.isScalerActive
    }

  // VS

  def c(serviceName: String): String =
    // matching services with names that may start with 'instance-'
    // matching services with names separated from UUIDs by '.' (single dot) or by '__' (two underscores)
    s"""^(?:instance-)?($serviceName)(?:\\.|__).+"""
}
