import app from "./app";
import {initLogger} from "../resources/logger/logger";


const hostname = '127.0.0.1';
const port = 4321;
initLogger();

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.on('error', (err) => {
    console.log(`${err}`);
})