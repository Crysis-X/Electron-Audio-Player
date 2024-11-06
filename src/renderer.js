import Controller from "./parts/Controller/Controller";
import Playlists from "./parts/Playlists/Playlists";
import "./index.css";

document.body.innerHTML = "";
document.body.append(Controller());
Playlists().then((element) => document.body.append(element));
