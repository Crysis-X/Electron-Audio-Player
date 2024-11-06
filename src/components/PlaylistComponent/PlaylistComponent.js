import "./PlaylistComponent.css";

export default class PlaylistComponent {
  element;
  tracks;
  constructor(tracks) {
    this.element = document.createElement("div");
    this.element.className = "playlist";
    this.tracks = tracks;
    this.tracks.forEach((track) => {
      this.element.append(track.element);
    });
  }
}
