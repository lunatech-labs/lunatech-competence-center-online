package exampledb.test.specs.unit.data

import scala.concurrent.Future
import scala.concurrent.duration._

import akka.util.Timeout
import exampledb.Value
import exampledb.data.Store
import org.scalatest.{fixture, FutureOutcome, Matchers}

class StoreSpec extends fixture.AsyncFlatSpec with Matchers {
  case class FixtureParam(store: Store)

  def withFixture(test: OneArgAsyncTest): FutureOutcome =
    withFixture(test.toNoArgAsyncTest(FixtureParam(new Store())))

  private implicit val timeout: Timeout = 3.seconds

  private val testKey = "some key"
  private val testValue = "some value".getBytes
  private val updatedTestValue = "some updated value".getBytes

  "A data store" should "fail to retrieve missing data" in { fixture =>
    val futureResult: Future[Option[Value]] = fixture.store.get(testKey)

    futureResult.map { result =>
      result should be(None)
    }
  }

  // TODO - it should successfully add data

  // TODO - it should successfully retrieve data

  // TODO - it should successfully update data

  // TODO - it should successfully retrieve updated data

  // TODO - it should successfully remove data

  // TODO - it should fail to retrieve removed data
}
