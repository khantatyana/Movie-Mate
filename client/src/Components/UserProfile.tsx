import { useEffect, useState } from "react";
import { LinearProgress } from "@material-ui/core";
import axios from "axios";
import firebase from "firebase/app";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import EditFormModal from "./EditFormModal";
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
    large: {
      width: theme.spacing(24),
      height: theme.spacing(24),
      margin: theme.spacing(4, 3),
    },
    header: {
      margin: theme.spacing(4, 3),
    },
    border: {
      border: 2,
      borderColor: "blue",
      borderStyle: "solid",
      borderRadius: 16,
      padding: theme.spacing(2, 2),
    },
  }));

  const classes = useStyles();
  const [currentUser] = useState(firebase.auth().currentUser);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(undefined);
  let wishList = null;
  let favorites = null;

  const getToken = async () => {
    try {
      const user = firebase.auth().currentUser;
      return await user.getIdToken();
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        console.log(token);
        setLoading(true);
        let url = `http://localhost:4200/users/${currentUser.uid}`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (e) {
        setError(e.messages);
        console.log(error);
      }
    })();
  }, [currentUser, error]);

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

  if (userData && userData.wishMovies.length > 1) {
    wishList = userData.wishList.map((item) => {
      return buildWishListItem(item);
    });
  }

  if (userData && userData.likedMovies.length > 1) {
    favorites = userData.favorites.map((item) => {
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
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Avatar
          alt="Profile"
          src={currentUser.photoURL}
          className={classes.large}
        />
        <div className={classes.border}>
          <p>Name: {currentUser.displayName}</p>
          <p>Email: {currentUser.email}</p>
        </div>
        <EditFormModal
          name={currentUser.displayName}
          email={currentUser.email}
        />
      </Grid>
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
