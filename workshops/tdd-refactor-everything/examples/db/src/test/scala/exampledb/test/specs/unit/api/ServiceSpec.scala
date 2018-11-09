package exampledb.test.specs.unit.api

import scala.concurrent.duration._

import akka.http.scaladsl.testkit.ScalatestRouteTest
import akka.util.Timeout
import exampledb.api.Service
import exampledb.data.Store
import org.scalatest.{fixture, Matchers, Outcome}

class ServiceSpec extends fixture.FlatSpec with Matchers with ScalatestRouteTest {

  case class FixtureParam(store: Store, service: Service)

  def withFixture(test: OneArgTest): Outcome = {
    val testStore = new Store()
    val testService = new Service(testStore)
    withFixture(test.toNoArgTest(FixtureParam(testStore, testService)))
  }

  private implicit val timeout: Timeout = 3.seconds

  private val testKey = "some-key"
  private val testValue = "some value".getBytes
  private val updatedTestValue = "some updated value".getBytes

  // TODO - requirements?

  ???
}
