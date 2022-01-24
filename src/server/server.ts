import app from "./app";


const hostname = '127.0.0.1';
const port = 4321;


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.on('error', (err) => {
    console.log(`${err}`);
})