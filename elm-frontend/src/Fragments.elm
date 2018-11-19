module Fragments exposing (spinner, viewBreadCrumbs)

import Bootstrap.Breadcrumb
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


viewBreadCrumbs : List ( String, Maybe String ) -> Html msg
viewBreadCrumbs crumbs =
    let
        singleItem ( title, maybeHref ) =
            Bootstrap.Breadcrumb.item []
                [ Maybe.withDefault (text title) <| Maybe.map (\s -> a [ href s ] [ text title ]) maybeHref
                ]
    in
    Bootstrap.Breadcrumb.container <| List.map singleItem crumbs


spinner : Html msg
spinner =
    div [ class "spinner" ]
        [ div [ class "inner" ] []
        ]
