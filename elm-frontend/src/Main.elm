module Main exposing (Model, Msg(..), init, main, subscriptions, update, view, viewContent, viewLink, viewSideBar)

import Authentication
import Bootstrap.Button as Button
import Bootstrap.CDN as CDN
import Bootstrap.Card as Card
import Bootstrap.Card.Block as Block
import Bootstrap.Grid as Grid
import Bootstrap.Text as Text
import Browser
import Browser.Navigation as Nav
import Dict exposing (..)
import Graphs
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Markdown
import University
import Url
import Url.Parser exposing ((</>), Parser, int, map, oneOf, parse, s, string, top)
import Workshops



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }



-- MODEL


type alias Model =
    { key : Nav.Key
    , url : Url.Url
    , route : Route
    , authenticatedUser : Maybe Authentication.AuthenticatedUser
    , staticPages : Dict String (StaticPage Msg)
    , university : University.Model
    , workshops : Workshops.Model
    }


type alias StaticPage msg =
    { name : String
    , markdown : String
    , html : Html msg
    }


mkStaticPage : String -> String -> StaticPage Msg
mkStaticPage name markdown =
    StaticPage name markdown (Markdown.toHtml [ class "md" ] markdown)


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    let
        initialRoute =
            toRoute url

        initialModel =
            { url = url
            , key = key
            , route = initialRoute
            , authenticatedUser = Nothing
            , staticPages = Dict.empty
            , university = University.emptyModel
            , workshops = Workshops.emptyModel
            }
    in
    ( initialModel, routeLoadCmd initialModel initialRoute )



-- ROUTE


type Route
    = Home
    | Page String
    | UniversityRoute University.Route
    | GuildsRoute GuildsRoute
    | WorkshopsRoute Workshops.Route
    | NotFound


type GuildsRoute
    = Listing
    | Details String


route : Parser (Route -> a) a
route =
    oneOf
        [ map Home top
        , map Page (s "page" </> string)
        , map UniversityRoute University.route
        , map GuildsRoute guildsRoute
        , map WorkshopsRoute Workshops.route
        ]


guildsRoute : Parser (GuildsRoute -> a) a
guildsRoute =
    oneOf
        [ map Listing (s "guilds")
        , map Details (s "guilds" </> string)
        ]


toRoute : Url.Url -> Route
toRoute url =
    Maybe.withDefault NotFound (parse route url)


viewRoute : Route -> String
viewRoute r =
    case r of
        Home ->
            "Home"

        Page p ->
            "Page " ++ p

        UniversityRoute ur ->
            "University"

        GuildsRoute gr ->
            "Guilds"

        NotFound ->
            "404"

        WorkshopsRoute wr ->
            "Workshops"



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | PageLoaded (Result Http.Error (StaticPage Msg))
    | UniversityMsg University.Msg
    | WorkshopsMsg Workshops.Msg
    | UserAuthenticated Authentication.AuthenticatedUser
    | NobodyAuthenticated
    | LoginRequest
    | LogoutRequest


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            let
                newRoute =
                    toRoute url

                newModel =
                    { model | url = url, route = newRoute }
            in
            ( newModel, routeLoadCmd newModel newRoute )

        PageLoaded (Err _) ->
            -- FIXME
            ( model, Cmd.none )

        PageLoaded (Ok staticPage) ->
            ( { model | staticPages = insert staticPage.name staticPage model.staticPages }, Cmd.none )

        UniversityMsg umsg ->
            case model.authenticatedUser of
              Just authenticatedUser ->
                let
                    ( updatedUniversity, cmds ) =
                        University.update authenticatedUser umsg model.university
                in
                ( { model | university = updatedUniversity }, Cmd.map UniversityMsg cmds )
              Nothing -> (model, Cmd.none) -- TODO, log an error here?

        WorkshopsMsg wmsg ->
            let
                ( updatedWorkshops, cmds ) =
                    Workshops.update wmsg model.workshops
            in
            ( { model | workshops = updatedWorkshops }, Cmd.map WorkshopsMsg cmds )

        LoginRequest ->
            ( model, Authentication.requestAuthentication () )

        LogoutRequest ->
            ( model, Authentication.requestLogout () )

        UserAuthenticated authenticatedUser ->
            let
                updatedModel =
                    { model | authenticatedUser = Just authenticatedUser }
            in
            ( updatedModel
            , -- Some route load commands for modules are not executed when the user is not authenticated
              -- so they might need to be re-triggered.
              routeLoadCmd updatedModel updatedModel.route
            )

        NobodyAuthenticated ->
            ( { model | authenticatedUser = Nothing }, Cmd.none )


routeLoadCmd : Model -> Route -> Cmd Msg
routeLoadCmd model r =
    case r of
        Home ->
            routeLoadCmd model (Page "home")

        Page page ->
            case Dict.get page model.staticPages of
                Nothing ->
                    loadPage page

                Just p ->
                    Cmd.none

        -- Only try to do do stuff when there is a user authenticated.
        UniversityRoute ur ->
            case model.authenticatedUser of
                Nothing ->
                    Cmd.none

                Just authenticatedUser ->
                    Cmd.map UniversityMsg (University.routeLoadCmd authenticatedUser model.university ur)

        WorkshopsRoute wr ->
            Cmd.map WorkshopsMsg (Workshops.routeLoadCmd model.workshops wr)

        _ ->
            Cmd.none


loadPage : String -> Cmd Msg
loadPage page =
    Http.send (\r -> PageLoaded (Result.map (mkStaticPage page) r)) (Http.getString ("/data/pages/" ++ page ++ ".md"))



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Graphs.graphLayout <| \m -> UniversityMsg (University.GraphLayoutComputed m)
        , Authentication.userAuthenticated <| UserAuthenticated
        , Authentication.nobodyAuthenticated <| always NobodyAuthenticated
        ]



-- TODO, move to University module?
-- VIEW


view : Model -> Browser.Document Msg
view model =
    case model.authenticatedUser of
        Nothing ->
            { title = "Lunatech Learn"
            , body = [ viewLoginScreen ]
            }

        Just authenticatedUser ->
            { title = "Lunatech Learn"
            , body =
                [ div [ class "wrapper" ]
                    [ viewSideBar authenticatedUser model
                    , viewContent model
                    ]
                ]
            }


viewLoginScreen : Html Msg
viewLoginScreen =
    div [ class "login-screen" ]
        [ div [ class "signin" ]
            [ Card.config [ Card.align Text.alignXsCenter ]
                |> Card.block []
                    [ Block.titleH3 [] []
                    , Block.text [] [ text "Welcome to the Lunatech Online Training Center" ]
                    , Block.custom <|
                        Button.button [ Button.primary, Button.attrs [ onClick LoginRequest ] ] [ text "Sign in with Google" ]
                    ]
                |> Card.view
            ]
        ]


type Menu
    = Menu (List MenuItem)


type alias MenuItem =
    { name : String
    , href : String
    , icon : String
    , children : Menu
    }


noChildren : Menu
noChildren =
    Menu []


menu : Menu
menu =
    Menu
        [ MenuItem "University" "/university" "university" noChildren
        , MenuItem "Workshops" "/workshops" "workshops" noChildren
        , MenuItem "Guilds" "/guilds" "guilds" noChildren
        ]


viewSideBar : Authentication.AuthenticatedUser -> Model -> Html Msg
viewSideBar authenticatedUser model =
    nav [ id "sidebar" ]
        [ a [ class "sidebar-header", href "/" ]
            [ h3 []
                [ div [ class "logo-icon" ] []
                , span [ class "d-none", class "d-md-inline" ] [ div [ class "logo" ] [] ]
                ]
            ]
        , viewMenu model
        , viewProfileSection authenticatedUser
        ]


viewProfileSection : Authentication.AuthenticatedUser -> Html Msg
viewProfileSection authenticatedUser =
    div [ class "authentication" ]
        [ div [ class "user" ]
            [ img [ class "rounded-circle", class "icon", src authenticatedUser.imageUrl ] []
            , span [ class "d-none", class "d-md-inline" ] [ text authenticatedUser.name ]
            ]
        , div [ onClick LogoutRequest, class "logout", class "fi-account-logout", title "Log Out", attribute "aria-hidden" "true" ] []
        ]


viewMenu : Model -> Html Msg
viewMenu model =
    let
        viewMenuLevel : Int -> Menu -> Html Msg
        viewMenuLevel n (Menu children) =
            case children of
                [] ->
                    div [] []

                -- TODO, empty HTML?
                chilren ->
                    ul [ class "list-unstyled components" ] (List.map viewEntry children)

        viewEntry : MenuItem -> Html Msg
        viewEntry menuItem =
            li []
                [ a [ href menuItem.href ]
                    [ div [ class "icon", class menuItem.icon ] []
                    , span [ class "d-none", class "d-md-inline" ] [ text menuItem.name ]
                    ]
                ]
    in
    viewMenuLevel 0 menu



-- TODO, we might get rid of this if we don't use nested menus


fluid : Html Msg -> Html Msg
fluid content =
    div [ class "container-fluid", id "content" ] [ content ]


viewContent : Model -> Html Msg
viewContent model =
    case model.route of
        Home ->
            div []
                [ div [ class "img-fluid", class "banner", style "background-image" "url('/images/photography/banner-desk-computer.jpg')" ] []
                , viewPage model "home"
                ]

        UniversityRoute ur ->
            fluid <| Html.map UniversityMsg (University.view ur model.university)

        WorkshopsRoute wr ->
            fluid <| Html.map WorkshopsMsg (Workshops.view wr model.workshops)

        _ ->
            fluid <| text <| "The current route is: " ++ viewRoute model.route


viewPage : Model -> String -> Html Msg
viewPage model page =
    case Dict.get page model.staticPages of
        Nothing ->
            fluid <| text <| "Loading..."

        Just staticPage ->
            fluid <| staticPage.html


viewLink : String -> Html msg
viewLink path =
    li [] [ a [ href path ] [ text path ] ]
