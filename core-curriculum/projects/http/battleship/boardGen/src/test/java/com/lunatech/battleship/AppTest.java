package com.lunatech.battleship;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for simple App.
 */
public class AppTest 
    extends TestCase {

  final int EXHAUSTIVE = 10000000;

  /**
   * Create the test case
   *
   * @param testName name of the test case
   */
  public AppTest( String testName )
  {
      super( testName );
  }

  /**
   * @return the suite of tests being tested
   */
  public static Test suite()
  {
      return new TestSuite( AppTest.class );
  }

  /**
   * Rigourous Test :-)
   */
  public void testApp() {
    for (int i = 0; i < EXHAUSTIVE; i++) {
      BoardGen.generate(i);
    }
    assertTrue( true );
  }
}
