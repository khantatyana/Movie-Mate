import React, { useState, useEffect } from "react";
import { moviesService } from "../movies.service";

export const Movie = (props) => {
  const [movieData, setMovieData] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect fired");
    async function fetchData() {
      try {
        //grab the id of the show and then display all of its information
        const response = await moviesService.getMovieByID(
          props.match.params.movieId
        );
        setMovieData(response);
        setLoading(false);
        console.log(response);
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
  return <div>Movie</div>;
};
