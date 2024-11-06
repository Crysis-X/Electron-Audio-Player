import fs from "fs";
import path from "path";
import Playlist from "../Playlist/Playlist";
import Track from "../Track/Track";

export default class Reader {
  dirname;
  playlists = [];
  constructor(dirname) {
    this.dirname = dirname;
    const playlistsDir = path.join(this.dirname, "data");
    if (fs.existsSync(playlistsDir)) {
      fs.readdirSync(playlistsDir).forEach((file) => {
        if (!file.includes(".json")) return;
        const playlist = path.basename(file, ".json");
        const paths = JSON.parse(
          fs.readFileSync(path.join(playlistsDir, file)).toString(),
        );
        const tracks = [];
        paths.forEach((src) => {
          const track = new Track(src);
          if (track.status != "NOTEXIST") tracks.push();
        });
        this.playlists.push(new Playlist(tracks, playlist));
      });
    }
  }
}
