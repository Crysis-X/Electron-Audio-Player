import "./TrackComponent.css";

export default class TrackComponent {
  element;
  id;
  src;
  name;
  constructor(trackData) {
    this.id = trackData.id;
    this.src = trackData.src;
    this.name = trackData.name;
    this.element = document.createElement("button");
    this.element.innerHTML = this.name;
    this.element.className = "track";
  }
}
