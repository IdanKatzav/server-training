import { server } from './controller';


const hostname = '127.0.0.1';
const port = 4321;


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});