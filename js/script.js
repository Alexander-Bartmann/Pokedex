let offset = 0;
const limit = 30;
let baseURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
let currentPokemon = 0;
let cachedPokemons = {};

function init() {
    loading();
    loadHeader();
    renderAllPokemons();
}

function loadHeader() {
    let header = document.getElementById('header');
    header.innerHTML = "";
    header.innerHTML += getHeaderTemplate();
}

function loading() {
    setTimeout(() => {
        document.getElementById("loadingscreen").classList.add("d-none");
        document.getElementById("content").classList.remove("d-none");
    }, 6000);
}

async function renderAllPokemons() {
    const content = document.getElementById("content");
    let htmlContent = '';
    const response = await fetch(baseURL);
    const responseAsJson = await response.json();
    for (let i = 0; i < responseAsJson.results.length; i++) {
        const pokemon = responseAsJson.results[i];
        const pokemonData = await fetchPokemonData(pokemon.url);
        cachedPokemons[pokemonData.id] = pokemonData;
        htmlContent += getPokemonTemplate(pokemonData, getTypeColors(pokemonData));
    }
    content.innerHTML += htmlContent;
}

async function fetchPokemonData(url) {
    const pokemonId = url.split('/')[6];
    if (cachedPokemons[pokemonId]) {
        return cachedPokemons[pokemonId];
    }
    const response = await fetch(url);
    const pokemonData = await response.json();
    cachedPokemons[pokemonId] = pokemonData;
    return pokemonData;
}

function getTypeColors(pokemon) {
    return pokemon.types.reduce((accumulator, type) => {
        accumulator[type.type.name] = getTypeColor(type.type.name);
        return accumulator;
    }, {});
}

async function renderDetailCard(pokemon) {
    const detail = document.getElementById('selectedPokemon');
    if (detail.classList.contains('d-none')) {
        detail.classList.remove('d-none');
    }
    let typeList = "";
    for (let i = 0; i < pokemon.types.length; i++) {
        typeList += `<span style="background-color: ${getTypeColor(pokemon.types[i].type.name)}">${pokemon.types[i].type.name}</span> `;
    }
    const sprite = pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default || pokemon.sprites.front_default;
    const evoChainHTML = await getEvolutionImages(pokemon.species.url);
    detail.innerHTML = getCardTemplate(pokemon, typeList, sprite, evoChainHTML);
    currentPokemon = pokemon.id;
}

function closeDetail() {
    const detail = document.getElementById('selectedPokemon');
    detail.classList.add('d-none');
    detail.innerHTML = "";
}

function getTypeListHTML(pokemon) {
    let typeList = "";
    for (let i = 0; i < pokemon.types.length; i++) {
        typeList += `<span style="background-color: ${getTypeColor(pokemon.types[i].type.name)}">${pokemon.types[i].type.name}</span> `;
    }
    return typeList;
}

function getStatsHTML(pokemon) {
    const maxStatValue = 255;
    const statNames = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
    let statsHTML = '<table>';
    statsHTML += '<tr>';
    statsHTML += getStatNamesHTML(statNames);
    statsHTML += '</tr>';
    statsHTML += '<tr>';
    statsHTML += getStatValuesHTML(pokemon, statNames, maxStatValue);
    statsHTML += '</tr>';    
    statsHTML += '</table>';
    return statsHTML;
}

function getStatValuesHTML(pokemon, statNames, maxStatValue) {
    let statValuesHTML = '';
    for (let i = 0; i < statNames.length; i++) {
        const statValue = pokemon.stats[i].base_stat;
        const widthPercentage = Math.min((statValue / maxStatValue) * 100, 100);
        statValuesHTML += `<td class="stat-value">
            <div class="stat-bar">
                <div class="stat-bar-inner" style="width: ${widthPercentage}%;">${statValue}</div>
            </div>
        </td>`;
    }
    return statValuesHTML;
}

function getStatNamesHTML(statNames) {
    let statNamesHTML = '';
    for (let i = 0; i < statNames.length; i++) {
        const statName = statNames[i];
        statNamesHTML += `<td class="stat-name">${statName}</td>`;
    }
    return statNamesHTML;
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove('hidden');
    }
}

async function getEvolutionImages(speciesUrl) {
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainResponse.json();    
    let evoChainHTML = '';
    let currentEvo = evolutionChainData.chain;
    for (let count = 0; currentEvo && count < 3; count++) {
        const pokemonId = currentEvo.species.url.split('/')[6];
        evoChainHTML += await getPokemonImageHTML(pokemonId, currentEvo.evolves_to.length > 0);        
        currentEvo = currentEvo.evolves_to[0];
    }
    return evoChainHTML;
}

async function getPokemonImageHTML(pokemonId, hasEvolvesTo) {
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    const pokemonData = await pokemonResponse.json();
    return `
        <div class="evolution-image-container">
            <img src="${pokemonData.sprites.front_default}" alt="Evolution Image" class="evolution-image">
            ${hasEvolvesTo ? '<span class="arrow"> >> </span>' : ''}
        </div>
    `;
}

function loadMorePokemons() {
    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.disabled = true;
    offset += limit;
    baseURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    renderAllPokemons().then(() => {
        loadMoreButton.disabled = false;
    });
}

async function searchPokemons() {
    const search = document.getElementById("searchField").value.toLowerCase();
    const content = document.getElementById("content");
    if (search.length < 2) {
        content.innerHTML = "";
        renderAllPokemons();
        return;
    }
    const response = await fetch(baseURL);
    const data = await response.json();
    const filteredPokemons = data.results.filter(pokemon => pokemon.name.toLowerCase().includes(search));
    content.innerHTML = "";
    content.innerHTML = await Promise.all(filteredPokemons.map(pokemon => getPokemonHTML(pokemon)));
}

async function getPokemonHTML(pokemon) {
    const pokemonData = await fetch(pokemon.url);
    const pokemonJson = await pokemonData.json();
    const typeColors = getTypeColors(pokemonJson);
    return getPokemonTemplate(pokemonJson, typeColors);
}

function slideLeft() {
    if (currentPokemon > 1) {
        currentPokemon--;
    } else {
        currentPokemon = 1010;
    }
    updateDetailCard(currentPokemon);
}

function slideRight() {
    if (currentPokemon < 1010) {
        currentPokemon++;
    } else {
        currentPokemon = 1;
    }
    updateDetailCard(currentPokemon);
}

async function updateDetailCard(pokemonId) {
    if (cachedPokemons[pokemonId]) {
        renderDetailCard(cachedPokemons[pokemonId]);
    } else {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemon = await response.json();
        cachedPokemons[pokemonId] = pokemon;
        renderDetailCard(pokemon);
    }
}

