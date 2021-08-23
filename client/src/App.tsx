import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
  NavLink,
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
import { Movie } from "./Components/Movie";
import { Box, IconButton, Menu, MenuItem, Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Recommendations from "./Components/Recommendations";

const firebaseConfig = {
  apiKey: "AIzaSyDYk4I-2c5E72cvb_wJwg3syt7xjrAssQg",
  authDomain: "movie-mate-43364.firebaseapp.com",
  projectId: "movie-mate-43364",
  storageBucket: "movie-mate-43364.appspot.com",
  messagingSenderId: "174076031402",
  appId: "1:174076031402:web:a5609b82cf4905d55c3bd3",
  measurementId: "G-54RM0PJWCW",
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    maxWidth: 40,
    marginRight: "10px",
  },
  activeTab: {
    borderBottom: "solid thick #f9288a",
    opacity: 1,
  },
}));

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
  const [loggedUser, setLoggedUser] = useState(null);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signout = () => {
    setAnchorEl(null);
    firebase.auth().signOut();
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setLoggedUser(user);
      setAuthenticated(!!user);
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Box display="flex" flexDirection="row">
              {/* Logo */}
              <Link to="/movies" edge="start">
                <img
                  src="/favicon-32x32.png"
                  alt="Movie-Mate Logo"
                  className={classes.logo}
                ></img>
              </Link>

              <Typography variant="h6">
                <Link to="/movies">Movie Mate</Link>
              </Typography>
            </Box>

            <Box display="flex" flexDirection="row">
              {/* Nav pages  */}
              <Tabs value={false}>
                <Tab
                  label="Explore Movies"
                  component={NavLink}
                  exact
                  to="/movies"
                  activeClassName={classes.activeTab}
                />
                <Tab
                  label="My Recommendations"
                  component={NavLink}
                  exact
                  to="/recommendations"
                  activeClassName={classes.activeTab}
                />
              </Tabs>
            </Box>

            <Box display="flex" flexDirection="row">
              {/* Profile links */}
              {authenticated ? (
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    {loggedUser && loggedUser.photoURL ? (
                      <Avatar alt={loggedUser.name} src={loggedUser.photoURL} />
                    ) : (
                      <AccountCircle />
                    )}
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={handleClose}
                      component={NavLink}
                      exact
                      to="/profile"
                    >
                      <AccountCircleIcon /> &nbsp; My Profile
                    </MenuItem>
                    <MenuItem onClick={signout}>
                      <ExitToAppIcon /> &nbsp; Sign-out
                    </MenuItem>
                  </Menu>
                </div>
              ) : null}
            </Box>
          </Toolbar>
        </AppBar>
        {authenticated ? (
          <div className="App-body">
            <Switch>
              <Route exact path="/movies" component={Movies} />
              <Route
                exact
                path="/recommendations"
                component={Recommendations}
              />
              <Route exact path="/movies/:movieId" component={Movie} />
              <Route exact path="/404" component={NotFound} />
              <Route exact path="/profile" component={UserProfile} />
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
