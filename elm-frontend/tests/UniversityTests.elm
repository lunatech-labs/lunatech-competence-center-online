module UniversityTests exposing (tests)

import Expect
import Test exposing (..)
import University

tests : List Test
tests = [
  describe "The listContainsLens"
    [ test "returns True if the value is in the list" <|
        \_ ->
          Expect.equal ((University.listContainsLens "foo").get [ "foo" ] ) True

    , test "returns False if the value is not in the list" <|
        \_ ->
          Expect.equal ((University.listContainsLens "foo").get [ ] ) False

    , test "adds the value to the list when modifying it to True"  <|
        \_ ->
          Expect.equal ((University.listContainsLens "foo").set True []) [ "foo" ]

    , test "removes the value from the list when modifying it to False" <|
        \_ ->
          Expect.equal ((University.listContainsLens "foo").set False [ "foo" ]) []
      ]
  ]
