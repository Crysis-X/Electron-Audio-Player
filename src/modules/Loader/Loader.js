// Main Process
import fs from "fs";
import path from "path";

export default class Loader {
  src;
  id;
  fileName;
  filePath;
  static count = 0;
  static prevFile;
  constructor(src, dirname, type = ".mp3") {
    if (Loader.prevFile) {
      if (fs.existsSync(Loader.prevFile)) {
        fs.unlink(Loader.prevFile, (err) => {
          if (err) console.error(err);
        });
      }
    }
    this.src = src;
    this.id = Loader.count;
    this.fileName = this.id + type;
    this.filePath = path.join(dirname, this.fileName);
    Loader.count++;
  }
  load = () => {
    if (Loader.prevFile && fs.existsSync(Loader.prevFile))
      fs.unlinkSync(Loader.prevFile);
    if (fs.existsSync(this.filePath)) fs.unlinkSync(this.filePath);
    fs.copyFileSync(this.src, this.filePath);
    Loader.prevFile = this.filePath;
  };
  delete = () => {
    if (fs.existsSync(this.filePath)) {
      fs.unlink(this.filePath, (err) => {
        if (err) console.error(err);
      });
    }
  };
}
