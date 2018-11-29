import dagre from 'dagre'

import('./src/Main.elm')
    .then(({ Elm }) => {
        var node = document.querySelector('main');
        var app = Elm.Main.init({ node: node });

        console.log("Elm ports: ", app.ports);

        app.ports.computeGraphLayout.subscribe(function(data) {
          // This makes sure that the Elm view is rendered before we start looking at the DOM.
          window.requestAnimationFrame(function() {
            const nodes = new Array();
            const g = new dagre.graphlib.Graph();
            g.setGraph({ rankdir: "LR", align: "UL" });
            g.setDefaultEdgeLabel(function() { return {}; });

            const elements = document.getElementsByClassName("knowledge-node");
            for (var i = 0; i < elements.length; i++) {
              const id = elements[i].dataset.topicId;
              const {width, height} = elements[i].getBoundingClientRect();
              const node = {
                id: id,
                width: width,
                height: height
              };
              nodes.push(node);
              g.setNode(id, node);
            }

            data.edges.forEach(function(edge) {
              g.setEdge(edge.from, edge.to);
            });

            dagre.layout(g);

            const GRAPH_PADDING = 100;

            const graphDimensions = {
              height: g.graph().height + GRAPH_PADDING,
              width: g.graph().width + GRAPH_PADDING
            }

            const edges = g.edges().map(e => g.edge(e));

            // Dagre output is the center of the node; for the CSS we need the corner coordinates.
            nodes.forEach(function(node) {
              node.left = node.x - node.width / 2
              node.top = node.y - node.height / 2
            });

            const portData = {
              subjectId: data.subjectId,
              nodes: nodes,
              graphDimensions: graphDimensions,
              edges: edges
            }

            console.log(portData);

            app.ports.graphLayout.send(portData);

          });
        });



        gapi.load('auth2', function() {

          // This initializes the library, and also automatically signs in if the user was previously signed in.
          const googleAuth = gapi.auth2.init({
            client_id: '172845937673-o2va0riva3oihoib0f7ld1c70vt9eojo.apps.googleusercontent.com'
          });


          app.ports.requestAuthentication.subscribe(function() {
            googleAuth.signIn();
          });

          app.ports.requestLogout.subscribe(function() {
            googleAuth.signOut();
          });


          googleAuth.currentUser.listen(function(googleUser) {
            const profile = googleUser.getBasicProfile();
            if(profile === undefined || googleUser.getAuthResponse().id_token == undefined) {
              app.ports.nobodyAuthenticated.send(null);
            } else {
              const authenticatedUser = {
                id: profile.getId(),
                name: profile.getName(),
                imageUrl: profile.getImageUrl(),
                email: profile.getEmail(),
                idToken: googleUser.getAuthResponse().id_token
              };

              console.log("Sending authenticated user details to port", authenticatedUser);
              app.ports.userAuthenticated.send(authenticatedUser);
            }
          });

        });



    });
