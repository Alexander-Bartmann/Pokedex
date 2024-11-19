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
            <input type="text" id="searchField" class="searchfield" placeholder="Search..." oninput="searchPokemons()">
        </div>
    `;
}

function getPokemonTemplate(pokemon, typeColors) {
    return `
        <div class="pokemon_card" onclick="renderDetailCard(${JSON.stringify(pokemon).replace(/"/g, '&quot;')}, ${JSON.stringify(typeColors).replace(/"/g, '&quot;')})">
            <div style="display: flex; gap: 16px; justify-content: space-around;">
                <h3>#${pokemon.id}</h3>
                <h3>${pokemon.name}</h3>
            </div>
            <div class="pokemon_card_img" style="background-color: ${typeColors[pokemon.types[0].type.name]};">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="pokemon_types j_center">
                <span style="background-color: ${typeColors[pokemon.types[0].type.name]}">${pokemon.types[0].type.name}</span>
                ${pokemon.types[1] ? `<span style="background-color: ${typeColors[pokemon.types[1].type.name]}">${pokemon.types[1].type.name}</span>` : ""}
            </div>
        </div>
    `;
}


function getCardTemplate(pokemon, typeList, sprite, evoChainHTML) {
    return `
        <div class="selectedPokemon" onclick="closeDetail()" style="display: flex; gap: 16px; justify-content: space-around;">
            <div class="openCard">
                <div class="card_details bg">
                    <div>
                        <div class="display">
                            <h2>#${pokemon.id} - ${pokemon.name}</h2>
                            <button onclick="closeDetail()" class="pokemon_button">&#x2715;</button>
                        </div>
                        <div class="card_details_img" style="background-color: ${getTypeColor(pokemon.types[0].type.name)};">
                            <img src="${sprite}" alt="${pokemon.name}">
                        </div>
                        <div class="pokemon_types j_space">
                            <button onclick="slideLeft()" class="pokemon_button">&#8249;</button>
                            <p>${typeList}</p>
                            <button onclick="slideRight()" class="pokemon_button">&#8250;</button>
                        </div>
                    </div>
                    <div>                     
                        <div class="container_buttons">
                            <button onclick="showSection('main'); event.stopPropagation();">Main</button>
                            <button onclick="showSection('stats'); event.stopPropagation();">Stats</button>
                            <button onclick="showSection('evoChain'); event.stopPropagation();">Evo Chain</button>
                        </div>
                        <div id="main" class="section">
                            <table>
                                <tr>
                                    <td><strong>Height: </strong></td>
                                    <td><strong>Weight:</strong></td>
                                    <td><strong>Base Experience:</strong></td>
                                    <td><strong>Abilities:</strong></td>
                                </tr>
                                <tr>
                                    <td>${pokemon.height} m</td>
                                    <td>${pokemon.weight} kg</td>
                                    <td>${pokemon.base_experience}</td>
                                    <td>${pokemon.abilities[0].ability.name},${pokemon.abilities[1]?.ability.name || ""}</td>
                                </tr>
                            </table>
                        </div>
                        <div id="stats" class="section hidden">
                            <table>
                                ${getStatsHTML(pokemon)}
                            </table>
                        </div>
                        <div id="evoChain" class="section hidden">
                            ${evoChainHTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getStatsValuesTemplate(widthPercentage, statValue) {
    return `
            <div class="stat-value">
                <div class="stat-bar">
                    <div class="stat-bar-inner" style="width: ${widthPercentage}%;">
                        ${statValue}
                    </div>
                </div>
            </div>
        `;
}
