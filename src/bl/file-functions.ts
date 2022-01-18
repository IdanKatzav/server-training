import { readFile, stat, Stats } from 'fs'

export const getLastFileUpdateTime = () => {
    return new Promise<string>((resolve, reject) => {
        stat('./src/bl/file.txt', (err, stats) => {
            if(err){
                reject(err);
            }
            resolve(stats.mtime.toString());
        })
    });
}

export const getFileContent = () => {
    return new Promise<string>((resolve, reject) => {
        readFile('./src/bl/file.txt', 'utf8' , (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.toUpperCase());
            }
        });
    });
}