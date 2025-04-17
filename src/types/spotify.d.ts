interface Image {
  url: string;
  height: number;
  width: number;
}

interface Episode {
  name: string;
  release_date: string;
  uri: string;
  audio_preview_url: string;
  images: Image[];
}

interface EpisodesResponse {
  items: Episode[];
}

interface EpisodeById {
  id: string;
  name: string;
  releaseDate: string;
  imageUrl: string;
  audioPreviewUrl: string;
}

export { EpisodeById, EpisodesResponse };
