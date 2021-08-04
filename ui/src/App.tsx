import { useEffect, useState } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import axios from "axios";
import Home from "./Home";
import "firebase/auth";
import "./App.css";

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

  const makeRequest = async () => {
    const user = firebase.auth().currentUser;

    let token = null;

    try {
      token = await user.getIdToken();
    } catch (e) {}

    try {
      await axios.get("http://localhost:4200", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("authenticated request SUCCESS!");
    } catch (e) {
      alert("authenticated request FAILURE!");
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setAuthenticated(!!user);
    });
  }, []);

  if (!authenticated) {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Movie-Mate</h1>
            <Link className="showlink" to="/">
              Home
            </Link>
            <Link className="showlink" to="/">
              Login/Signup
            </Link>
          </header>
          <Home></Home>
          <p>Please sign-in:</p>
          <button onClick={() => makeRequest()}>Make request</button>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
          <div className="App-body">
            <Route exact path="/"></Route>
            <Route exact path="/Login"></Route>
            <Route exact path="/Signup"></Route>
          </div>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Movie-Mate</h1>
          <Link className="showlink" to="/">
            Home
          </Link>
          <Link className="showlink" to="/">
            Login/Signup
          </Link>
        </header>
        <Home></Home>
        <p>
          Welcome {firebase.auth().currentUser.displayName}! You are now
          signed-in!
        </p>
        <button onClick={() => makeRequest()}>Make request</button>
        <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
        <div className="App-body">
          <Route exact path="/"></Route>
          <Route exact path="/Login"></Route>
          <Route exact path="/Signup"></Route>
        </div>
      </div>
    </Router>
  );
}

export default App;
