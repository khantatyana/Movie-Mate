import { LinearProgress } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { moviesService } from "../movies.service";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import { Movie } from "../models";

const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      (savedCallback as any).current();
    }
    if (delay !== null) {
      callback(); // Call the function right away
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const Recommendations = () => {
  const [status, setStatus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useInterval(() => {
    (async () => {
      if (status === "READY" || status === "NO_FAVS") return;
      setStatus(null);
      const response = await moviesService.getRecommendations();
      setStatus(response.status);
      setRecommendations(response.recommendations || []);
    })();
  }, 5000);

  return (
    <div>
      {status === "NO_FAVS" ? (
        <p>
          You didn't like any movies, please like some movies to provide
          recommendations.
        </p>
      ) : (
        <div>
          {!status || status === "COMPUTING" ? (
            <div>
              <LinearProgress color="secondary" />
              <p>Generating recommendations...</p>
            </div>
          ) : (
            <div className="progress-placeholder"></div>
          )}

          <ImageList rowHeight={400} cols={6}>
            {recommendations.map((result: Movie) => (
              <ImageListItem key={result.movieId}>
                <Link to={"movies/" + result.movieId}>
                  <img
                    src={
                      result.posterPath
                        ? "https://image.tmdb.org/t/p/w500/" + result.posterPath
                        : "/no-poster.jpg"
                    }
                    alt={result.title}
                  />
                  <ImageListItemBar
                    title={result.title}
                    subtitle={<span>{result.releaseYear}</span>}
                  />
                </Link>
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
