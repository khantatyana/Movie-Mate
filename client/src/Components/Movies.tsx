import { LinearProgress, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Pager, SearchResult } from "../models";
import { moviesService } from "../movies.service";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import Pagination from "@material-ui/lab/Pagination";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

let timer = null;

export const Movies = (props) => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [pager, setPager] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await moviesService.getGenres();
      setGenres(response);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(location.search);
      const page = +params.get("page") || 1;
      const q = params.get("q");
      const genre = params.get("genre");
      const input = document.querySelector("input");
      input.value = q;

      const searchParams = { page, maxDaysAgo: 180 };

      if (q || genre) {
        delete searchParams["maxDaysAgo"];

        if (q) searchParams["q"] = q;
        if (genre) searchParams["genre"] = genre;
      }

      setLoading(true);
      const response = await moviesService.explore(searchParams);
      setLoading(false);
      setPager(response.pager);
      setResults(response.searchResults);
    })();
  }, [location.search]);

  const search = (e) => {
    if (timer) {
      window.clearTimeout(timer);
    }

    timer = setTimeout(() => {
      const q = e.target.value;

      const params = new URLSearchParams(location.search);

      if (!q) {
        params.delete("q");
      } else {
        params.set("q", q);
        params.set("page", "1");
      }

      props.history.replace(`/movies?${params}`);
    }, 500);
  };

  const changePage = (_: any, page: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    props.history.replace(`/movies?${params}`);
  };

  const selectGenre = (e) => {
    const params = new URLSearchParams(location.search);
    params.set("genre", e.target.textContent.toLowerCase());
    props.history.replace(`/movies?${params}`);
  };

  const deselectGenre = (e) => {
    const params = new URLSearchParams(location.search);
    params.delete("genre");
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

      <div className="chips">
        <Button variant="contained" color="primary" onClick={deselectGenre}>
          Clear Genre
        </Button>
        {genres.map((genre) => {
          return <Chip key={genre} label={genre} onClick={selectGenre} />;
        })}
      </div>

      <TextField
        id="input-field"
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
              <img
                src={
                  result.movie.posterPath
                    ? "https://image.tmdb.org/t/p/w500/" +
                      result.movie.posterPath
                    : "/no-poster.jpg"
                }
                alt={result.movie.title}
              />
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
