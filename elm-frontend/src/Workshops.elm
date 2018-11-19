module Workshops exposing (EventDetails, Model, Msg(..), Route(..), TicketDetails, Workshop, emptyModel, eventDetailsDecoder, loadWorkshops, route, routeLoadCmd, ticketDetailsDecoder, update, view, viewWorkshop, viewWorkshopsRow, workshopDecoder)

import Fragments
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (hardcoded, optional, required)
import Json.Encode as JE
import List.Extra exposing (..)
import RemoteData exposing (..)
import Url.Parser exposing ((</>), Parser, int, map, oneOf, parse, s, string, top)


type Route
    = Home


type alias Model =
    { workshops : WebData (List Workshop)
    }


emptyModel : Model
emptyModel =
    { workshops = NotAsked }


type alias Workshop =
    { eventDetails : EventDetails
    , ticketDetails : TicketDetails
    }


type alias EventDetails =
    { id : String
    , name : String
    , description : String
    , url : String
    , logoUrl : String
    , location : String
    , date : String
    , startTime : String
    , endTime : String
    }


type alias TicketDetails =
    { totalTickets : Int
    , availableTickets : Int
    }


type Msg
    = WorkshopsResponse (WebData (List Workshop))
    | AjaxErrorMsg String -- TODO, how can we reuse this?


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AjaxErrorMsg err ->
            ( model, Cmd.none )

        -- TODO, show an error
        WorkshopsResponse workshops ->
            ( { model | workshops = workshops }, Cmd.none )


route : Parser (Route -> a) a
route =
    oneOf
        [ map Home (s "workshops")
        ]


routeLoadCmd : Model -> Route -> Cmd Msg
routeLoadCmd model r =
    case r of
        Home ->
            Cmd.batch
                [ case model.workshops of
                    NotAsked ->
                        loadWorkshops

                    _ ->
                        Cmd.none
                ]


loadWorkshops : Cmd Msg
loadWorkshops =
    Http.get "/api/workshops" (Decode.list workshopDecoder)
        |> RemoteData.sendRequest
        |> Cmd.map WorkshopsResponse


workshopDecoder : Decoder Workshop
workshopDecoder =
    Decode.map2 Workshop
        (field "eventDetails" eventDetailsDecoder)
        (field "ticketDetails" ticketDetailsDecoder)


eventDetailsDecoder : Decoder EventDetails
eventDetailsDecoder =
    Decode.succeed EventDetails
        |> required "id" Decode.string
        |> required "name" Decode.string
        |> required "description" Decode.string
        |> required "url" Decode.string
        |> required "logoUrl" Decode.string
        |> required "location" Decode.string
        |> required "date" Decode.string
        |> required "startTime" Decode.string
        |> required "endTime" Decode.string


ticketDetailsDecoder : Decoder TicketDetails
ticketDetailsDecoder =
    Decode.map2 TicketDetails
        (field "totalTickets" Decode.int)
        (field "availableTickets" Decode.int)



-- FIXME, this is a dead end. We have cardgroups with a fixed number of cards
-- but we want it responsive. So probably better to control the height of each card in
-- a different way and use normal row / column stuff.


view : Route -> Model -> Html Msg
view r model =
    case model.workshops of
        NotAsked ->
            Fragments.spinner

        Loading ->
            Fragments.spinner

        RemoteData.Failure err ->
            text "Failed to load the workshops!"

        Success workshops ->
            div []
                (Fragments.viewBreadCrumbs [ ( "Workshops", Just "/workshops" ) ]
                    :: List.map viewWorkshopsRow (List.Extra.greedyGroupsOf 3 workshops)
                )


viewWorkshopsRow : List Workshop -> Html Msg
viewWorkshopsRow workshops =
    let
        workshopCol workshop =
            div [ class "col-sm-4" ] [ viewWorkshop workshop ]
    in
    div [ class "row", class "row-eq-height", class "mb-4" ] <| List.map workshopCol workshops


viewWorkshop : Workshop -> Html Msg
viewWorkshop workshop =
    div
        [ class "card", style "height" "100%" ]
        [ img
            [ class "card-img-top", src workshop.eventDetails.logoUrl ]
            []
        , div
            [ class "card-body" ]
            [ h5
                [ class "card-title" ]
                [ text workshop.eventDetails.name ]
            , p
                [ class "card-text" ]
                [ text workshop.eventDetails.description ]
            ]
        , ul
            [ class "list-group list-group-flush" ]
            [ li
                [ class "list-group-item" ]
                [ text "Location: ", strong [] [ text workshop.eventDetails.location ] ]
            , li
                [ class "list-group-item" ]
                [ text "Date: ", strong [] [ text workshop.eventDetails.date ] ]
            , li
                [ class "list-group-item" ]
                [ text "Tickets Left: ", strong [] [ text <| String.fromInt workshop.ticketDetails.availableTickets ++ " of " ++ String.fromInt workshop.ticketDetails.totalTickets ] ]
            ]
        , div
            [ class "card-footer" ]
            [ a
                [ href workshop.eventDetails.url, class "btn btn-primary" ]
                [ text "Sign up!" ]
            ]
        ]
