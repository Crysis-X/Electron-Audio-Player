export default class Playlist {
  tracks;
  name;
  id;
  constructor(tracks, name, id = Date.now()) {
    this.tracks = tracks;
    this.name = name;
    this.id = id;
  }
  add = (track) => this.tracks.push(track);
  remove = (id) => {
    this.tracks = this.tracks.filter((track) => track.id !== id && track);
  };
  getTrackById = (id) => {
    for (let i = 0; i < this.tracks.length; i++) {
      if (id === this.tracks[i]) return this.tracks[i];
    }
    return false;
  };
}
