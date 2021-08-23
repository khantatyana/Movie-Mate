import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { moviesService } from "../movies.service";
import firebase from "firebase/app";
import EditFormModal from "./EditFormModal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Pagination from "@material-ui/lab/Pagination";
import {
  makeStyles,
  ImageList,
  ImageListItem,
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
  const [error, setError] = React.useState(undefined);
  const [currentWishPage, setCurrentWishPage] = React.useState(1);
  const [currentLikePage, setCurrentLikePage] = React.useState(1);
  const [itemsPerPage] = React.useState(6);
  const [currentUser] = React.useState(firebase.auth().currentUser);
  const [loading, setLoading] = React.useState(true);
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
        setUserData(response);
      } else {
        const response = await moviesService.deleteLike(id);
        setUserData(response);
      }
    } catch (e) {
      setError(e.messages);
      console.log(e.messages);
    }
  };

  const changeWishPage = (event, value) => {
    setCurrentWishPage(value);
  };
  const changeLikePage = (event, value) => {
    setCurrentLikePage(value);
  };

  const updateUser = (userData) => {
    setUserData(userData);
    console.log(userData);
  };

  const buildListItem = (result) => {
    return (
      <ImageListItem key={result._id}>
        <Link to={"movies/" + result._id}>
          <img
            src={
              result.posterUrl
                ? "https://image.tmdb.org/t/p/w500/" + result.posterUrl
                : "/no-poster.jpg"
            }
            alt={result.title}
          />
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
      userData.wishMovies
        .slice(
          (currentWishPage - 1) * itemsPerPage,
          currentWishPage * itemsPerPage
        )
        .map((item) => {
          return buildListItem(item);
        });
  }

  if (userData) {
    favorites =
      userData &&
      userData.likedMovies
        .slice(
          (currentLikePage - 1) * itemsPerPage,
          currentLikePage * itemsPerPage
        )
        .map((item) => {
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
                src={
                  window.location.origin +
                  `/client/public/UserProfileImgs${userData.photoUrl}`
                }
                className={classes.large}
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {userData.name}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  {userData.email}
                </Typography>
              </CardContent>
            </Card>
            <EditFormModal
              currentUser={userData}
              updateUser={(userData) => {
                updateUser(userData);
              }}
            />
          </div>
          <h2> My Favorites </h2>
          <div>
            <ImageList rowHeight={400} cols={6}>
              {favorites}
            </ImageList>
            <Pagination
              id="likePager"
              page={currentLikePage}
              count={Math.ceil(userData.likedMovies.length / 6)}
              onChange={changeLikePage}
            />
          </div>
          <h2> My Wish List </h2>
          <div>
            <ImageList rowHeight={400} cols={6}>
              {wishList}
            </ImageList>
            <Pagination
              id="wishPager"
              page={currentWishPage}
              count={Math.ceil(userData.wishMovies.length / 6)}
              onChange={changeWishPage}
            />
          </div>
        </div>
      );
    }
  }
};
