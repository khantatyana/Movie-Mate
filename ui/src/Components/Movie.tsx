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
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 800,
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
        <Grid container spacing={5}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img
                className={movieData.title}
                alt="No picture"
                src={movieData.posterPath}
              />
            </ButtonBase>
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
                <Typography gutterBottom variant="subtitle1">
                  {movieData.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {movieData.plotSummary}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ID: 1030114
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: "pointer" }}>
                  Remove
                </Typography>
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
