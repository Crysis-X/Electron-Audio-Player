import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("main", {
  audio: {
    next: () => ipcRenderer.invoke("next"),
    prev: () => ipcRenderer.invoke("prev"),
    nextPlaylist: () => ipcRenderer.invoke("next-playlist"),
    prevPlaylist: () => ipcRenderer.invoke("prev-playlist"),
    add: () => ipcRenderer.invoke("add"),
    remove: (id, playlistId) => ipcRenderer.invoke("remove", id, playlistId),
    setCurrentPlaylist: (id) => ipcRenderer.invoke("set-current-playlist", id),
    setCurrentTrack: (id, playlistId) =>
      ipcRenderer.invoke("set-current-track", id, playlistId),
    getCurrentTrack: () => ipcRenderer.invoke("get-current-track"),
    getCurrentPlaylist: () => ipcRenderer.invoke("get-current-playlist"),
    removePlaylist: (id) => ipcRenderer.invoke("remove-playlist", id),
    getPlaylists: () => ipcRenderer.invoke("get-playlists"),
    getTracks: () => ipcRenderer.invoke("get-tracks"),
    load: () => ipcRenderer.invoke("load"),
  },
});
