import TrackComponent from "../../components/TrackComponent/TrackComponent";
import Button from "../../components/Button/Button";

export default async function Playlists() {
  const element = document.createElement("div");
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "button-wrapper";
  const tracksWrapper = document.createElement("div");
  tracksWrapper.className = "tracks-wrapper";
  const playlists = await window.main.audio.getPlaylists();
  const buttons = [];
  for (let playlist of playlists) {
    buttons.push({
      playlist: playlist.id,
      button: new Button(playlist.name, {}),
    });
  }
  buttons.forEach((buttonData) => {
    buttonData.button.element.onclick = async (event) => {
      tracksWrapper.innerHTML = "";
      document
        .querySelectorAll(".current-playlist")
        .forEach((elem) => elem.className.replace("current-playlist", ""));
      event.currentTarget.className += " current-playlist";
      await window.main.audio.setCurrentPlaylist(buttonData.playlist);
      const tracks = await window.main.audio.getTracks(buttonData.playlist);
      if (tracks) {
        tracks.forEach((trackData) => {
          Howler.unload();
          const track = new TrackComponent(trackData);
          tracksWrapper.append(track.element);
          track.element.onclick = (event) => {
            document
        .querySelectorAll(".current-track")
        .forEach((elem) => elem.className.replace("current-track", ""));
      event.currentTarget.className += " current-track";
            window.main.audio.setCurrentTrack(track.id);
          };
        });
      }
    };
    buttonWrapper.append(buttonData.button.element);
  });
  element.append(buttonWrapper);
  element.append(tracksWrapper);
  buttons[0].button.element.click();
  return element;
}
