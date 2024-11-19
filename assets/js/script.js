let offset = 0;
const limit = 30;
let baseURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
let currentPokemon = 0;


function init() {
    loading();
    loadHeader();
    renderAllPokemons();
}

function loadHeader(){
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
    let response = await fetch(baseURL);
    let responseAsJson = await response.json();
    for (let i = 0; i < responseAsJson.results.length; i++) {
        const pokemon = responseAsJson.results[i];
        htmlContent += await getPokemonHTML(pokemon);
    }
    content.innerHTML += htmlContent;
}

async function getPokemonHTML(pokemon) {
    const pokemonData = await fetch(pokemon.url);
    const pokemonJson = await pokemonData.json();
    const typeColors = getTypeColors(pokemonJson);
    return getPokemonTemplate(pokemonJson, typeColors);
}

function getTypeColors(pokemonJson) {
    return pokemonJson.types.reduce((accumulator, type) => {
        accumulator[type.type.name] = getTypeColor(type.type.name);
        return accumulator;
    }, {});
}

async function loadMorePokemons() {
    offset += limit;
    baseURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    await renderAllPokemons();
}

async function renderDetailCard(pokemon) {
    const detail = document.getElementById('selectedPokemon');
    detail.classList.remove('d-none');
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








