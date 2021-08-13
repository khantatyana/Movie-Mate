import React, { useState, useEffect } from "react";
import { moviesService } from "../movies.service";

import {
  Grid,
  ButtonBase,
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
}));

export const Movie = (props) => {
  const [movieData, setMovieData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  useEffect(() => {
    console.log("useEffect fired");
    async function fetchData() {
      try {
        //grab the id of the show and then display all of its information
        const response = await moviesService.getMovieByID(
          props.match.params.movieId
        );
        setMovieData(response.movieDetails.movie);
        setLoading(false);
        console.log(movieData);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [props.match.params.id]);

  //grab the movie title,

  //grab the movie description, year released, etc.

  //like button
  //dislike button
  //add to wishlist button

  //show comments
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <br></br>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item>
            <ImageListItem key={movieData.movieId}>
              {movieData.posterPath ? (
                <img
                  src={
                    "https://image.tmdb.org/t/p/w500/" + movieData.posterPath
                  }
                  alt={movieData.title}
                />
              ) : (
                <p className="no-image-available">No image available</p>
              )}
            </ImageListItem>
            <br></br>
            <Grid item xs={12} sm container>
              <ButtonGroup>
                <Button id="likeButton">Like</Button>
                <Button id="wishlistButton">Add to Wishlist</Button>
                <Button id="dislikeButton">Dislike</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <br></br>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h2">
                  {movieData.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {movieData.plotSummary}
                </Typography>
                <br></br>
                <Typography variant="body2" color="textSecondary">
                  Average Rating: {movieData.avgRating}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Year Released: {movieData.releaseYear}
                </Typography>
                {movieData.directors && (
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
                        {movieData.directors &&
                          movieData.directors.map(function (director) {
                            return <p>{director}</p>;
                          })}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                <br></br>
                {movieData.genres && (
                  <ButtonGroup>
                    {movieData.genres &&
                      movieData.genres.map(function (genre) {
                        return <Button>{genre}</Button>;
                      })}
                  </ButtonGroup>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">$19.00</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
