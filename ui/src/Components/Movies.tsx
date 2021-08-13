import { LinearProgress, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Pager, SearchResult } from "../models";
import { moviesService } from "../movies.service";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import Pagination from "@material-ui/lab/Pagination";

let timer = null;

export const Movies = (props) => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [pager, setPager] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(location.search);
      const page = +params.get("page");
      const q = params.get("q");
      const input = document.querySelector("input");
      input.value = q;

      setLoading(true);

      if (page && q) {
        const response = await moviesService.explore(page, q);
        setLoading(false);
        setPager(response.pager);
        setResults(response.searchResults);
      } else {
        console.log("started request");
        //do this since it needs to have the parameters
        const response = await moviesService.explore(1, "g");
        console.log(response);
        setLoading(false);
        setPager(response.pager);
        setResults(response.searchResults);
      }
    })();
  }, [location.search]);

  const search = (e) => {
    if (timer) {
      window.clearTimeout(timer);
    }

    timer = setTimeout(() => {
      const q = e.target.value;

      if (!q) {
        props.history.replace("movies");
      } else {
        props.history.replace(
          `/movies?${new URLSearchParams({ page: "1", q })}`
        );
      }
    }, 500);
  };

  const changePage = (_: any, page: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    props.history.replace(`/movies?${params}`);
  };

  return (
    <div>
      <div>
        {loading ? (
          <LinearProgress color="secondary" />
        ) : (
          <div className="progress-placeholder"></div>
        )}
      </div>

      <TextField
        label="Search Movies"
        variant="outlined"
        onChange={search}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {pager && results.length ? (
        <Pagination
          page={(pager as Pager)?.currentPage}
          count={(pager as Pager)?.totalPages}
          onChange={changePage}
        />
      ) : null}

      <div>
        {!loading && !results.length && location.search ? (
          <p>No Results</p>
        ) : null}
      </div>

      <ImageList rowHeight={400} cols={6}>
        {results.map((result: SearchResult) => (
          <ImageListItem key={result.movieId}>
            <Link to={"movies/" + result.movieId}>
              {result.movie.posterPath ? (
                <img
                  src={
                    "https://image.tmdb.org/t/p/w500/" + result.movie.posterPath
                  }
                  alt={result.movie.title}
                />
              ) : (
                <p className="no-image-available">No image available</p>
              )}

              <ImageListItemBar
                title={result.movie.title}
                subtitle={<span>{result.movie.releaseYear}</span>}
              />
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
      <br></br>
      {pager && results.length ? (
        <Pagination
          page={(pager as Pager)?.currentPage}
          count={(pager as Pager)?.totalPages}
          onChange={changePage}
        />
      ) : null}
    </div>
  );
};
