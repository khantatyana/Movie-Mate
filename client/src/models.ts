export interface ExploreResponse {
  pager: Pager;
  searchResults: SearchResult[];
}

export interface Pager {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface SearchResult {
  movieId: number;
  movie: Movie;
  movieUserData: MovieUserData;
}

export interface Movie {
  actors: string[];
  avgRating: number;
  backdropPaths: string[];
  directors: string[];
  dvdReleaseDate: string;
  genres: string[];
  imdbMovieId: string;
  languages: string[];
  movieId: number;
  mpaa: string;
  numRatings: number;
  originalTitle: string;
  plotSummary: string;
  posterPath: string;
  releaseDate: string;
  releaseYear: string;
  runtime: number;
  title: string;
}

// todo - see if we actually need this
export interface MovieUserData {}

export interface RecommendationsResponse {
  status: "COMPUTING" | "READY";
  recommendations: RecommendedMovie[];
}

export interface RecommendedMovie {
  posterUrl: string;
  title: string;
  year: number;
  _id: number;
}
