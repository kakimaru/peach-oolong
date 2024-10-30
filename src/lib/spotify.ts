import axios from "axios";

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Item {
  name: string;
  release_date: string;
  uri: string;
  audio_preview_url: string;
  images: Image[];
}

interface ShowResponse {
  items: Item[];
}

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
    const data = await this.fetchData<ShowResponse>(
      `https://api.spotify.com/v1/shows/66f9D0KcRpmJp1kG9lpB13/episodes?limit=3`
    );
    return data.items.map(
      ({ name, release_date, uri, images, audio_preview_url }) => ({
        name,
        release_date,
        uri,
        imageUrl: images[0]?.url,
        audioPreview: audio_preview_url,
      })
    );
  }
}

const spotify = await SpotifyClient.initialize();
export default spotify;
