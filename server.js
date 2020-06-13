const http = require('http');
const port = process.env.PORT || 3000;
const app = require('./app');
const server = http.createServer(app);

console.log(`server is listening at port: ${port}`);
server.listen(port);