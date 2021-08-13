import { useEffect, useState } from "react";
import { LinearProgress } from "@material-ui/core";
import axios from "axios";
import firebase from "firebase/app";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import { Link } from "react-router-dom";
// import IconButton from "@material-ui/core/IconButton";

export const UserProfile = (props) => {
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
  }));

  const classes = useStyles();
  const [currentUser] = useState(firebase.auth().currentUser);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(undefined);
  let wishList = null;
  let favorites = null;

  useEffect(() => {
    (async () => {
      console.log(userData);
      console.log(currentUser);
      try {
        setLoading(true);
        const { data } = await axios.get(`/users/${currentUser.uid}`);
        console.log(data);
        setUserData(data);
        setLoading(false);
      } catch (e) {
        setError(e.messages);
        console.log(error);
      }
    })();
  }, [currentUser, userData, error]);

  const buildWishListItem = (result) => {
    return (
      <ImageListItem key={result.movieId}>
        <Link to={"movies/" + result.movieId}>
          {result.img ? (
            <img src={result.img} alt={result.title} />
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

  const buildFavListItem = (result) => {
    return (
      <ImageListItem key={result.movieId}>
        <Link to={"movies/" + result.movieId}>
          {result.img ? (
            <img src={result.img} alt={result.title} />
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

  if (userData.wishList) {
    wishList =
      userData &&
      userData.wishList.map((item) => {
        return buildWishListItem(item);
      });
  }

  if (userData.favorites) {
    favorites =
      userData &&
      userData.favorites.map((item) => {
        return buildFavListItem(item);
      });
  }

  return (
    <div>
      <div>
        {loading ? (
          <LinearProgress color="secondary" />
        ) : (
          <div className="progress-placeholder"></div>
        )}
      </div>
      <div className="profile-header">
        <img src={currentUser.photoURL} alt="Profile" />
        <p>Name: {currentUser.displayName}</p>
        <p>Email: {currentUser.email}</p>
      </div>
      <h2> My Favorites </h2>
      <div className={classes.root}>
        <ImageList className={classes.imageList} rowHeight={350} cols={4}>
          {favorites}
        </ImageList>
      </div>
      <p>{` << Scroll >> `}</p>
      <h2> My Wish List </h2>
      <div className={classes.root}>
        <ImageList className={classes.imageList} rowHeight={350} cols={4}>
          {wishList}
        </ImageList>
      </div>
      <p>{` << Scroll >> `}</p>
    </div>
  );
};
