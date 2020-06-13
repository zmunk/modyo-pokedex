const express = require('express');
const router = express.Router();
const request = require('request'); // for external API call
const fetch = require("node-fetch");

router.get('/', (req, res, next) => {
    var offset = req.query.offset;
    var limit = req.query.limit;
    console.log(`making list request (offset: ${offset}, limit: ${limit})`);

    /* call to external API */
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    function fetchJSON(url) {
        return fetch(url).then(response => response.json());
    }    

    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            const { results, previous, next } = data;

            /* set up previous url */
            var previousUrl = null;
            if (previous) {
                const { offset, limit } = require('url').parse(previous,true).query;
                previousUrl = `/api/list?offset=${offset}&limit=${limit}`
            }

            /* set up next url */
            var nextUrl = null;
            if (next) {
                const { offset, limit } = require('url').parse(next,true).query;
                nextUrl = `/api/list?offset=${offset}&limit=${limit}`
            }

            /* prepare urls for individual api calls */
            var urls = [];
            for (var key in results) {
                urls.push(results[key]["url"])
            }

            /* make api calls for the 20 pokemon in list */
            var promises = urls.map(url => fetchJSON(url));
            Promise.all(promises).then(data => {

                var pokemonList = []
                for (key in data) {
                    const id = data[key]["id"];
                    const name = data[key]["name"];
                    const types = data[key]["types"].map(slot => slot["type"]["name"]);
                    const weight = data[key]["weight"];
                    pokemonList.push({
                        id: id,
                        name: name,
                        types: types,
                        weight: weight
                    });
                }

                console.log('pokemonList:', pokemonList);

                res.status(200).json({
                    previous: previousUrl,
                    next: nextUrl,
                    results: pokemonList
                });

            });

        }
    });
});



module.exports = router; // IMPORTANT