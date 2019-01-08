### Testing


## Testing

* Guilty until proven innocent <!-- .element: class="fragment fade-in-then-semi-out" -->
* Code without tests is bad code <!-- .element: class="fragment fade-in-then-semi-out" -->
* There is always enough time for testing <!-- .element: class="fragment fade-in-then-semi-out" -->
* Automated testing is critical <!-- .element: class="fragment fade-in-then-semi-out" -->
* Avoiding the 'edit and pray' approach <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Can't say if a piece of code works until it's proven that it works
* Can't know if the code is getting better or worse without tests
* If it's not important enough to test, it's not important enough to write
* Manually testing things is fine but can be forgotten
* Commit, push, see what the CI/CD pipeline has to say about it
---

### Test-Driven Development


## What is it?

<span class="text-red">Red</span>
<span>=> <span class="text-green">Green</span></span>
<span>=> Refactor</span>

```asm
> 10 ADD TEST
> 20 RUN ALL TESTS (RED)
> 30 IMPLEMENT REQUIREMENT
> 40 RUN ALL TESTS (GREEN)
> 50 REFACTOR
> 60 GOTO 10
```
<!-- .element: class="centered-code-example" -->


## What is it, really?

* Testing against requirements instead of implementations <!-- .element: class="fragment fade-in-then-semi-out" -->
* Creating minimalistic solutions <!-- .element: class="fragment fade-in-then-semi-out" -->
* Shortening the development cycle <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Thinking about the problem before writing the solution
* Results in small and isolated components
* Reducing development cycles to seconds/minutes
* The point is to write production code not just tests for it.


## Why?

* Confidence in tests == confident refactoring <!-- .element: class="fragment fade-in-then-semi-out" -->
* Focusing on one task at a time <!-- .element: class="fragment fade-in-then-semi-out" -->
* Choice of small steps or big jumps <!-- .element: class="fragment fade-in-then-semi-out" -->
* Code is testable <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Don't have to 'plan' code refactoring; just make the changes and run the tests
* Big chunks of code and big tests are difficult to maintain and refactor
* Single responsibility principle
* Code is easily testable if tests are written first
* Example Code (bad) - https://github.com/sndnv/sowe/blob/master/src/main/scala/owe/map/ops/EntityOps.scala#L27
* Example Test (bad) - https://github.com/sndnv/sowe/blob/master/src/test/scala/owe/test/specs/unit/map/ops/EntityOpsSpec.scala#L63
* Before Refactoring (really bad) - https://github.com/sndnv/sowe/commit/df521c4738b5f048f68dbb2372ced62dfbe85df4?diff=split


## Fibonacci example

> By definition, the first two numbers in the Fibonacci sequence are either 1 and 1, or 0 and 1, depending on the chosen starting point of the sequence, and each subsequent number is the sum of the previous two.

[Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number)


## Fibonacci example 1/6

A test and no implementation:

```scala
def fib(i: Int): Int = ???

it should "produce Fibonacci numbers" in {
  fib(0) should be(0)
}
```


## Fibonacci example 2/6

Complete implementation!

```scala
def fib(i: Int): Int = 0

it should "produce Fibonacci numbers" in {
  fib(0) should be(0)
}
```


## Fibonacci example 3/6

Not quite, just one more thing:

```scala
def fib(i: Int): Int = 0

it should "produce Fibonacci numbers" in {
  fib(0) should be(0)
  fib(1) should be(1)
}
```


## Fibonacci example 4/6

All done now?

```scala
def fib(i: Int): Int =
  if (i == 0) {
    0
  } else {
    1
  }

it should "produce Fibonacci numbers" in {
  fib(0) should be(0)
  fib(1) should be(1)
}
```


## Fibonacci example 5/6

Almost... but there's more:

```scala
def fib(i: Int): Int =
  if (i == 0) {
    0
  } else {
    1
  }

it should "produce Fibonacci numbers" in {
  fib(0) should be(0)
  fib(1) should be(1)
  fib(17) should be(1597)
}
```


## Fibonacci example 6/6

Done!

```scala
def fib(i: Int): Int = i match {
  case 0 => 0
  case 1 => 1
  case _ => fib(i - 1) + fib(i-2)
}

it should "produce Fibonacci numbers" in {
  fib(0) should be(0)
  fib(1) should be(1)
  fib(17) should be(1597)
  fib(42) should be(267914296)
}
```
---

### Getting Started


## Getting Started

* Code duplication is OK (at first) <!-- .element: class="fragment fade-in-then-semi-out" -->
* Forget about performance <!-- .element: class="fragment fade-in-then-semi-out" -->
* Refactor from one working state to another <!-- .element: class="fragment fade-in-then-semi-out" -->
* Write tests as if the code exists <!-- .element: class="fragment fade-in-then-semi-out" -->
* Design and test the 'ideal' interface <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Code designed to be used because it's used before it exists
* Something that works > something that is very fast at not working


## Implementation-based interface

```scala
  override def lookup(lookup: Lookup): Future[Resolved] = {
    val uri =
      Uri(settings.appApiUrl).withQuery(Uri.Query("embed" -> "apps.tasks", "embed" -> "apps.deployments",
          "label" -> settings.appLabelQuery.format(lookup.serviceName)))

    val request = HttpRequest(uri)

    for {
      response <- http.singleRequest(request)
      entity <- response.entity.toStrict
      appList <- Unmarshal(entity).to[AppList]
    } yield Resolved(lookup.serviceName, targets(appList, settings.appPortName))
  }
```

Note:
* Actual code - https://github.com/akka/akka-management/blob/master/discovery-marathon-api/src/main/scala/akka/discovery/marathon/MarathonApiSimpleServiceDiscovery.scala#L78


## Design-based interface

```scala
override def lookup(lookup: Lookup): Future[Resolved] = {
  for {
    apps <- appDiscovery.resolveTargets(lookup.serviceName)
  } yield Resolved(lookup.serviceName, addresses = apps)
}
```

Note:
* Actual code - https://github.com/akka/akka-management/blob/c6f17cd1f7e162638d085e73d92bde6389306807/discovery-marathon-api/src/main/scala/akka/discovery/marathon/MarathonApiSimpleServiceDiscovery.scala#L35


## Simple database 1/2

***Data Store***

* Can add, update and remove data
* Can retrieve data
---

### What TDD is not


## Limits of TDD

* Cannot replace proper architecture <!-- .element: class="fragment fade-in-then-semi-out" -->
* Unit tests are not enough <!-- .element: class="fragment fade-in-then-semi-out" -->
* Mocking external services is hard <!-- .element: class="fragment fade-in-then-semi-out" -->
* It is not magic <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* You still need to know where you are going
* Can give false sense of security
* How to mock AWS? - https://github.com/localstack/localstack
* It might not be always appropriate or practical to follow
---

### Tests


## Isolated tests

* One test should not affect another <!-- .element: class="fragment fade-in-then-semi-out" -->
* Test order should not matter <!-- .element: class="fragment fade-in-then-semi-out" -->
* Tests should run in parallel <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Just like production code, isolation is key
* Tests should make sense on their own, regardless of run order
* Run tests in parallel decreases development cycle


## Starter tests

* Where does a component belong?
* What inputs does it have?
* What outputs does it produce?

Note:
* Answer only one question at a time
* Heavy use of interfaces/traits helps


## Learning tests

* Is an external service behaving as expected?
* Is its behaviour consistent after updating?

Note:
* Validate that services/libraries really work as expected
* Check if an update changes critical behaviour
* Can serve as concise documentation


## Regression tests

* Each bug is a missed test

Note:
* Find bug => Write test => Fix bug


## Mutation tests

* Changing code behaviour to identify flawed tests

Note:
* Tests for evaluating the quality of existing tests
* Can mimic common programming mistakes
* Extremely slow
* Example - https://github.com/sndnv/sowe/tree/enable-mutation-tests


### Mutation Testing libraries

* PIT Mutation Testing - http://pitest.org/ (Java)
* Mutation testing for Scala - https://github.com/sugakandrey/scalamu (Scala)
* Stryker - https://stryker-mutator.io/ (JS, C#, Scala)


## Meaningful Test Data

```scala
val state = State(100, 25)
```

vs <!-- .element: class="fragment fade-in" -->

```scala
val state = State(
  currentAmount = Commodity.Amount(100),
  replenishAmount = Commodity.Amount(25)
)
```
<!-- .element: class="fragment fade-in" -->


## Evident Test Data

```scala
def updateState(state: State): State = ???

updateState(State(100, 25)) should be(State(125, 25))
```

vs <!-- .element: class="fragment fade-in" -->

```scala
def updateState(state: State): State = ???

val initialState = State(
  currentAmount = Commodity.Amount(100),
  replenishAmount = Commodity.Amount(25)
)

val expectedState = initialState.copy(
  currentAmount = initialState.currentAmount + initialState.replenishAmount
)

val actualState = updateState(initialState)

actualState should be(expectedState)
```
<!-- .element: class="fragment fade-in" -->


## Simple database 2/2

***Transactions***

* Can aggregate multiple updates in one request
* Supports transactions for aggregated updates
---

### Refactoring


## Refactoring - Why?

* Deal with technical debt <!-- .element: class="fragment fade-in-then-semi-out" -->
* Improve current design of code <!-- .element: class="fragment fade-in-then-semi-out" -->
* Make code easier to understand <!-- .element: class="fragment fade-in-then-semi-out" -->
* Reduce development time <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Over time, great solutions to small problems turn into a lot of technical debt
* Some abstraction may not have been obvious when the code was originally written
* Making a piece of code more obvious of its intent can reveal 'obvious' bugs
* Combination of previous points; reduces time needed to add new features


## Refactoring - When?

* Tests are thorough enough <!-- .element: class="fragment fade-in-then-semi-out" -->
* Tests can be run frequently <!-- .element: class="fragment fade-in-then-semi-out" -->
* Automated tools can support you <!-- .element: class="fragment fade-in-then-semi-out" -->
* Small steps can be taken <!-- .element: class="fragment fade-in-then-semi-out" -->
* All tests are passing <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Should be confident that the code is going from one working state to another
* Quick feedback reduces the size of the refactoring steps
* Tools definitely help a lot but they do have limits
* Making small steps and running tests frequently reduces debugging time
* Do not refactor and add functionality (or fix bugs) at the same time


## Refactoring - Where?

* Code with comments <!-- .element: class="fragment fade-in-then-semi-out" -->
* Code with high complexity <!-- .element: class="fragment fade-in-then-semi-out" -->
* Code duplication <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Code should be expressive enough to not need comments
* Excessive branching / conditionals (cyclomatic complexity) may indicate that the code does more than one thing
* Duplication should be avoided but only when the things will change for the same reason


## Guided refactoring

* How large should each step be? <!-- .element: class="fragment fade-in-then-semi-out" -->
* When should refactoring stop? <!-- .element: class="fragment fade-in-then-semi-out" -->
* When should tests be fixed? <!-- .element: class="fragment fade-in-then-semi-out" -->
* When should tests be deleted? <!-- .element: class="fragment fade-in-then-semi-out" -->

Note:
* Small or big steps can be done; confidence in tests is important
* Start with a clear purpose so the end result can be achieved
* Fix tests when they have complex setup, long run times or are fragile
* Remove tests when they say the same thing in the same way and confidence is not reduced


## Simple database 3/2

***Persistence***

* All updates are persisted
* Database can be restarted without losing data
---

## Further Reading

* **Test-Driven Development By Example** *(Kent Beck)*

* **The Pragmatic Programmer: From Journeyman to Master** *(Andrew Hunt, David Thomas)*

* **Refactoring: Improving the Design of Existing Code** *(Martin Fowler)*
