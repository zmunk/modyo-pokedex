const express = require('express');
const router = express.Router();
const request = require('request'); // for external API call
const fetch = require("node-fetch");

router.get('/:pokemonId', (req, res, next) => {
    const pokemonId = req.params.pokemonId;
    const url1 = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const url2 = `https://pokeapi.co/api/v2/characteristic/${pokemonId}`;
    const url3 = `https://pokeapi.co/api/v2/evolution-chain/${pokemonId}`;

    function fetchJSON(url) {
        return fetch(url).then(response => response.json());
    }

    /* note: some pokemone don't have characteristic pages */
    var promises = [fetchJSON(url1), fetchJSON(url3), fetchJSON(url2).catch(e => { console.log("couldn't fetch description"); })];

    Promise.all(promises).then(data => {
        const name = data[0]["name"];
        const typesList = data[0]["types"].map(slot => slot["type"]["name"]);
        const types = data[0]["types"];
        const height = data[0]["height"];
        const weight = data[0]["weight"];
        const sprites = data[0]["sprites"];
        const spriteFront = data[0]["sprites"]["front_default"];
        const spriteBack = data[0]["sprites"]["back_default"];
        const abilities = data[0]["abilities"].map(slot => slot["ability"]["name"]);

        var description = null;
        if (data[2]) {
            console.log('descriptions:', data[2]["descriptions"]);

            /* get description from second url */
            const descriptions = data[2]["descriptions"];
            if (descriptions) {
                for (i in descriptions) {
                    if (descriptions[i]["language"]["name"] == "en") {
                        description = descriptions[i]["description"];
                        break;
                    }
                }
            }
        }

        /* get evolutions from third url */
        var evolutions = [];
        var curr = data[1]["chain"];
        while (1) {
            var evolvesTo = curr["evolves_to"]
            var evolution = curr["species"]["name"];

            evolutions.push(evolution);

            if (evolvesTo.length == 0)
                break;
            else
                curr = curr["evolves_to"][0];
        }

        console.log('name:', name);
        console.log('types:', typesList);
        console.log('weight:', weight);
        console.log('abilities:', abilities);
        console.log('description:', description);
        console.log('evolutions:', evolutions);


        /* send response to front-end */
        res.status(200).json({
            id: pokemonId,
            name: name,
            types: typesList,
            height: height,
            weight: weight,
            sprites: sprites,
            spriteFront: spriteFront,
            spriteBack: spriteBack,
            abilities: abilities,
            description: description,
            evolutions: evolutions
        });
    });


});



module.exports = router; // IMPORTANT