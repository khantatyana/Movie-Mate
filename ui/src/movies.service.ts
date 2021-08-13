import axios from "axios";
import firebase from "firebase/app";
import { ExploreResponse } from "./models";

const BASE_URL = "http://localhost:4200";

class MoviesService {
  async explore(page: number, q: string): Promise<ExploreResponse> {
    const token = await this.getToken();
    const searchParams = new URLSearchParams({ page: page.toString(), q: q });
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
}

export const moviesService = new MoviesService();
