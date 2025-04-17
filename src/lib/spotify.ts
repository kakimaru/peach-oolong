import axios from "axios";
import type { EpisodeById, EpisodesResponse } from "../types/spotify";

class SpotifyClient {
  private token: string | null = null;

  static async initialize() {
    const { data } = await axios.post(
      `https://accounts.spotify.com/api/token`,
      {
        grant_type: "client_credentials",
        client_id: import.meta.env.CLIENT_ID,
        client_secret: import.meta.env.CLIENT_SECRET,
      },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    let spotify = new SpotifyClient();
    spotify.token = data.access_token;
    return spotify;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await axios.get<T>(url, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return response.data;
  }

  async getEpisodes() {
    const data = await this.fetchData<EpisodesResponse>(
      `https://api.spotify.com/v1/shows/66f9D0KcRpmJp1kG9lpB13/episodes?limit=3`
    );

    return data.items
      .filter((item) => item !== null)
      .map(({ name, release_date, uri, images, audio_preview_url }) => ({
        name,
        release_date,
        uri,
        imageUrl: images[0]?.url,
        audioPreview: audio_preview_url,
      }));
  }

  async getEpisodeById(id: string): Promise<EpisodeById> {
    const data = (await this.fetchData(
      `https://api.spotify.com/v1/episodes/${id}`
    )) as {
      id: string;
      name: string;
      audio_preview_url: string;
      images: { height: number; url: string; width: number }[];
      release_date: string;
    };

    return {
      id: data.id,
      name: data.name,
      audioPreviewUrl: data.audio_preview_url,
      imageUrl: data.images[0].url,
      releaseDate: data.release_date,
    };
  }
}

const spotify = await SpotifyClient.initialize();
export default spotify;
