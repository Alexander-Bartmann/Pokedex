const baseURL = "https://pokeapi.co/api/v2/pokemon?limit=30&offset=0"
const allPokemonsArray = [];
let htmlContent = "";

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
    }, 3000);
}

async function renderAllPokemons() {
    htmlContent = "";
    let response = await fetch(baseURL);
    let responseAsJson = await response.json();
    for (let i = 0; i < responseAsJson.results.length; i++) {
        let pokemon = responseAsJson.results[i];
        let pokemonData = await fetch(pokemon.url);
        let pokemonJson = await pokemonData.json();
        htmlContent += getPokemonTemplate(pokemonJson);
    }
    document.getElementById("content").innerHTML = htmlContent;
}
