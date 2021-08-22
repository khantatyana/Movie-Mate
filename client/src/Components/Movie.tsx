import React, { useState, useEffect } from "react";
import { moviesService } from "../movies.service";
import StarRatings from "react-star-ratings";
import DeleteIcon from "@material-ui/icons/Delete";
import firebase from "firebase/app";

import {
  Grid,
  makeStyles,
  Avatar,
  Typography,
  Paper,
  ButtonGroup,
  Button,
  ImageListItem,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "auto",
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  NonClickedButton: {
    background: "#ffffff",
  },
  ClickedLikeButton: {
    background: "#00cc00",
  },
  ClickedDislikeButton: {
    background: "#ff0000",
  },
  ClickedWishButton: {
    background: "#ffd000",
  },
}));
async function deleteComment(movieId, commentId) {
  console.log(await moviesService.deleteComment(movieId, commentId));
}
async function addToLike(id) {
  await moviesService.addLike(id);
}
async function deleteFromLike(id) {
  await moviesService.deleteLike(id);
}
async function addToDislike(id) {
  await moviesService.addDislike(id);
}
async function deleteFromDislike(id) {
  await moviesService.deleteDislike(id);
}
async function addToWishlist(id) {
  await moviesService.addToWishlist(id);
}
async function deleteFromWish(id) {
  await moviesService.deleteWishlist(id);
}

function timeDifference(previous) {
  let current = Date.now();

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - Date.parse(previous.valueOf());

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "approximately " + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "approximately " + Math.round(elapsed / msPerYear) + " years ago";
  }
}

export const Movie = (props) => {
  const [movieData, setMovieData] = useState(undefined);
  const [currentUser] = React.useState(firebase.auth().currentUser);
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);
  const [dislikeButtonClicked, setDislikeButtonClicked] = useState(false);
  const [wishButtonClicked, setwishButtonClicked] = useState(false);
  const [commentAdded, setCommentAdded] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  let btnClass = classes.NonClickedButton;

  const handleChangedComment = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    btnClass =
      likeButtonClicked === false
        ? classes.NonClickedButton
        : classes.ClickedLikeButton;
  }, [likeButtonClicked]);

  useEffect(() => {
    btnClass =
      dislikeButtonClicked === false
        ? classes.NonClickedButton
        : classes.ClickedDislikeButton;
  }, [dislikeButtonClicked]);

  useEffect(() => {
    btnClass =
      wishButtonClicked === false
        ? classes.NonClickedButton
        : classes.ClickedWishButton;
  }, [wishButtonClicked]);

  useEffect(() => {
    console.log("useEffect fired");
    async function fetchData() {
      try {
        //grab the id of the show and then display all of its information
        const response = await moviesService.getMovieByID(
          props.match.params.movieId
        );
        console.log(response);
        setMovieData(response);
        setLoading(false);
        setCommentAdded(false);
        setLikeButtonClicked(response.userLiked);
        setDislikeButtonClicked(response.userDisliked);
        setwishButtonClicked(response.userWish);
        console.log(likeButtonClicked);
        console.log(dislikeButtonClicked);
        console.log(wishButtonClicked);
        console.log(movieData);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [props.match.params.movieId, commentAdded]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <br></br>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item>
            <ImageListItem key={movieData.movieDetails.movie.movieId}>
              {movieData.movieDetails.movie.posterPath ? (
                <img
                  src={
                    "https://image.tmdb.org/t/p/w500/" +
                    movieData.movieDetails.movie.posterPath
                  }
                  alt={movieData.movieDetails.movie.title}
                />
              ) : (
                <p className="no-image-available">No image available</p>
              )}
            </ImageListItem>
            <br></br>
            <ButtonGroup>
              {likeButtonClicked === true ? (
                <Button
                  className={classes.ClickedLikeButton}
                  onClick={() => {
                    deleteFromLike(movieData.movieDetails.movieId);
                    setLikeButtonClicked(false);
                  }}
                >
                  Undo Like
                </Button>
              ) : (
                <Button
                  className={btnClass}
                  onClick={() => {
                    addToLike(movieData.movieDetails.movieId);
                    //check if they previously disliked the movie
                    if (dislikeButtonClicked) {
                      deleteFromDislike(movieData.movieDetails.movieId);
                      setDislikeButtonClicked(false);
                    }
                    if (wishButtonClicked) {
                      deleteFromWish(movieData.movieDetails.movieId);
                      setwishButtonClicked(false);
                    }
                    setLikeButtonClicked(true);
                  }}
                >
                  Like
                </Button>
              )}
              {wishButtonClicked === true ? (
                <Button
                  className={classes.ClickedWishButton}
                  onClick={() => {
                    deleteFromWish(movieData.movieDetails.movieId);
                    setwishButtonClicked(false);
                  }}
                >
                  Remove from Wishlist
                </Button>
              ) : (
                <Button
                  className={btnClass}
                  onClick={() => {
                    addToWishlist(movieData.movieDetails.movieId);
                    setwishButtonClicked(true);
                    if (dislikeButtonClicked) {
                      deleteFromDislike(movieData.movieDetails.movieId);
                      setDislikeButtonClicked(false);
                    }
                    if (likeButtonClicked) {
                      deleteFromLike(movieData.movieDetails.movieId);
                      setLikeButtonClicked(false);
                    }
                  }}
                >
                  Add to Wishlist
                </Button>
              )}
              {dislikeButtonClicked === true ? (
                <Button
                  className={classes.ClickedDislikeButton}
                  onClick={() => {
                    deleteFromDislike(movieData.movieDetails.movieId);
                    setDislikeButtonClicked(false);
                  }}
                >
                  Undo Dislike
                </Button>
              ) : (
                <Button
                  className={btnClass}
                  onClick={() => {
                    addToDislike(movieData.movieDetails.movieId);
                    if (likeButtonClicked) {
                      deleteFromLike(movieData.movieDetails.movieId);
                      setLikeButtonClicked(false);
                    }
                    if (wishButtonClicked) {
                      deleteFromWish(movieData.movieDetails.movieId);
                      setwishButtonClicked(false);
                    }
                    setDislikeButtonClicked(true);
                  }}
                >
                  Dislike
                </Button>
              )}
            </ButtonGroup>
          </Grid>
          <br></br>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h2">
                  {movieData.movieDetails.movie.title}
                </Typography>
                <StarRatings
                  rating={movieData.movieDetails.movie.avgRating}
                  starRatedColor="yellow"
                  numberOfStars={5}
                  name="rating"
                />
                <br></br>
                <Typography variant="body2" color="textSecondary">
                  Average Rating: {movieData.movieDetails.movie.avgRating}
                </Typography>
                <br></br>
                {movieData.movieDetails.movie.genres && (
                  <ButtonGroup>
                    {movieData.movieDetails.movie.genres &&
                      movieData.movieDetails.movie.genres.map(function (
                        genre,
                        index
                      ) {
                        return <Button key={index}>{genre}</Button>;
                      })}
                  </ButtonGroup>
                )}
                <br></br>
                <br></br>
                <Typography variant="body2" gutterBottom>
                  {movieData.movieDetails.movie.plotSummary}
                </Typography>
                <br></br>
                <Typography variant="body2" color="textSecondary">
                  Year Released: {movieData.movieDetails.movie.releaseYear}
                </Typography>
                {movieData.movieDetails.movie.directors && (
                  <Grid
                    item
                    xs
                    container
                    direction="row"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs>
                      Directors:
                    </Grid>
                    <Grid item xs>
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="textSecondary"
                      >
                        {movieData.movieDetails.movie.directors &&
                          movieData.movieDetails.movie.directors.map(function (
                            director,
                            index
                          ) {
                            return <p key={index}>{director}</p>;
                          })}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                <br></br>
                <h3>Comments:</h3>
                <br></br>
                {movieData.comments.length > 0 ? (
                  movieData.comments.map(function (comment, index) {
                    return (
                      <div>
                        <Paper style={{ padding: "40px 20px", marginTop: 10 }}>
                          <Grid container wrap="nowrap" spacing={2}>
                            <Grid item xs zeroMinWidth>
                              <h4 style={{ margin: 0, textAlign: "left" }}>
                                {comment.userName}
                              </h4>
                              <p style={{ textAlign: "left" }}>
                                {comment.comment}
                              </p>
                              <p style={{ textAlign: "left", color: "gray" }}>
                                Posted {timeDifference(comment.createDate)}
                              </p>
                            </Grid>
                            {comment.userId === currentUser.uid ? (
                              <Grid
                                item
                                xs
                                container
                                direction="column"
                                alignItems="flex-end"
                                justify="flex-start"
                              >
                                <Button
                                  onClick={() => {
                                    deleteComment(
                                      movieData.movieDetails.movieId,
                                      comment._id
                                    );
                                    setCommentAdded(true);
                                  }}
                                >
                                  <DeleteIcon></DeleteIcon>
                                </Button>
                              </Grid>
                            ) : null}
                          </Grid>
                        </Paper>
                        <br></br>
                      </div>
                    );
                  })
                ) : (
                  <p>No comments</p>
                )}
                <br></br>
                <h3>Add a comment:</h3>
                <Paper className={classes.paper}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      moviesService.addComment(
                        props.match.params.movieId,
                        comment
                      );
                      setCommentAdded(true);
                    }}
                  >
                    <label>
                      <input
                        type="text"
                        name="comment"
                        onChange={handleChangedComment}
                        value={comment}
                      ></input>
                    </label>
                    <input type="submit" value="Submit"></input>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
