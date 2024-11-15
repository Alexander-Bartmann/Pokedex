// template.js
function getHeaderTemplate() {
  return `
        <div>
            <img src="img/poketball.png" alt="" class="poketball">
            <svg width="290" height="90" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <path id="arcPath" d="M 20 90 Q 100 30 380 90" />
                </defs>
                <text font-weight="bold" fill="yellow" stroke="blue" stroke-width="3" font-family="Verdana">
                    <textPath href="#arcPath" startOffset="0%" font-size="64">P</textPath>
                    <textPath href="#arcPath" startOffset="10%" font-size="58">O</textPath>
                    <textPath href="#arcPath" startOffset="20%" font-size="64">K</textPath>
                    <textPath href="#arcPath" startOffset="30%" font-size="58">E</textPath>
                    <textPath href="#arcPath" startOffset="40%" font-size="64">D</textPath>
                    <textPath href="#arcPath" startOffset="50%" font-size="58">E</textPath>
                    <textPath href="#arcPath" startOffset="60%" font-size="64">X</textPath>
                </text>
            </svg>


        </div>
        <div>
            <input type="text" class"searchfield">
        </div>
    `;
}

function getPokemonTemplate(pokemon) {
    return `
        <div class="pokemon_card">
            <div>
                <h3>#${pokemon.id}</h3>
                <h3>${pokemon.name}</h3>
            </div>
            <div class="pokemon_card_img">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="pokemon_types">
                
            </div>
        </div>
    `;
}
