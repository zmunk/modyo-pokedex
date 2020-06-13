const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileSystem = require('fs');
const path = require('path');
const url = require('url');
// const morgan = require('morgan');

/* API routing */
const pokemonRoute = require('./api/pokemon')
const listRoute = require('./api/list')

/* log requests */
// app.use(morgan('dev'));

/* routing static files */
app.use(express.static(__dirname + '/public'));

app.use('/api/pokemon', pokemonRoute);
app.use('/api/list', listRoute);

app.use((req, res, next) => {
    fileSystem.readFile('./index.html', function(error, fileContent) {
        if (error) {
            res.writeHead(500, {"Content-type": "text/plain"});
            res.end('Error');
        } else {
            var ext = path.extname(req.url);
            if (ext === '.html')
                res.writeHead(200, {"Content-type": "text/html"});
            else if (ext == ".css")
                res.writeHead(200, {"Content-type": "text/css"});
            res.write(fileContent);
            res.end();
        }
    });
});
    
module.exports = app;