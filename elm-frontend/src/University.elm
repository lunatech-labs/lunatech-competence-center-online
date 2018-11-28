module University exposing (AssessmentQuestion, Edge, Knowledge, Model, Msg(..), MyStudentDetails, Project, Resource, Route(..), SubjectDetails, SubjectSummary, TopicDetails, TopicSummary, assessmentQuestionDecoder, assessmentQuestionsHintPopoverStateInTopicDetails, byIdInList, computeEdges, computeGraphLayoutCmd, edgePath, emptyModel, grouped, hasKnowledge, knowledgeDecoder, loadMyKnowledge, loadSubjectDetails, loadSubjectSummaries, modelSubjectDetailsDict, myStudentDetailsDecoder, nodePosition, projectDecoder, resourceDecoder, route, routeLoadCmd, subjectCardRow, subjectDetailsDecoder, subjectDetailsTopicDetailsList, subjectSummariesDecoder, subjectSummaryDecoder, tabStateInTopicDetails, topicDetailsDecoder, topicSummaryDecoder, update, view, viewAbilities, viewAssessmentQuestions, viewEdges, viewHome, viewKnowledgeGraph, viewProjects, viewResources, viewSubject, viewSubjectCard, viewSubjectCards, viewTopic, viewTopicKnowledgeCard, viewTopicNode, viewTopicTabs, listContainsLens)

import Authentication
import Bootstrap.Button
import Bootstrap.Card
import Bootstrap.Card.Block
import Bootstrap.ListGroup
import Bootstrap.Popover
import Bootstrap.Tab as Tab
import Bootstrap.Utilities.Spacing as Spacing
import Dict exposing (..)
import Fragments
import Graphs
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (hardcoded, optional, required)
import Json.Encode as JE
import List.Extra
import Markdown
import Monocle.Common as MC
import Monocle.Compose as Compose
import Monocle.Lens exposing (Lens)
import Monocle.Optional as Optional exposing (..)
import RemoteData exposing (..)
import Svg
import Svg.Attributes
import Url.Parser exposing ((</>), Parser, int, map, oneOf, parse, s, string, top)


type Route
    = Home
    | ShowSubject String
    | ShowTopic String String


type alias Model =
    { subjectSummaries : WebData (List SubjectSummary)
    , subjectDetails : Dict String SubjectDetails
    , myKnowledge : WebData Knowledge
    , myProjects : WebData ProjectStatuses
    }


emptyModel : Model
emptyModel =
    { subjectSummaries = NotAsked
    , subjectDetails = Dict.empty
    , myKnowledge = NotAsked
    , myProjects = NotAsked
    }


type alias SubjectSummary =
    { id : String
    , name : String
    , description : String
    , tags : List String
    , topics : List TopicSummary
    , image : String
    , primary : Bool
    }


type alias SubjectDetails =
    { id : String
    , name : String
    , description : String
    , headmaster : Maybe String
    , teachers : List String
    , tags : List String
    , image : String
    , primary : Bool
    , topics : List TopicDetails -- TODO, a Dict would be better for this.
    , edges : List Edge
    , projects : List Project
    , graphLayout : Maybe Graphs.GraphLayout
    }


type alias Project =
    { id : String
    , name : String
    , description : String
    , dependencies : List String
    }


type alias TopicDetails =
    { id : String
    , name : String
    , description : String
    , tags : List String
    , dependencies : List String
    , resources : List Resource
    , abilities : List String
    , assessmentQuestions : List AssessmentQuestion
    , tabState : Tab.State
    , assessmentQuestionsHintPopoverState : Dict String Bootstrap.Popover.State
    }


type alias AssessmentQuestion =
    { question : String
    , answerHint : Maybe String
    }


type alias Resource =
    { name : String
    , typ : String
    , url : String
    , tags : List String
    }


type alias Knowledge =
    Dict String (List String)

type ProjectStatus
  = NotStarted
  | Started String
  | Finished String

type alias ProjectStatuses =
    Dict (String, String) ProjectStatus

type alias MyStudentDetails =
    { foo : String
    }


type Msg
    = SubjectSummariesResponse (WebData (List SubjectSummary))
    | SubjectDetailsResponse (WebData SubjectDetails)
    | MyKnowledgeResponse (WebData Knowledge)
    | MyProjectsResponse (WebData ProjectStatuses)
    | GenericSave (WebData ())
    | GraphLayoutComputed Graphs.GraphLayout
    | TabMsg String String Tab.State
    | AssessmentQuestionHintPopoverMsg String String String Bootstrap.Popover.State
    | ToggleTopicKnown String String
    | MyKnowledgeUpdateResponse (WebData ())
    | UpdateProject UpdateProjectMsg

type UpdateProjectMsg
    = StartProject String String
    | FinishProject String String
    | StopProject String String
    | SetProjectURL String String String
    | SaveProjectURL String String

type alias TopicSummary =
    { id : String
    , name : String
    , tags : List String
    }


route : Parser (Route -> a) a
route =
    oneOf
        [ map Home (s "university")
        , map ShowSubject (s "university" </> Url.Parser.string)
        , map ShowTopic (s "university" </> Url.Parser.string </> Url.Parser.string)
        ]


routeLoadCmd : Authentication.AuthenticatedUser -> Model -> Route -> Cmd Msg
routeLoadCmd authenticatedUser model r =
    case r of
        Home ->
            Cmd.batch
                [ case model.subjectSummaries of
                    NotAsked ->
                        loadSubjectSummaries

                    _ ->
                        Cmd.none
                , case model.myKnowledge of
                    NotAsked ->
                        loadMyKnowledge authenticatedUser

                    _ ->
                        Cmd.none
                , case model.myProjects of
                    NotAsked ->
                        loadMyProjects authenticatedUser
                    _ ->
                        Cmd.none
                ]

        -- Also runs the commands needed for 'Home' route
        ShowSubject subjectId ->
            Cmd.batch
                [ routeLoadCmd authenticatedUser model Home
                , case Dict.get subjectId model.subjectDetails of
                    Nothing ->
                        loadSubjectDetails subjectId

                    Just subjectDetails ->
                        case subjectDetails.graphLayout of
                            -- We end up here if the route was hit before; but we were routed
                            -- elsewhere before the graph layout could be computed.
                            Nothing ->
                                computeGraphLayoutCmd subjectDetails

                            Just _ ->
                                Cmd.none
                ]

        -- Runs the commands needed for 'ShowSubject subject' route
        ShowTopic subject _ ->
            routeLoadCmd authenticatedUser model (ShowSubject subject)


computeGraphLayoutCmd : SubjectDetails -> Cmd Msg
computeGraphLayoutCmd subjectDetails =
    Graphs.computeGraphLayout
        { subjectId = subjectDetails.id
        , topics = List.map .id subjectDetails.topics
        , edges = subjectDetails.edges
        }

setKnowledgeCmd : Authentication.AuthenticatedUser -> String -> String -> Bool -> Cmd Msg
setKnowledgeCmd authenticatedUser subjectId topicId known = case known of
  True -> addKnowledgeCmd authenticatedUser subjectId topicId
  False -> removeKnowledgeCmd authenticatedUser subjectId topicId

addKnowledgeCmd : Authentication.AuthenticatedUser -> String -> String -> Cmd Msg
addKnowledgeCmd authenticatedUser subjectId topicId =
      Http.request
          { method = "PUT"
          , headers = [ Http.header "x-id-token" authenticatedUser.idToken ]
          , url = "/api/people/me/knowledge/" ++ subjectId ++ "/" ++ topicId
          , body = Http.jsonBody <| JE.object []
          , expect = Http.expectJson (Decode.succeed ())
          , timeout = Nothing
          , withCredentials = False
          }
          |> RemoteData.sendRequest
          |> Cmd.map MyKnowledgeUpdateResponse

removeKnowledgeCmd : Authentication.AuthenticatedUser -> String -> String -> Cmd Msg
removeKnowledgeCmd authenticatedUser subjectId topicId =
      Http.request
          { method = "DELETE"
          , headers = [ Http.header "x-id-token" authenticatedUser.idToken ]
          ,  url = "/api/people/me/knowledge/" ++ subjectId ++ "/" ++ topicId
          , body = Http.emptyBody
          , expect = Http.expectJson (Decode.succeed ())
          , timeout = Nothing
          , withCredentials = False
          }
          |> RemoteData.sendRequest
          |> Cmd.map MyKnowledgeUpdateResponse



update : Authentication.AuthenticatedUser -> Msg -> Model -> ( Model, Cmd Msg )
update authenticatedUser msg model =
    case msg of
        GraphLayoutComputed graphLayout ->
            let
                subjectDetails =
                    Dict.update graphLayout.subjectId (Maybe.map (\sd -> { sd | graphLayout = Just graphLayout })) model.subjectDetails
            in
            ( { model | subjectDetails = subjectDetails }, Cmd.none )

        SubjectSummariesResponse subjects ->
            ( { model | subjectSummaries = subjects }, Cmd.none )

        MyKnowledgeResponse myKnowledge ->
            ( { model | myKnowledge = myKnowledge }, Cmd.none )

        MyProjectsResponse myProjects ->
            ( { model | myProjects = myProjects }, Cmd.none )

        SubjectDetailsResponse subjectDetailsWebData ->
            case subjectDetailsWebData of
                Success subjectDetails ->
                    -- We give the `computeGraphLayout` command here; but it's a bit tricky, because it will only work (and result in a GraphLayoutComputed Msg), if
                    -- the nodes are rendered. If we reroute away before that happens, the Cmd will not do anything. So there's an additional trigger point for this
                    -- in the routeLoadCmd function.
                    ( { model | subjectDetails = Dict.insert subjectDetails.id subjectDetails model.subjectDetails }, computeGraphLayoutCmd subjectDetails )

                -- TODO, display this error somewhere.
                _ ->
                    ( model, Cmd.none )

        -- TODO, we probably want to check this for errors, and if there's an
        -- error, store it in the model and show it in the UI until the user discards the message.
        GenericSave _ ->
          ( model, Cmd.none )

        TabMsg subjectId topicId state ->
            let
                lens =
                    modelSubjectDetailsDict
                        |> Compose.lensWithOptional (MC.dict subjectId)
                        |> Compose.optionalWithLens subjectDetailsTopicDetailsList
                        |> Compose.optionalWithOptional (byIdInList topicId)
                        |> Compose.optionalWithLens tabStateInTopicDetails
            in
            ( lens.set state model, Cmd.none )

        AssessmentQuestionHintPopoverMsg subjectId topicId question state ->
            let
                lens =
                    modelSubjectDetailsDict
                        |> Compose.lensWithOptional (MC.dict subjectId)
                        |> Compose.optionalWithLens subjectDetailsTopicDetailsList
                        |> Compose.optionalWithOptional (byIdInList topicId)
                        |> Compose.optionalWithLens assessmentQuestionsHintPopoverStateInTopicDetails
                        |> Compose.optionalWithOptional (MC.dict question)
            in
            ( lens.set state model, Cmd.none )

        ToggleTopicKnown subjectId topicId ->
          let
              lens =
                modelMyKnowledge
                  |> Compose.optionalWithLens (lensFromOptional [] (MC.dict subjectId))
                  |> Compose.optionalWithLens (listContainsLens topicId)

              newModel = Optional.modify lens not model
              newValue = not ((lens.getOption model) |> Maybe.withDefault False)
          in
            (Optional.modify lens not model, setKnowledgeCmd authenticatedUser subjectId topicId newValue)

        MyKnowledgeUpdateResponse _ ->
          (model, Cmd.none) -- FIXME, show an error if necessary.

        UpdateProject updateProjectMsg ->
          updateProject authenticatedUser updateProjectMsg model


updateProject : Authentication.AuthenticatedUser -> UpdateProjectMsg -> Model -> (Model, Cmd Msg)
updateProject authenticatedUser updateProjectMsg model =

    case updateProjectMsg of
      StartProject subjectId projectId ->
        let
          url = (modelProjectURLOptional subjectId projectId).getOption model |> Maybe.withDefault ""
          newModel = (modelProjectStatusOptional subjectId projectId).set (Started url) model
        in
          (newModel, saveProjectStatus authenticatedUser subjectId projectId newModel)

      FinishProject subjectId projectId ->
        let
          url = (modelProjectURLOptional subjectId projectId).getOption model |> Maybe.withDefault ""
          newModel = (modelProjectStatusOptional subjectId projectId).set (Finished url) model
        in
          (newModel, saveProjectStatus authenticatedUser subjectId projectId newModel)

      StopProject subjectId projectId ->
        let
          newModel = (modelProjectStatusOptional subjectId projectId).set NotStarted model
        in
        (newModel, saveProjectStatus authenticatedUser subjectId projectId newModel)

      SetProjectURL subjectId projectId url ->
        ((modelProjectURLOptional subjectId projectId).set url model, Cmd.none)

      SaveProjectURL subjectId projectId ->
        (model, saveProjectStatus authenticatedUser subjectId projectId model)

-- Lenses, lenses everywhere!
modelMyProjects : Optional Model ProjectStatuses
modelMyProjects = Optional
      (\model -> case model.myProjects of
        Success prj -> Just prj
        _ -> Nothing)
      (\newProjects model -> { model | myProjects = Success newProjects })

myProjectsProjectStatus : String -> String -> Optional ProjectStatuses ProjectStatus
myProjectsProjectStatus subjectId projectId = MC.dict (subjectId, projectId)

modelProjectStatusOptional : String -> String -> Optional Model ProjectStatus
modelProjectStatusOptional subjectId projectId =
  modelMyProjects |> Compose.optionalWithOptional (myProjectsProjectStatus subjectId projectId)

projectStatusURLOptional : Optional ProjectStatus String
projectStatusURLOptional = Optional
  (\status -> case status of
    Started url -> Just url
    Finished url -> Just url
    _ -> Nothing)
  (\newUrl status -> case status of
    Started _ -> Started newUrl
    Finished _ -> Finished newUrl
    other -> other)

modelProjectURLOptional : String -> String -> Optional Model String
modelProjectURLOptional subjectId projectId =
  modelProjectStatusOptional subjectId projectId
    |> Compose.optionalWithOptional projectStatusURLOptional

modelMyKnowledge : Optional Model Knowledge
modelMyKnowledge =
    Optional
      (\model -> case model.myKnowledge of
        Success msd -> Just msd
        _ -> Nothing)
      (\newKnowledge model -> { model | myKnowledge = Success newKnowledge })

lensFromOptional : b -> Optional a b -> Lens a b
lensFromOptional defaultB optional = Lens
  (\a -> optional.getOption a |> Maybe.withDefault defaultB)
  optional.set

listContainsLens : a -> Lens (List a) Bool
listContainsLens value =
  Lens (List.member value) (\bool list ->
    case (bool, (List.member value list)) of
      (True, True) -> list
      (True, False) -> value :: list
      (False, False) -> list
      (false, True) -> List.filter ((/=) value) list
  )


modelSubjectDetailsDict : Lens Model (Dict String SubjectDetails)
modelSubjectDetailsDict =
    Lens .subjectDetails (\subjectDetails model -> { model | subjectDetails = subjectDetails })


subjectDetailsTopicDetailsList : Lens SubjectDetails (List TopicDetails)
subjectDetailsTopicDetailsList =
    Lens .topics (\topicDetails subjectDetails -> { subjectDetails | topics = topicDetails })



-- TODO: Can probably be implemented simpler using List.Extra.setAt or updateAt


byIdInList : String -> Optional (List { a | id : String }) { a | id : String }
byIdInList id =
    Optional
        (\list -> List.head <| List.filter (\elem -> elem.id == id) list)
        (\newElem list -> newElem :: List.filter (\elem -> elem.id /= id) list)


tabStateInTopicDetails : Lens TopicDetails Tab.State
tabStateInTopicDetails =
    Lens .tabState (\tabState topicDetails -> { topicDetails | tabState = tabState })


assessmentQuestionsHintPopoverStateInTopicDetails : Lens TopicDetails (Dict String Bootstrap.Popover.State)
assessmentQuestionsHintPopoverStateInTopicDetails =
    Lens .assessmentQuestionsHintPopoverState (\assessmentQuestionsHintPopoverState topicDetails -> { topicDetails | assessmentQuestionsHintPopoverState = assessmentQuestionsHintPopoverState })


loadSubjectSummaries : Cmd Msg
loadSubjectSummaries =
    Http.get "/api/core-curriculum" subjectSummariesDecoder
        |> RemoteData.sendRequest
        |> Cmd.map SubjectSummariesResponse

loadMyKnowledge : Authentication.AuthenticatedUser -> Cmd Msg
loadMyKnowledge authenticatedUser =
    Http.request
        { method = "GET"
        , headers = [ Http.header "x-id-token" authenticatedUser.idToken ]
        , url = "/api/people/me/knowledge"
        , body = Http.emptyBody
        , expect = Http.expectJson knowledgeDecoder
        , timeout = Nothing
        , withCredentials = False
        }
        |> RemoteData.sendRequest
        |> Cmd.map MyKnowledgeResponse


saveProjectStatus : Authentication.AuthenticatedUser -> String -> String -> Model -> Cmd Msg
saveProjectStatus authenticatedUser subjectId projectId model =
  let
    putStatusAndUrl : String -> String -> Cmd Msg
    putStatusAndUrl status url =
      Cmd.batch
        [ Http.request
          { method = "PUT"
          , headers = [ Http.header "x-id-token" authenticatedUser.idToken ]
          , url = "/api/people/me/projects/" ++ subjectId ++ "/" ++ projectId ++ "?url=" ++ url
          , body = Http.emptyBody
          , expect = Http.expectJson <| Decode.succeed ()
          , timeout = Nothing
          , withCredentials = False
          }
          |> RemoteData.sendRequest
          |> Cmd.map GenericSave
        , Http.request
          { method = "PUT"
          , headers = [ Http.header "x-id-token" authenticatedUser.idToken ]
          , url = "/api/people/me/projects/" ++ subjectId ++ "/" ++ projectId ++ "/" ++ status
          , body = Http.emptyBody
          , expect = Http.expectJson <| Decode.succeed ()
          , timeout = Nothing
          , withCredentials = False
          }
          |> RemoteData.sendRequest
          |> Cmd.map GenericSave
        ]
  in
    case (modelProjectStatusOptional subjectId projectId).getOption model of

      -- Shouldn't happen
      Nothing -> Cmd.none

      Just NotStarted ->
        Http.request
         { method = "DELETE"
         , headers = [ Http.header "x-id-token" authenticatedUser.idToken ]
         , url = "/api/people/me/projects/" ++ subjectId ++ "/" ++ projectId
         , body = Http.emptyBody
         , expect = Http.expectJson <| Decode.succeed ()
         , timeout = Nothing
         , withCredentials = False
         }
         |> RemoteData.sendRequest
         |> Cmd.map GenericSave

      Just (Started url) -> putStatusAndUrl "in-progress" url

      Just (Finished url) -> putStatusAndUrl "done" url

loadMyProjects : Authentication.AuthenticatedUser -> Cmd Msg
loadMyProjects authenticatedUser =
    Http.request
        { method = "GET"
        , headers = [ Http.header "x-id-token" authenticatedUser.idToken ]
        , url = "/api/people/me/projects"
        , body = Http.emptyBody
        , expect = Http.expectJson projectsDecoder
        , timeout = Nothing
        , withCredentials = False
        }
        |> RemoteData.sendRequest
        |> Cmd.map MyProjectsResponse

loadSubjectDetails : String -> Cmd Msg
loadSubjectDetails subjectId =
    Http.get ("/data/core-curriculum/knowledge/" ++ subjectId ++ ".json") subjectDetailsDecoder
        |> RemoteData.sendRequest
        |> Cmd.map SubjectDetailsResponse


subjectSummaryDecoder : Decoder SubjectSummary
subjectSummaryDecoder =
    map7 SubjectSummary
        (field "id" Decode.string)
        (field "name" Decode.string)
        (field "description" Decode.string)
        (field "tags" (Decode.list Decode.string))
        (field "topics" (Decode.list topicSummaryDecoder))
        (field "image" Decode.string)
        (field "primary" bool)


knowledgeDecoder : Decoder Knowledge
knowledgeDecoder =
    Decode.dict (Decode.list Decode.string)

projectsDecoder : Decoder ProjectStatuses
projectsDecoder =
  Decode.map Dict.fromList
    (Decode.list namedProjectStatusDecoder)

namedProjectStatusDecoder : Decoder ((String, String), ProjectStatus)
namedProjectStatusDecoder =
  let
    statusMapper subjectId topicId doneOn url =
        ((subjectId, topicId), case doneOn of
          Nothing -> Started (url |> Maybe.withDefault "")
          Just v -> Finished (url |> Maybe.withDefault ""))
  in
    Decode.map4 statusMapper
      (field "subject" Decode.string)
      (field "project" Decode.string)
      (maybe (field "doneOn" Decode.string))
      (maybe (field "url" Decode.string))

topicSummaryDecoder : Decoder TopicSummary
topicSummaryDecoder =
    Decode.map3 TopicSummary
        (field "id" Decode.string)
        (field "name" Decode.string)
        (field "tags" (Decode.list Decode.string))


subjectSummariesDecoder : Decoder (List SubjectSummary)
subjectSummariesDecoder =
    Decode.list subjectSummaryDecoder


myStudentDetailsDecoder : Decoder MyStudentDetails
myStudentDetailsDecoder =
    Decode.succeed MyStudentDetails
        |> hardcoded "foo" -- FIXME


subjectDetailsDecoder : Decoder SubjectDetails
subjectDetailsDecoder =
    Decode.succeed SubjectDetails
        |> required "id" Decode.string
        |> required "name" Decode.string
        |> required "description" Decode.string
        |> required "headmaster" (nullable Decode.string)
        |> optional "teachers" (Decode.list Decode.string) []
        |> optional "tags" (Decode.list Decode.string) []
        |> required "image" Decode.string
        |> optional "primary" bool False
        |> required "topics" (Decode.list topicDetailsDecoder)
        |> required "topics" (Decode.map computeEdges (Decode.list topicDetailsDecoder))
        |> optional "projects" (Decode.list projectDecoder) []
        |> hardcoded Nothing


projectDecoder : Decoder Project
projectDecoder =
    Decode.succeed Project
        |> required "id" Decode.string
        |> required "name" Decode.string
        |> required "description" Decode.string
        |> optional "dependencies" (Decode.list Decode.string) []


type alias Edge =
    { from : String
    , to : String
    }


computeEdges : List TopicDetails -> List Edge
computeEdges =
    List.concatMap
        (\topicDetails ->
            List.map
                (\dependency ->
                    { from = dependency, to = topicDetails.id }
                )
                topicDetails.dependencies
        )


topicDetailsDecoder : Decoder TopicDetails
topicDetailsDecoder =
    Decode.succeed TopicDetails
        |> required "id" Decode.string
        |> required "name" Decode.string
        |> required "description" Decode.string
        |> optional "tags" (Decode.list Decode.string) []
        |> optional "dependencies" (Decode.list Decode.string) []
        |> optional "resources" (Decode.list resourceDecoder) []
        |> optional "abilities" (Decode.list Decode.string) []
        |> optional "assessment-questions" (Decode.list assessmentQuestionDecoder) []
        |> hardcoded Tab.initialState
        |> hardcoded Dict.empty


assessmentQuestionDecoder : Decoder AssessmentQuestion
assessmentQuestionDecoder =
    Decode.succeed AssessmentQuestion
        |> required "question" Decode.string
        |> optional "answer-hint" (Decode.map Just Decode.string) Nothing


resourceDecoder : Decoder Resource
resourceDecoder =
    Decode.succeed Resource
        |> required "name" Decode.string
        |> required "type" Decode.string
        -- TODO, make enum?
        |> required "url" Decode.string
        |> optional "tags" (Decode.list Decode.string) []


view : Route -> Model -> Html Msg
view r model =
    case RemoteData.map3 (\a b c-> ( a, b, c )) model.subjectSummaries model.myKnowledge model.myProjects of
        NotAsked ->
            Fragments.spinner

        Loading ->
            Fragments.spinner

        RemoteData.Failure err ->
            text "Failed to load the Core Curriculum."

        Success ( subjectSummaries, myKnowledge, myProjects ) ->
            case r of
                Home ->
                    viewHome subjectSummaries

                ShowSubject subjectId ->
                    case Dict.get subjectId model.subjectDetails of
                        Nothing ->
                            Fragments.spinner

                        Just subjectDetails ->
                            viewSubject subjectDetails myKnowledge myProjects

                ShowTopic subjectId topicId ->
                    case Dict.get subjectId model.subjectDetails of
                        Nothing ->
                            Fragments.spinner

                        Just subjectDetails ->
                            case List.head <| List.filter (\td -> td.id == topicId) subjectDetails.topics of
                                Nothing ->
                                    Fragments.spinner

                                Just topicDetails ->
                                    viewTopic subjectDetails topicDetails (hasKnowledge subjectId topicId myKnowledge)


hasKnowledge : String -> String -> Knowledge -> Bool
hasKnowledge subjectId topicId knowledge =
    case Dict.get subjectId knowledge of
        Nothing ->
            False

        Just topics ->
            case List.Extra.find (\e -> e == topicId) topics of
                Nothing ->
                    False

                Just _ ->
                    True


viewHome : List SubjectSummary -> Html Msg
viewHome subjectSummaries =
    div []
        [ Fragments.viewBreadCrumbs [ ( "University", Nothing ) ]
        , div [ class "mt-4" ] [ viewSubjectCards subjectSummaries ]
        ]


viewSubject : SubjectDetails -> Knowledge -> ProjectStatuses -> Html Msg
viewSubject subjectDetails knowledge projectstatuses =
    div []
        [ Fragments.viewBreadCrumbs [ ( "University", Just "/university" ), ( subjectDetails.name, Nothing ) ]
        , h1 [] [ text subjectDetails.name ]
        , viewKnowledgeGraph subjectDetails knowledge
        , viewProjects subjectDetails.id subjectDetails.projects projectstatuses
        ]


viewTopic : SubjectDetails -> TopicDetails -> Bool -> Html Msg
viewTopic subjectDetails topicDetails known =
    div []
        [ Fragments.viewBreadCrumbs [ ( "University", Just "/university" ), ( subjectDetails.name, Just ("/university/" ++ subjectDetails.id) ), ( topicDetails.name, Nothing ) ]
        , h1 [] [ text topicDetails.name ]
        , div [ class "row" ]
            [ div [ class "col-sm-9" ] [ viewTopicTabs subjectDetails topicDetails ]
            , div [ class "col-sm-3" ] [ viewTopicKnowledgeCard subjectDetails.id topicDetails.id known ]
            ]
        ]


viewTopicKnowledgeCard : String -> String -> Bool -> Html Msg
viewTopicKnowledgeCard subjectId topicId known =
    div
        [ class "card" ]
        [ div
            [ class "card-body" ]
            [ h5
                [ class "card-title" ]
                [ text "You know all this?" ]
            , p
                [ class "card-text" ]
                [ div
  [ class "form-check" ]
  [ input
    [ class "form-check-input position-static", type_ "checkbox", Html.Attributes.value "known", checked known, onClick (ToggleTopicKnown subjectId topicId)]
    []
  ] ]
            ]
        ]


viewTopicTabs : SubjectDetails -> TopicDetails -> Html Msg
viewTopicTabs subjectDetails topicDetails =
    Tab.config (TabMsg subjectDetails.id topicDetails.id)
        |> Tab.useHash True
        |> Tab.items
            [ Tab.item
                { id = "description"
                , link = Tab.link [] [ text "Description" ]
                , pane =
                    Tab.pane [ Spacing.mt3 ]
                        [ Markdown.toHtml [] topicDetails.description
                        , viewResources topicDetails.resources
                        ]
                }
            , Tab.item
                { id = "abilities"
                , link = Tab.link [] [ text "Abilities" ]
                , pane =
                    Tab.pane [ Spacing.mt3 ]
                        [ viewAbilities topicDetails.abilities ]
                }
            , Tab.item
                { id = "self-test"
                , link = Tab.link [] [ text "Test Yourself" ]
                , pane =
                    Tab.pane [ Spacing.mt3 ]
                        [ viewAssessmentQuestions subjectDetails.id topicDetails.id topicDetails.assessmentQuestions topicDetails.assessmentQuestionsHintPopoverState
                        ]
                }
            ]
        |> Tab.view topicDetails.tabState


viewAssessmentQuestions : String -> String -> List AssessmentQuestion -> Dict String Bootstrap.Popover.State -> Html Msg
viewAssessmentQuestions subjectId topicId assessmentQuestions hintStateDict =
    if List.isEmpty assessmentQuestions then
        div [] [ text <| "No questions" ]
        -- TODO, improve layout

    else
        div []
            [ Bootstrap.ListGroup.ul <|
                List.map
                    (\assessmentQuestion ->
                        let
                            popoverState =
                                Maybe.withDefault Bootstrap.Popover.initialState (Dict.get assessmentQuestion.question hintStateDict)

                            maybeAnswerHint =
                                Maybe.withDefault [] <|
                                    Maybe.map
                                        (\answerHintText ->
                                            [ Bootstrap.Popover.config
                                                (Bootstrap.Button.button
                                                    -- Here configure the popover to be shown when the mouse is above the button ( tooltip basically !)
                                                    [ Bootstrap.Button.info, Bootstrap.Button.small, Bootstrap.Button.attrs <| Bootstrap.Popover.onHover popoverState (AssessmentQuestionHintPopoverMsg subjectId topicId assessmentQuestion.question) ]
                                                    [ text "Hint" ]
                                                )
                                                |> Bootstrap.Popover.top
                                                |> Bootstrap.Popover.content []
                                                    [ text answerHintText ]
                                                |> Bootstrap.Popover.view popoverState
                                            ]
                                        )
                                        assessmentQuestion.answerHint
                        in
                        Bootstrap.ListGroup.li [ Bootstrap.ListGroup.attrs <| [ class "d-flex", class "justify-content-between", class "align-items-center" ] ]
                            (Markdown.toHtml [] assessmentQuestion.question :: maybeAnswerHint)
                    )
                    assessmentQuestions
            ]


viewResources : List Resource -> Html Msg
viewResources resources =
    let
        item : Resource -> Bootstrap.ListGroup.Item Msg
        item resource =
            Bootstrap.ListGroup.li []
                [ a [ href resource.url ]
                    [ icon resource.typ
                    , text <| resource.name
                    ]
                ]

        icon : String -> Html Msg
        icon resourceType =
            case resourceType of
                "video" ->
                    span [ class "resource", class "fi-video", title "Video Resource", attribute "aria-hidden" "true" ] []

                -- TODO, a lot of duplication in showing an icon here and elsewhere.
                _ ->
                    span [ class "resource", class "fi-document", title "Document Resource", attribute "aria-hidden" "true" ] []
    in
    if List.isEmpty resources then
        div [] []

    else
        div []
            [ h6 [] [ text <| "Resources" ]
            , Bootstrap.ListGroup.ul <| List.map item resources
            ]


viewAbilities : List String -> Html Msg
viewAbilities abilities =
    if List.isEmpty abilities then
        div [] []

    else
        div []
            [ Bootstrap.ListGroup.ul <| List.map (\ability -> Bootstrap.ListGroup.li [] [ text ability ]) abilities
            ]


viewProjects : String -> List Project -> ProjectStatuses -> Html Msg
viewProjects subjectId projects projectStatuses =
  let

    viewProject : Project -> Html Msg
    viewProject project = div
      [ class "card", class "mt-3" ]
      [ div
        [ class "card-body" ]
        [ h3
          [ class "card-title" ]
          [ text project.name ]
        , Markdown.toHtml [ class "project-description" ] project.description
        ]
      , div
        [ class "card-footer" ]
        [ text <| "Depends on: " ++ String.join ", " project.dependencies]
      , div [ class "card-footer" ]
          [ viewProjectStatus subjectId project.id projectStatuses ]
      ]
  in
    div [ class "mt-3" ] <|
      (h1 [] [ text "Projects"]) :: (List.map viewProject projects)

viewProjectStatus : String -> String -> ProjectStatuses -> Html Msg
viewProjectStatus subjectId projectId projectStatuses =
  let
    status value = label [ class "my-1", class "mr-2" ] [ text <| "Status: " ++ value ]
    urlInput = onInput (\v -> UpdateProject <| SetProjectURL subjectId projectId v)
    urlBlur = onBlur <| UpdateProject <| SaveProjectURL subjectId projectId
    statusClick constructor = onClick <| UpdateProject <| constructor subjectId projectId
    content =
      case Dict.get (subjectId, projectId) projectStatuses |> Maybe.withDefault NotStarted of
        NotStarted ->
          [ status "Not Started"
          , button [ type_ "button", class "btn btn-primary", statusClick StartProject ] [ text "Start" ]
          ]

        Started url ->
            [ status "In Progress"
            , button [ type_ "button", class "btn btn-cancel", statusClick StopProject] [ text "Cancel" ]
            , input [ type_ "text", Html.Attributes.value url, class "form-control", placeholder "Repository URL", urlInput, urlBlur ] []
            , button [ type_ "button", class "btn btn-primary", statusClick FinishProject ] [ text "Finished!" ]
            ]

        Finished url ->
          [ status "Completed"
          , button [ type_ "button", class "btn btn-cancel", statusClick StartProject ] [ text "Reopen" ]
          , input [ type_ "text", Html.Attributes.value url, class "form-control", placeholder "Repository URL", urlInput, urlBlur ] []
          ]
  in

    div
      [ class "form-row align-items-center" ]
      (List.map (\elem -> div [ class "col-auto", class "my-1" ] [ elem ]) content)



viewKnowledgeGraph : SubjectDetails -> Knowledge -> Html Msg
viewKnowledgeGraph subjectDetails knowledge =
    case subjectDetails.graphLayout of
        -- We use an external library (through ports) to compute the location of each node in the graph. However,
        -- it needs to know about the dimensions of every node. But we only know the dimenions of a node after rendering it!
        -- So here we render all the nodes (overlapping, and not visible for the user), then send a Cmd through the port
        -- which the JS will pick up, determine the dimensions of each node, use it to compute the GraphLayout and send it
        -- back to us. Easy! Scary as well!
        Nothing ->
            div [ class "knowledge-nodes", class "hidden" ] (List.map (\s -> viewTopicNode subjectDetails.id { left = 0, top = 0 } s knowledge) subjectDetails.topics)

        Just graphLayout ->
            div [ class "knowledge-graph-container" ]
                [ div [ class "knowledge-graph" ]
                    [ viewEdges graphLayout
                    , div [ class "knowledge-nodes" ]
                        (List.map
                            (\s ->
                                viewTopicNode subjectDetails.id (nodePosition graphLayout s) s knowledge
                            )
                            subjectDetails.topics
                        )
                    ]
                ]


edgePath : List { x : Float, y : Float } -> String
edgePath points =
    let
        pointPairs : List { x : Float, y : Float } -> String
        pointPairs pairs =
            case pairs of
                first :: second :: remainder ->
                    " Q" ++ String.fromFloat first.x ++ "," ++ String.fromFloat first.y ++ " " ++ String.fromFloat second.x ++ "," ++ String.fromFloat second.y ++ pointPairs remainder

                _ ->
                    ""

        -- TODO, warning?
    in
    case points of
        point :: remainder ->
            "M" ++ String.fromFloat point.x ++ "," ++ String.fromFloat point.y ++ pointPairs remainder

        _ ->
            ""


viewEdges : Graphs.GraphLayout -> Html Msg
viewEdges graphLayout =
    div [ class "knowledge-edges" ]
        [ Svg.svg [ Svg.Attributes.id "edges", Svg.Attributes.style ("width: " ++ String.fromFloat graphLayout.graphDimensions.width ++ "px;height: " ++ String.fromFloat graphLayout.graphDimensions.height ++ "px") ]
            (Svg.defs []
                [ Svg.marker [ Svg.Attributes.id "markerArrow", Svg.Attributes.markerWidth "13", Svg.Attributes.markerHeight "13", Svg.Attributes.refX "2", Svg.Attributes.refY "6", Svg.Attributes.orient "auto" ] []
                ]
                :: List.map (\points -> Svg.path [ Svg.Attributes.d (edgePath points) ] []) (List.map .points graphLayout.edges)
            )
        ]


nodePosition : Graphs.GraphLayout -> TopicDetails -> { left : Float, top : Float }
nodePosition graphLayout topicDetails =
    Maybe.withDefault { left = 0, top = 0 } <|
        List.head <|
            List.filterMap
                -- TODO, optimize with a 'find' function.
                (\n ->
                    if n.id == topicDetails.id then
                        Just { top = n.top, left = n.left }

                    else
                        Nothing
                )
                graphLayout.nodes


viewTopicNode : String -> { left : Float, top : Float } -> TopicDetails -> Knowledge -> Html Msg
viewTopicNode subjectId position topicDetails knowledge =
    let
        ( videoResources, otherResources ) =
            List.partition (\r -> r.typ == "video") topicDetails.resources
        knowledgeHasTopic =
          Dict.get subjectId knowledge |> Maybe.withDefault [] |> List.member topicDetails.id

    in
    a [ class "knowledge-node", classList [("known", knowledgeHasTopic), ("required", List.member "required-for-junior" topicDetails.tags)], style "left" (String.fromFloat position.left ++ "px"), style "top" (String.fromFloat position.top ++ "px"), attribute "data-topic-id" topicDetails.id, href ("/university/" ++ subjectId ++ "/" ++ topicDetails.id) ]
        [ div
            [ class "label" ]
            []
        , span [] [ text <| topicDetails.name ]
        , div [ class "resources" ]
            [ span [ class "resource", class "fi-video", classList [ ( "hidden", List.isEmpty videoResources ) ], title "Video Resources", attribute "aria-hidden" "true" ] []
            , span [ class "resource", class "fi-document", classList [ ( "hidden", List.isEmpty otherResources ) ], title "Document Resources", attribute "aria-hidden" "true" ] []
            ]
        ]


viewSubjectCards : List SubjectSummary -> Html Msg
viewSubjectCards subjects =
    let
        ( primary, secondary ) =
            List.partition .primary subjects

        primaryPairs =
            grouped 2 primary

        secondaryTriplets =
            grouped 3 secondary
    in
    div []
        (List.concat
            [ List.map (subjectCardRow 2) primaryPairs
            , List.map (subjectCardRow 3) secondaryTriplets
            ]
        )


subjectCardRow : Int -> List SubjectSummary -> Html Msg
subjectCardRow colCount subjects =
    div [ class "row mb-4 row-eq-height" ]
        (List.map (viewSubjectCard colCount) subjects)


grouped : Int -> List a -> List (List a)
grouped size list =
    if List.length list <= size then
        [ list ]

    else
        List.take size list :: grouped size (List.drop size list)


viewSubjectCard : Int -> SubjectSummary -> Html Msg
viewSubjectCard colCount subject =
    let
        colWidth =
            if colCount == 2 then
                6

            else
                4
    in
    div [ class ("col-md-" ++ String.fromInt colWidth ++ " d-flex") ]
        [ div [ class "card" ]
            [ img [ class "card-img-top", src subject.image ]
                []
            , div [ class "card-body" ]
                [ h5 [ class "card-title" ]
                    [ text subject.name ]
                , p [ class "card-text" ]
                    [ text subject.description ]
                ]
            , div [ class "card-footer" ]
                [ a [ class "card-link", href <| "/university/" ++ subject.id ]
                    [ text "Details" ]
                ]
            ]
        ]
