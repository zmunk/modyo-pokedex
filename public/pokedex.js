// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeDesc = document.querySelector('.poke-desc');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeOneIcon = document.querySelector('.type-one-icon');
const pokeTypeOneText = document.querySelector('.poke-type-one-text');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeTypeTwoIcon = document.querySelector('.type-two-icon');
const pokeTypeTwoText = document.querySelector('.poke-type-two-text');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeAbilities = document.querySelector('.poke-abilities');
const pokeEvols = document.querySelector('.poke-evolutions');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

const loadingTextRight = document.querySelector('.loading-text-right');
const blueScreen = document.querySelector('.right-container__screen');


// constants and variables
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];

const typeIcons = {
    "grass": "https://vignette.wikia.nocookie.net/pokemongo/images/0/0a/Icon_Grass.png",
    "poison": "https://vignette.wikia.nocookie.net/pokemongo/images/2/26/Icon_Poison.png",
    "fire": "https://vignette.wikia.nocookie.net/pokemongo/images/0/0a/Icon_Fire.png",
    "flying": "https://vignette.wikia.nocookie.net/pokemongo/images/b/b0/Icon_Flying.png",
    "water": "https://vignette.wikia.nocookie.net/pokemongo/images/6/65/Icon_Water.png",
    "bug": "https://vignette.wikia.nocookie.net/pokemongo/images/8/88/Icon_Bug.png",
    "normal": "https://vignette.wikia.nocookie.net/pokemongo/images/4/43/Icon_Normal.png",
    "electric": "https://vignette.wikia.nocookie.net/pokemongo/images/1/1c/Icon_Electric.png",
    "ground": "https://vignette.wikia.nocookie.net/pokemongo/images/7/71/Icon_Ground.png",
    "fairy": "https://vignette.wikia.nocookie.net/pokemongo/images/7/7f/Icon_Fairy.png",
    "fighting": "https://vignette.wikia.nocookie.net/pokemongo/images/f/f0/Icon_Fighting.png",
    "psychic": "https://vignette.wikia.nocookie.net/pokemongo/images/c/ce/Icon_Psychic.png",
    "rock": "https://vignette.wikia.nocookie.net/pokemongo/images/5/57/Icon_Rock.png",
    "dark": "https://vignette.wikia.nocookie.net/pokemongo/images/e/e9/Icon_Dark.png",
    "dragon": "https://vignette.wikia.nocookie.net/pokemongo/images/d/d4/Icon_Dragon.png",
    "ghost": "https://vignette.wikia.nocookie.net/pokemongo/images/7/7d/Icon_Ghost.png",
    "ice": "https://vignette.wikia.nocookie.net/pokemongo/images/5/52/Icon_Ice.png",
    "steel": "https://vignette.wikia.nocookie.net/pokemongo/images/3/38/Icon_Steel.png",
};

let prevUrl = null;
let nextUrl = null;


// Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }
};

const fetchPokeList = url => {

    /* hide right-screen, show loading text */
    blueScreen.style.visibility = "hidden";
    loadingTextRight.innerHTML = 'Loading...';

    fetch(url) /* API call */
        .then(res => res.json())
        .then(data => {
            const { results, previous, next } = data;
            prevUrl = previous;
            nextUrl = next;

            for (let i = 0; i < 20; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];

                if (resultData) {
                    const { id, name, types, weight } = resultData;
                    const pokemonName = capitalize(name);

                    pokeListItem.dataset.id = id;

                    var html = "";
                    for (j in types) {
                        html += `<img class="type-icon" src="${typeIcons[types[j]]}" title="${types[j]}"  />`;
                    }
                    html += `<div class="pokemon-name">${pokemonName} <span class="pokemon-weight">(${weight} hg)</span></div>`;

                    pokeListItem.innerHTML = html;

                } else {
                    console.log('empty:', i);
                    pokeListItem.innerHTML = "";
                }
            }

            /* show right-screen, hide loading text */
            blueScreen.style.visibility = "visible";
            loadingTextRight.innerHTML = "";
        });
};

const fetchPokeData = id => {

    const loadingTextLeft = document.querySelector('.loading-text-left');

    /* hide right-screen, show loading text */
    mainScreen.style.visibility = "hidden";
    loadingTextLeft.textContent = 'Loading...';

    fetch(`/api/pokemon/${id}`) /* API call */
        .then(res => res.json())
        .then(data => {
            resetScreen();

            const name = data["name"];
            console.log('name:', name);

            const pokemonId = data["id"];

            const sprite = data["spriteFront"] || "";
            // console.log('sprite:', sprite);

            const types = data["types"];
            // console.log('types:', types);

            const desc = data["description"];
            // console.log('description:', desc);

            const weight = data["weight"];
            // console.log('weight:', weight);

            const abilities = data["abilities"];
            // console.log('abilities:', abilities);

            const evolutions = data["evolutions"];
            // console.log('evolutions:', evolutions);

            const firstType = types[0];
            var secondType = null;
            if (types.length >= 2)
                secondType = types[1];

            resetScreen();
            mainScreen.classList.add(firstType);
            pokeName.textContent = capitalize(name);
            pokeId.textContent = '#' + pokemonId.toString().padStart(3, '0');

            pokeFrontImage.src = sprite;

            pokeTypeOneText.textContent = capitalize(firstType);
            pokeTypeOneIcon.src = typeIcons[firstType];
            pokeTypeOneIcon.title = firstType;
            if (secondType) {
                pokeTypeTwo.classList.remove('hide');
                pokeTypeTwoText.textContent = capitalize(secondType);
                pokeTypeTwoIcon.src = typeIcons[secondType];
                pokeTypeTwoIcon.title = secondType;
            } else {
                pokeTypeTwo.classList.add('hide');
                pokeTypeTwoText.textContent = '';
            }

            if (desc)
                pokeDesc.textContent = desc;
            else
                pokeDesc.textContent = "-";

            pokeWeight.textContent = weight;
            pokeAbilities.textContent = abilities.join(", ");
            pokeEvols.textContent = evolutions.join(", ");


            /* show right-screen, hide loading text */
            mainScreen.style.visibility = "visible";
            loadingTextLeft.innerHTML = "";
        });


};

const handleLeftButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl);
    }
};

const handleRightButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl);
    }
};

const handleListItemClick = (e) => {
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.dataset.id;

    fetchPokeData(id);
};


// adding event listeners
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
}


// initialize App
fetchPokeList(`/api/list?offset=0&limit=20`);


/* front-end design code taken from: https://github.com/angle943/pokedex */