module Suite exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import UniversityTests

suite : Test
suite =
    describe "University Tests" UniversityTests.tests
