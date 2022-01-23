import { createServer } from 'http';
import * as url from 'url';
import { getFileContent, getLastFileUpdateTime } from '../bl/file-functions';

const requestRouter = (req: any, res: any) => {
    const reqUrl = url.parse(req.url, true)

    if (req.method === 'GET') {
        if (reqUrl.pathname == '/content') {
            getFileContent()
                .then((data) => {
                    res.statusCode = 200;
                    res.end(data);
                })
                .catch((err) => {
                    res.statusCode = 500;
                    res.end(err.message);
                })
        } else if (reqUrl.pathname == '/updateTime') {
            getLastFileUpdateTime()
                .then((data) => {
                    res.statusCode = 200;
                    res.end(data);
                })
                .catch((err) => {
                    res.statusCode = 500;
                    res.end(`${err}`);
                })
        } else {
            res.statusCode = 500;
            res.end('There is no such path try again!');
        }
    } else {
        res.statusCode = 500;
        res.end('There is no such path try again!');
    }
}


export const server = createServer(requestRouter);