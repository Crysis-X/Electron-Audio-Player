import { app, BrowserWindow, dialog, ipcMain } from "electron";
import Playlist from "./modules/Playlist/Playlist";
import started from "electron-squirrel-startup";
import Loader from "./modules/Loader/Loader";
import Player from "./modules/Player/Player";
import Track from "./modules/Track/Track";
import path from "path";
import fs from "fs";

if (started) app.quit();

const createWindow = () => {
  /* --------------------Создание Окна------------------------------------ */
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    enableLargerThanScreen: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  /* --------------------Создание контекста------------------------------- */
  const player = new Player(__dirname);
  /* --------------------Настройка путей---------------------------------- */
  mainWindow.on("close", () => {
    player.clear();
    player.save();
  });
  let dirname;
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    dirname = "";
  } else {
    dirname = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}`);
    mainWindow.loadFile(path.join(dirname, "index.html"));
  }
  /* --------------------Обработка "handle"ов------------------------------ */
  /*
  # После создание нового плейлиста, может появиться ошибка: An array of source files must be passed with any new Howl.
  Это из-за отсутсвие трека в плейлисте default) хахахаха
  */
  ipcMain.handle("next", () => player.nextTrack());
  ipcMain.handle("prev", () => player.prevTrack());
  ipcMain.handle("next-playlist", () => player.nextPlaylist());
  ipcMain.handle("prev-playlist", () => player.prevPlaylist());
  ipcMain.handle("remove", (event, id, playlistId) =>
    player.removeTrack(id, playlistId),
  );
  ipcMain.handle("get-current-playlist", () => {
    const playlist = player.currentPlaylist();
    return {
      name: playlist.name,
      id: playlist.id,
    };
  });
  ipcMain.handle("get-current-track", () => {
    const track = player.currentTrack();
    if (track)
      return {
        id: track.id,
        name: track.name,
        src: track.src,
      };
  });
  ipcMain.handle("remove-playlist", (event, id) => player.removePlaylist(id));
  ipcMain.handle("set-current-playlist", (event, id) =>
    player.setCurrentPlaylist(id),
  );
  ipcMain.handle("set-current-track", (event, id, playlistId) =>
    player.setCurrentTrack(id, playlistId),
  );
  ipcMain.handle("get-playlists", () => {
    return player.playlists.map((playlist) => ({
      name: playlist.name,
      id: playlist.id,
    }));
  });
  ipcMain.handle("get-tracks", () => {
    const playlist = player.currentPlaylist();
    if (playlist)
      return playlist.tracks.map((track) => ({
        name: track.name,
        id: track.id,
        src: track.id,
      }));
  });
  ipcMain.handle("load", () => {
    player.clear();
    const track = player.currentTrack();
    if (track) {
      const loader = new Loader(track.src, dirname);
      loader.load();
      return loader.fileName;
    } else return "";
  });
  ipcMain.handle("add", (event) => {
    const index = dialog.showMessageBoxSync(mainWindow, {
      buttons: [
        "Load a file",
        "Load files from folder into playlist",
        "Load a folder as a playlist",
      ],
    });

    if (index === 0) {
      const playlistsList = player.playlists.map((playlist) => playlist.name);
      const playlistIndex = dialog.showMessageBoxSync(mainWindow, {
        buttons: playlistsList,
      });
      if (!playlistIndex && playlistIndex !== 0) return;
      const trackPaths = dialog.showOpenDialogSync(mainWindow, {
        properties: ["openFile"],
      });
      if (trackPaths) {
        player.addTrack(trackPaths[0], player.playlists[playlistIndex].id);
      }
    } else if (index === 1) {
      const playlistsList = player.playlists.map((playlist) => playlist.name);
      const playlistIndex = dialog.showMessageBoxSync(mainWindow, {
        buttons: playlistsList,
      });
      if (!playlistIndex && playlistIndex !== 0) return;
      const folderPaths = dialog.showOpenDialogSync(mainWindow, {
        properties: ["openDirectory"],
      });
      if (folderPaths) {
        const files = fs.readdirSync(folderPaths[0], { recursive: true });
        files.forEach((file) => {
          const ext = path.extname(file);
          if (ext == ".mp3" || ext == ".ogg" || ext == ".mp4") {
            player.addTrack(
              path.join(folderPaths[0], file),
              player.playlists[playlistIndex].id,
            );
          }
        });
      }
    } else if (index === 2) {
      const folderPaths = dialog.showOpenDialogSync(mainWindow, {
        properties: ["openDirectory"],
      });
      if (folderPaths) {
        const files = fs.readdirSync(folderPaths[0], { recursive: true });
        const tracksSrc = [];
        files.forEach((file) => {
          const ext = path.extname(file);
          if (ext == ".mp3" || ext == ".ogg" || ext == ".mp4") {
            tracksSrc.push(path.join(folderPaths[0], file));
          }
        });
        const tracks = tracksSrc.map((trackSrc) => new Track(trackSrc));
        const playlistName = path.basename(folderPaths[0]);
        player.addPlaylist(new Playlist(tracks, playlistName));
      }
    }
  });
  // Devtools
  mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
  /* --------------------Загрузка гл. окна--------------------------------- */
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
