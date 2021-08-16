import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";

const Recommendations = (props) => {
  const useStyles = makeStyles({
    card: {
      maxWidth: 250,
      height: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: 5,
      border: "1px solid #1e8678",
      boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
    },
    titleHead: {
      borderBottom: "1px solid #1e8678",
      fontWeight: "bold",
    },
    grid: {
      flexGrow: 1,
      flexDirection: "row",
    },
    media: {
      height: "100%",
      width: "100%",
    },
    button: {
      color: "#1e8678",
      fontWeight: "bold",
      fontSize: 12,
    },
  });

  const classes = useStyles();
  //check if it is still loading in all of the movies
  const [loading, setLoading] = useState(true);
  //set the movie data
  const [MovieData, setMovieData] = useState(undefined);
  let card = null;

  useEffect(() => {
    async function fetchData() {
      try {
        //make the call to the DB or API to grab the data
        //TODO
        const url = "";
        const { data } = await axios.get(url);
        setMovieData(data.data.results);
        console.log(data.data.results);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  //method to generate a new card
  const buildCard = (movie) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={movie.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/movies/${movie.id}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={movie.image}
                title="Movie image"
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant="h6"
                  component="h2"
                >
                  {movie.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {movie.description
                    ? movie.description
                    : "No description available"}
                  <br></br>
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  //set the card variable
  if (MovieData) {
    card =
      MovieData &&
      MovieData.map((movie) => {
        return buildCard(movie);
      });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    //check that the moviedata is greater than 1
    if (MovieData === null || MovieData.length === 0) {
      return (
        <div>
          <h1>404: Page not Found</h1>
        </div>
      );
    } else {
      return (
        <div>
          <Grid container className={classes.grid} spacing={5}>
            {card}
          </Grid>
          <br />
        </div>
      );
    }
  }
};

export default Recommendations;
