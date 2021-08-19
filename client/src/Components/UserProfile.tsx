import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { moviesService } from "../movies.service";
import firebase from "firebase/app";
import EditFormModal from "./EditFormModal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import {
  makeStyles,
  ImageListItem,
  ImageList,
  ImageListItemBar,
  Avatar,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
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
    margin: 30,
    paddingTop: 30,
  },
  name: {
    fontSize: 24,
  },
  pos: {
    marginBottom: 12,
  },
  title: {
    color: "white",
  },
}));

export const UserProfile = (props) => {
  const classes = useStyles();
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [currentUser] = React.useState(firebase.auth().currentUser);
  let wishList = null;
  let favorites = null;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await moviesService.getUserById(currentUser.uid);
        setUserData(response);
        setLoading(false);
      } catch (e) {
        setError(e.messages);
      }
    }
    fetchData();
  }, [currentUser]);

  const handleDelete = async (id) => {
    let isWish = userData.wishMovies.filter((e) => e._id === id).length > 0;
    try {
      if (isWish) {
        const response = await moviesService.deleteWishlist(id);
        console.log(response);
      } else {
        const response = await moviesService.deleteLike(id);
        console.log(response);
      }
    } catch (e) {
      console.log(e.messages);
    }
  };

  const history = () => {
    props.history.push("/profile");
  };

  const buildListItem = (result) => {
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
            title={result.title}
            subtitle={<span>{result.year}</span>}
            actionIcon={
              <IconButton
                onClick={async (e) => {
                  e.preventDefault();
                  await handleDelete(result._id);
                }}
              >
                <HighlightOffIcon color="primary" className={classes.title} />
              </IconButton>
            }
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
            <Card className={classes.card}>
              <Avatar
                alt="Profile"
                src={currentUser.photoURL}
                className={classes.large}
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {currentUser.displayName}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  {currentUser.email}
                </Typography>
              </CardContent>
            </Card>
            <EditFormModal
              currentUser={currentUser}
              history={() => {
                history();
              }}
            />
          </div>
          <h2> My Favorites </h2>
          <div className={classes.root}>
            <ImageList className={classes.imageList} rowHeight={350} cols={4.5}>
              {favorites}
            </ImageList>
          </div>
          <TrendingFlatIcon />
          <h2> My Wish List </h2>
          <div className={classes.root}>
            <ImageList className={classes.imageList} rowHeight={350} cols={4.5}>
              {wishList}
            </ImageList>
          </div>
          <TrendingFlatIcon />
        </div>
      );
    }
  }
};
