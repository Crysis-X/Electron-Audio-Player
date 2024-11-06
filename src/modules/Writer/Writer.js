import fs from "fs";
import path from "path";

export default class Writer {
  dirname;
  constructor(dirname) {
    this.dirname = dirname;
  }
  save = (playlists) => {
    const dataPath = path.join(this.dirname, "data");
    fs.rmSync(dataPath, { recursive: true, force: true });
    fs.mkdirSync(dataPath);
    playlists.forEach((playlist) => {
      const tracks = [];
      playlist.tracks.forEach((track) => {
        tracks.push(track.src);
      });
      fs.writeFileSync(
        path.join(dataPath, playlist.name + ".json"),
        JSON.stringify(tracks),
      );
    });
  };
}
