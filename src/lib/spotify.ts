import axios from "axios"

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

class SpotifyClient {
  token: string | null = null;

  static async initialize() {
    const res = await axios.post(`https://accounts.spotify.com/api/token`,
      {grant_type: 'client_credentials',
        client_id: import.meta.env.PUBLIC_CLIENT_ID,
        client_secret: import.meta.env.PUBLIC_CLIENT_SECRET
      },
      {headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }}
    )

    let spotify = new SpotifyClient()
    spotify.token = res.data.access_token;
    return spotify;
  }

  async getShow(){
    const res = await axios.get(`https://api.spotify.com/v1/shows/66f9D0KcRpmJp1kG9lpB13/episodes?limit=3`, {
      headers: {Authorization: 'Bearer ' + this.token }
    })
    return res.data.items
  }

  async getEpisodes() {
    const items: Item[] = await this.getShow()
    const episodes = items.map(({ name, release_date, uri, images, audio_preview_url }) => {
      const imageUrl = images[0]?.url;
      return { name, release_date, uri, imageUrl, audioPreview: audio_preview_url };
    });
    return episodes
  }
}

const spotify = await SpotifyClient.initialize()
export default spotify;