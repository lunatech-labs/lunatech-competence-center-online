package fib

import org.scalatest.{FlatSpec, Matchers}

class FibonacciSpec extends FlatSpec with Matchers {
  def fib(i: Int): Int = ???

  it should "produce fibonacci numbers" in {
    fib(0) should be(0)
  }
}
