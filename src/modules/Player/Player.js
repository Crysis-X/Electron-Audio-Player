import Loader from "../Loader/Loader";
import Playlist from "../Playlist/Playlist";
import Reader from "../Reader/Reader";
import Track from "../Track/Track";
import Writer from "../Writer/Writer";
import fs from "fs";

export default class Player {
  playlists;
  writer;
  current;
  constructor(dirname) {
    const reader = new Reader(dirname);
    this.playlists = reader.playlists.length
      ? reader.playlists
      : [new Playlist([], "default")];
    this.writer = new Writer(dirname);
    if (this.playlists.length) {
      this.current = { playlistIndex: 0, trackIndex: 0 };
    }
  }
  save = () => {
    this.writer.save(this.playlists);
  };
  load = (src, dirname) => {
    this.clear();
    const loader = new Loader(src, dirname);
    loader.load();
    return loader.fileName;
  };
  getPlaylistById = (id) => {
    for (let i = 0; i < this.playlists.length; i++) {
      const playlist = this.playlists[i];
      if (playlist.id === id) {
        return playlist;
      }
    }
    return false;
  };
  addTrack = (src, playlistId) => {
    if (playlistId) {
      const playlist = this.getPlaylistById(playlistId);
      const track = new Track(src);
      if (track.status == "NOTEXIST") return;
      if (playlist) playlist.add(track);
    } else {
      const track = new Track(src);
      this.currentPlaylist().add(track);
    }
  };
  removeTrack = (id, playlistId) => {
    if (playlistId) {
      const playlist = this.getPlaylistById(playlistId);
      playlist.remove(id);
    }
  };
  removePlaylist = (id) => {
    this.playlists = this.playlists.filter(
      (playlist) => playlist.id !== id && playlist,
    );
  };
  addPlaylist = (playlist) => this.playlists.push(playlist);
  currentTrack = () => {
    if (!this.playlists.length) return false;
    return this.playlists[this.current.playlistIndex].tracks[
      this.current.trackIndex
    ];
  };
  setCurrentTrack = (id, playlistId = this.currentPlaylist().id) => {
    const playlist = this.getPlaylistById(playlistId);
    if (playlist) {
      for (let i = 0; i < playlist.tracks.length; i++) {
        if (playlist.tracks[i].id === id) {
          this.setCurrentPlaylist(playlistId);
          this.current.trackIndex = i;
        }
      }
    }
  };
  currentPlaylist = () => {
    if (!this.playlists.length) return false;
    return this.playlists[this.current.playlistIndex];
  };
  setCurrentPlaylist = (id) => {
    if (this.currentPlaylist().id !== id) {
      this.playlists.forEach((playlist, index) => {
        if (playlist.id === id) {
          this.current.playlistIndex = index;
          this.current.trackIndex = 0;
        }
      });
    }
  };
  nextTrack = () => {
    if (this.currentPlaylist().tracks[this.current.trackIndex + 1])
      this.current.trackIndex++;
    else {
      this.nextPlaylist();
    }
  };
  prevTrack = () => {
    if (this.currentPlaylist().tracks[this.current.trackIndex - 1])
      this.current.trackIndex--;
    else {
      this.prevPlaylist();
    }
  };
  prevPlaylist = () => {
    if (this.current.playlistIndex === 0) {
      this.current.playlistIndex = this.playlists.length - 1;
    } else {
      this.current.playlistIndex--;
    }
    this.current.trackIndex = 0;
  };
  nextPlaylist = () => {
    if (this.current.playlistIndex === this.playlists.length - 1) {
      this.current.playlistIndex = 0;
    } else {
      this.current.playlistIndex++;
    }
    this.current.trackIndex = 0;
  };
  clear = () => {
    const path = Loader.prevFile;
    if (path && fs.existsSync(path)) fs.unlinkSync(path);
  };
}
