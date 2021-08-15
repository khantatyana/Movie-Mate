import axios from "axios";
import firebase from "firebase/app";
import { ExploreResponse } from "./models";

const BASE_URL = "http://localhost:4200";

class MoviesService {
  async explore(params: {
    page: number;
    q?: string;
    maxDaysAgo?: number;
    genre?: string;
  }): Promise<ExploreResponse> {
    const token = await this.getToken();

    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.q) searchParams.set("q", params.q);
    if (params.maxDaysAgo)
      searchParams.set("maxDaysAgo", params.maxDaysAgo.toString());
    if (params.genre) searchParams.set("genre", params.genre);

    const response = await axios.get(
      `${BASE_URL}/movies/explore?${searchParams}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getGenres(): Promise<string[]> {
    const token = await this.getToken();

    const response = await axios.get(`${BASE_URL}/movies/genres`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  private async getToken(): Promise<string> {
    try {
      const user = firebase.auth().currentUser;
      return await user.getIdToken();
    } catch (e) {
      return null;
    }
  }

  async getMovieByID(id: number) {
    const token = await this.getToken();
    const response = await axios.get(`${BASE_URL}/movies/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  async addComment(id: number, Enteredcomment: String) {
    const token = await this.getToken();
    const response = await axios.post(`${BASE_URL}/movies/${id}/comments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      comment: Enteredcomment,
    });
    return response.data;
  }
}

export const moviesService = new MoviesService();
