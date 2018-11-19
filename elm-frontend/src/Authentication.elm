port module Authentication exposing (AuthenticatedUser, nobodyAuthenticated, requestAuthentication, requestLogout, userAuthenticated)


port requestAuthentication : () -> Cmd msg


port requestLogout : () -> Cmd msg


type alias AuthenticatedUser =
    { id : String
    , name : String
    , email : String
    , imageUrl : String
    , idToken : String
    }


port userAuthenticated : (AuthenticatedUser -> msg) -> Sub msg


port nobodyAuthenticated : (() -> msg) -> Sub msg
