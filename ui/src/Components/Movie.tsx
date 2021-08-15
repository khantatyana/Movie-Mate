import React, { useState, useEffect } from "react";
import { moviesService } from "../movies.service";
import StarRatings from "react-star-ratings";

import {
  Grid,
  makeStyles,
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
  ClickedButton: {
    background: "#00cc00",
  },
}));

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

export const Movie = (props) => {
  const [movieData, setMovieData] = useState(undefined);
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);
  const [dislikeButtonClicked, setDislikeButtonClicked] = useState(false);
  const [wishButtonClicked, setwishButtonClicked] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  let btnClass = classes.NonClickedButton;

  const handleChangedComment = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    console.log("button changed");
    btnClass =
      likeButtonClicked === false
        ? classes.NonClickedButton
        : classes.ClickedButton;
    console.log(btnClass);
  }, [likeButtonClicked]);

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
        console.log(movieData);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [props.match.params.movieId]);

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
              {likeButtonClicked == true ? (
                <Button
                  className={btnClass}
                  onClick={() => {
                    addToLike(movieData.movieDetails.movieId);
                    setLikeButtonClicked(true);
                  }}
                >
                  Undo Like
                </Button>
              ) : (
                <Button
                  className={btnClass}
                  onClick={() => {
                    deleteFromLike(movieData.movieDetails.movieId);
                    setLikeButtonClicked(false);
                  }}
                >
                  Like
                </Button>
              )}
              {wishButtonClicked == true ? (
                <Button
                  className={btnClass}
                  onClick={() => {
                    addToWishlist(movieData.movieDetails.movieId);
                    setwishButtonClicked(true);
                  }}
                >
                  Remove to Wishlist
                </Button>
              ) : (
                <Button
                  className={btnClass}
                  onClick={() => {
                    deleteFromWish(movieData.movieDetails.movieId);
                    setwishButtonClicked(false);
                  }}
                >
                  Add from Wishlist
                </Button>
              )}
              {dislikeButtonClicked == true ? (
                <Button
                  className={btnClass}
                  onClick={() => {
                    addToDislike(movieData.movieDetails.movieId);
                    setDislikeButtonClicked(true);
                  }}
                >
                  Undo Dislike
                </Button>
              ) : (
                <Button
                  className={btnClass}
                  onClick={() => {
                    deleteFromDislike(movieData.movieDetails.movieId);
                    setDislikeButtonClicked(false);
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
                      movieData.movieDetails.movie.genres.map(function (genre) {
                        return <Button>{genre}</Button>;
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
                            director
                          ) {
                            return <p>{director}</p>;
                          })}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                <br></br>
                <h3>Comments:</h3>
                <br></br>
                {movieData.comments.length > 0 ? (
                  movieData.comments.map(function (comment) {
                    return (
                      <div>
                        <Paper className={classes.paper}>
                          {comment.comment}
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
                      alert("Comment Added");
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
