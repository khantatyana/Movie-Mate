import { useEffect, useState, useContext } from "react";
import firebase from "firebase/app";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import IconButton from "@material-ui/core/IconButton";

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
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
  }));

  const classes = useStyles();
  const [currentUser] = useState(firebase.auth().currentUser);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  let wishList = null;
  let favorites = null;

  useEffect(() => {
    (async () => {
      console.log(currentUser);
      // getUserById API call
      // setUserData(result)
    })();
  }, [currentUser]);

  const buildWishListItem = (item) => {
    return (
      <ImageListItem key={item.img}>
        <img src={item.img} alt={item.title} />
        <ImageListItemBar
          title={item.title}
          classes={{
            root: classes.titleBar,
            title: classes.title,
          }}
          actionIcon={
            <IconButton aria-label={`star ${item.title}`}></IconButton>
          }
        />
      </ImageListItem>
    );
  };

  const buildFavListItem = (item) => {
    return (
      <ImageListItem key={item.img}>
        <img src={item.img} alt={item.title} />
        <ImageListItemBar
          title={item.title}
          classes={{
            root: classes.titleBar,
            title: classes.title,
          }}
        />
      </ImageListItem>
    );
  };

  if (userData.wishList) {
    wishList = userData.wishList.map((item) => {
      return buildWishListItem(item);
    });
  }

  if (userData.favorites) {
    favorites = userData.favorites.map((item) => {
      return buildFavListItem(item);
    });
  }

  return (
    <div>
      <div className="profile-header">
        <img src={currentUser.photoURL} alt="" />
        <p>Name: {currentUser.displayName}</p>
        <p>Email: {currentUser.email}</p>
      </div>
      <div className={classes.root}>
        <ImageList className={classes.imageList} cols={2.5}>
          {favorites}
        </ImageList>
      </div>
      <div className={classes.root}>
        <ImageList className={classes.imageList} cols={2.5}>
          {wishList}
        </ImageList>
      </div>
    </div>
  );
};
