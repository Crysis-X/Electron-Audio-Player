import { Howl, Howler } from "howler";
import Button from "../../components/Button/Button";
import playImage from "../../assets/play.png";
import pauseImage from "../../assets/pause.png";
import nextImage from "../../assets/next.png";
import prevImage from "../../assets/prev.png";
import addImage from "../../assets/add.png";
import "./Controller.css";

export default function Controller() {
  const controller = document.createElement("div");
  controller.className = "controller";

  const play = new Button("", {}, "control-btn");
  play.element.style.background = `url(${playImage}) 0 0/ 100% 100% no-repeat`;
  const prev = new Button("", {}, "control-btn");
  prev.element.style.background = `url(${prevImage}) 0 0/ 100% 100% no-repeat`;
  const next = new Button("", {}, "control-btn");
  next.element.style.background = `url(${nextImage}) 0 0/ 100% 100% no-repeat`;
  const add = new Button("", {}, "control-btn");
  add.element.style.background = `url(${addImage}) 0 0/ 100% 100% no-repeat`;
  const stop = new Button("", {}, "control-btn");
  stop.element.style.background = `url(${pauseImage}) 0 0/ 100% 100% no-repeat`;

  controller.append(play.element);
  controller.append(stop.element);
  controller.append(prev.element);
  controller.append(next.element);
  controller.append(add.element);

  play.element.onclick = async () => {
    const filename = await window.main.audio.load();
    new Howl({ src: filename, html5: true }).play();
  };
  prev.element.onclick = () => {
    window.main.audio.prev();
  };
  next.element.onclick = () => {
    window.main.audio.next();
  };
  add.element.onclick = () => {
    window.main.audio.add().then(() => location.reload());
  };
  stop.element.onclick = () => {
    Howler.stop();
  };
  return controller;
}
