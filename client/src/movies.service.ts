import axios from "axios";
import firebase from "firebase/app";
import { ExploreResponse, RecommendationsResponse } from "./models";

const BASE_URL = window.location.href.includes("localhost")
  ? "http://localhost:4200/api"
  : "https://movie-mate-cs-554.herokuapp.com/api";

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

  async getRecommendations(): Promise<RecommendationsResponse> {
    const token = await this.getToken();

    const response = await axios.get(`${BASE_URL}/users/recommendations`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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

  async getUserById(id: String) {
    const token = await this.getToken();
    const response = await axios.get(`${BASE_URL}/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  async updateUser(
    id: string,
    newName: string,
    newEmail: string,
    newPhotoURL: string
  ) {
    const token = await this.getToken();
    let url = `${BASE_URL}/users/${id}`;
    let data = {
      name: newName,
      email: newEmail,
      pictureUrl: newPhotoURL,
    };

    await axios.put(url, data, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    const user = firebase.auth().currentUser;
    await user.updateEmail(newEmail);
    await user.updateProfile({
      displayName: newName,
      photoURL: newPhotoURL,
    });
  }

  async uploadProfilePhoto(newPhoto) {
    const token = await this.getToken();
    return await axios.post(`${BASE_URL}/users/upload`, newPhoto, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
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
    console.log(token);
    const response = await axios.post(
      `${BASE_URL}/movies/${id}/comments`,
      {
        comment: Enteredcomment,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async addLike(id: number) {
    const token = await this.getToken();
    const user = firebase.auth().currentUser;
    const response = await axios.post(
      `${BASE_URL}/users/${user.uid}/likedMovies/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async deleteLike(id: number) {
    const token = await this.getToken();
    const user = firebase.auth().currentUser;
    const response = await axios.delete(
      `${BASE_URL}/users/${user.uid}/likedMovies/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async addDislike(id: number) {
    const token = await this.getToken();
    const user = firebase.auth().currentUser;
    const response = await axios.post(
      `${BASE_URL}/users/${user.uid}/dislikedMovies/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async deleteDislike(id: number) {
    const token = await this.getToken();
    const user = firebase.auth().currentUser;
    const response = await axios.delete(
      `${BASE_URL}/users/${user.uid}/dislikedMovies/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async addToWishlist(id: number) {
    const token = await this.getToken();
    const user = firebase.auth().currentUser;
    const response = await axios.post(
      `${BASE_URL}/users/${user.uid}/wishMovies/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async deleteWishlist(id: number) {
    const token = await this.getToken();
    const user = firebase.auth().currentUser;
    const response = await axios.delete(
      `${BASE_URL}/users/${user.uid}/wishMovies/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async deleteComment(movieId: number, id: number) {
    const token = await this.getToken();
    const response = await axios.delete(
      `${BASE_URL}/movies/${movieId}/comments/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const moviesService = new MoviesService();
