import React from "react";
import axios from "axios";
import { useEffect } from "react";
import firebase from "firebase/app";
import { Link } from "react-router-dom";
import EditFormModal from "./EditFormModal";
import {
  makeStyles,
  ImageListItem,
  ImageList,
  ImageListItemBar,
  Avatar,
  Card,
  CardActions,
  CardContent,
  Typography,
  LinearProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  title: {
    color: "black",
  },
  titleBar: {
    background: "white",
  },
  large: {
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
  card: {
    maxWidth: 350,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 25,
  },
  name: {
    fontSize: 24,
  },
  pos: {
    marginBottom: 12,
  },
}));

export const UserProfile = () => {
  const classes = useStyles();
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [currentUser] = React.useState(firebase.auth().currentUser);
  let wishList = null;
  let favorites = null;

  async function getToken() {
    try {
      const user = firebase.auth().currentUser;
      return await user.getIdToken();
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const BASE_URL = window.location.href.includes("localhost")
          ? "http://localhost:4200/api"
          : "https://movie-mate-cs-554.herokuapp.com/api";
        const token = await getToken();
        const response = await axios.get(
          `${BASE_URL}/users/${currentUser.uid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (e) {
        setError(e.messages);
      }
    }
    fetchData();
  }, [currentUser]);

  const buildListItem = (result) => {
    console.log(result);
    return (
      <ImageListItem key={result._id}>
        <Link to={"movies/" + result._id}>
          {result.posterUrl ? (
            <img
              src={`https://image.tmdb.org/t/p/w500/${result.posterUrl}`}
              alt={result.title}
            />
          ) : (
            <p className="no-image-available">No image available</p>
          )}

          <ImageListItemBar
            title={`${result.title} (${result.year})`}
            classes={{
              root: classes.titleBar,
              title: classes.title,
            }}
          />
        </Link>
      </ImageListItem>
    );
  };

  if (userData) {
    wishList =
      userData &&
      userData.wishMovies.map((item) => {
        return buildListItem(item);
      });
  }

  if (userData) {
    favorites =
      userData &&
      userData.likedMovies.map((item) => {
        return buildListItem(item);
      });
  }

  if (loading) {
    return <div>Loading...</div>;
  } else {
    if (error) {
      return (
        <div>
          <h1>{error}</h1>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            {loading ? (
              <LinearProgress color="secondary" />
            ) : (
              <div className="progress-placeholder"></div>
            )}
          </div>
          <div className="profile-container">
            <img
              alt="Profile"
              src={currentUser.photoURL}
              className="profile-picture"
            />
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {currentUser.displayName}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  <p>Email: {currentUser.email}</p>
                </Typography>
                <Typography component="p">Average Movie Goer :p</Typography>
              </CardContent>
              <CardActions>
                <EditFormModal currentUser={currentUser} />
                {/* <Button size="small">Learn More</Button> */}
              </CardActions>
            </Card>
          </div>
          <h2> My Favorites </h2>
          <div className={classes.root}>
            <ImageList className={classes.imageList} rowHeight={400} cols={3.5}>
              {favorites}
            </ImageList>
          </div>
          <p>{` << Scroll >> `}</p>
          <h2> My Wish List </h2>
          <div className={classes.root}>
            <ImageList className={classes.imageList} rowHeight={400} cols={3.5}>
              {wishList}
            </ImageList>
          </div>
          <p>{` << Scroll >> `}</p>
        </div>
      );
    }
  }
};
