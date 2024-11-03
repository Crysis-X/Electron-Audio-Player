import fs from "fs";
import path from "path";

export default class Loader {
    src; 
    id;
    fileName;
    filePath;
    static count = 0;
    static prevFile;
    constructor(src, dirname, type = ".mp3"){
        if(AudioContext.prevFile){
            if(fs.existsSync(AudioContext.prevFile)){
                fs.unlink(AudioContext.prevFile, (err) => {
                    if(err) console.error(err);
                });
            }
        } 
        this.src = src;
        this.id = AudioContext.count; 
        this.fileName = this.id + type;
        this.filePath = path.join(dirname, this.fileName);
        AudioContext.count++;
    }
    load = () => {
        if(fs.existsSync(this.filePath)) fs.unlinkSync(this.filePath);
        fs.copyFileSync(this.src, this.filePath);
        AudioContext.prevFile = this.filePath;
    }
    delete = () => {
        if(fs.existsSync(this.filePath)){
            fs.unlink(this.filePath, (err) => {
                if(err) console.error(err);
            });
        }
    }
}