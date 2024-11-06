import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class Track {
  name;
  ext;
  src;
  id;
  status = "OK";
  constructor(src, id = uniqid()) {
    if (!fs.existsSync(src)) {
      this.status = "NOTEXIST";
      return;
    }
    this.src = src;
    this.ext = path.extname(src);
    this.name = path.basename(src, this.ext);
    this.id = id;
  }
}
