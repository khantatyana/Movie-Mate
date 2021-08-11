import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import Home from "./Components/Home";
import "firebase/auth";
import "./App.css";
import { Movies } from "./Components/Movies";
import { NotFound } from "./Components/NotFound";
import { UserProfile } from "./Components/UserProfile";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Movie } from "./Components/Movie";

const firebaseConfig = {
  apiKey: "AIzaSyDYk4I-2c5E72cvb_wJwg3syt7xjrAssQg",
  authDomain: "movie-mate-43364.firebaseapp.com",
  projectId: "movie-mate-43364",
  storageBucket: "movie-mate-43364.appspot.com",
  messagingSenderId: "174076031402",
  appId: "1:174076031402:web:a5609b82cf4905d55c3bd3",
  measurementId: "G-54RM0PJWCW",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setAuthenticated(!!user);
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              <Link to="/movies">Movie Mate</Link>
            </Typography>
            {authenticated ? (
              <Button color="inherit" onClick={() => firebase.auth().signOut()}>
                Sign-out
              </Button>
            ) : null}
          </Toolbar>
        </AppBar>
        {authenticated ? (
          <div className="App-body">
            <Switch>
              <Route exact path="/movies" component={Movies} />
              <Route exact path="/movies/:movieId" component={Movie} />
              <Route exact path="/404" component={NotFound} />
              <Route exact path="/users/:userId" component={UserProfile} />
              <Redirect from="" to="/movies" />
            </Switch>
          </div>
        ) : (
          <div className="App-body">
            <Home></Home>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
