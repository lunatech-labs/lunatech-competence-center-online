port module Graphs exposing (GraphLayout, computeGraphLayout, graphLayout)


port computeGraphLayout : { subjectId : String, topics : List String, edges : List { from : String, to : String } } -> Cmd msg


type alias GraphLayout =
    { subjectId : String
    , nodes : List { id : String, left : Float, top : Float }
    , edges : List { points : List { x : Float, y : Float } }
    , graphDimensions : { width : Float, height : Float }
    }


port graphLayout : (GraphLayout -> msg) -> Sub msg
