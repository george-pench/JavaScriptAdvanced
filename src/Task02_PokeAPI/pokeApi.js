export async function fetchPokemonData (pokemonName) {
  const graphqlQuery = {
    query: `
      query getPokemonDetails($name: String!) {
        pokemon(name: $name) {
          name
          weight
          height
          base_experience
          sprites {
            front_default
            back_default
          }
          types {
            type {
              name
            }
          }
          abilities {
            ability {
              name
            }
          }
          stats {
            stat {
              name
            }
          }
          location_area_encounters
        }
      }
    `,
    variables: { name: pokemonName.toLowerCase() }
  }

  try {
    const response = await fetch('https://graphql-pokeapi.graphcdn.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })

    const data = await response.json()

    if (data.data && data.data.pokemon) {
      return data.data.pokemon
    } else {
      console.error('No data returned for the specified Pokémon.')
      return null
    }
  } catch (error) {
    console.error('Error fetching Pokémon data:', error)
    return null
  }
}

function displayPokemon (pokemon) {
  const container = document.getElementById('pokemon-container')

  const pokemonElement = document.createElement('div')
  pokemonElement.classList.add('pokemon')

  const nameElement = document.createElement('h2')
  nameElement.textContent = capitalizeFirstLetter(pokemon.name)

  const imageElement = document.createElement('img')
  imageElement.src = pokemon.sprites.front_default
  imageElement.alt = `Sprite of ${pokemon.name}`

  const detailsElement = document.createElement('p')
  detailsElement.textContent = 'Click for details'
  detailsElement.classList.add('details-text')

  pokemonElement.appendChild(nameElement)
  pokemonElement.appendChild(imageElement)
  pokemonElement.appendChild(detailsElement)

  container.appendChild(pokemonElement)

  pokemonElement.addEventListener('click', () => {
    showMoreInfo(pokemon)
  })
}

function showMoreInfo (pokemon) {
  document.getElementById('pokemon-name-modal').textContent = capitalizeFirstLetter(pokemon.name)
  document.getElementById('pokemon-weight-modal').textContent = 'Weight: ' + pokemon.weight
  document.getElementById('pokemon-height-modal').textContent = 'Height: ' + pokemon.height
  document.getElementById('pokemon-base-experience-modal').textContent = 'Base experience: ' + pokemon.base_experience
  document.getElementById('pokemon-image-front-modal').src = pokemon.sprites.front_default
  document.getElementById('pokemon-image-back-modal').src = pokemon.sprites.back_default
  document.getElementById('pokemon-types-modal').textContent = 'Types: ' + pokemon.types.map(pt => pt.type.name).join(', ')
  document.getElementById('pokemon-abilities-modal').textContent = 'Abilities: ' + pokemon.abilities.map(pa => pa.ability.name).join(', ')
  // document.getElementById('pokemon-stats-modal').textContent = 'Stats: ' + pokemon.stats.map(ps => ps.stat.name).join(', ')
  document.getElementById('location-area-encounters-modal').textContent = 'Location Area Encounters: ' + pokemon.location_area_encounters
  document.getElementById('pokemon-modal').style.display = 'block'
}

function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const pokemonNames = ['Bulbasaur', 'Ivysaur', 'Venusaur', 'Charmander', 'Charmeleon', 'Charizard', 'Squirtle', 'Wartortle']

let currentPage = 0
const itemsPerPage = 3
const totalPages = Math.ceil(pokemonNames.length / itemsPerPage)

export async function initPokeApi () {
  const pokemonContainer = document.getElementById('pokemon-container')
  const pageInfo = document.getElementById('page-info')
  pokemonContainer.innerHTML = ''

  const pageNames = pokemonNames.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  for (const name of pageNames) {
    try {
      const data = await fetchPokemonData(name)
      if (data) {
        displayPokemon(data)
      }
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error)
    }
  }

  pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`
  document.getElementById('prev-button').disabled = currentPage <= 0
  document.getElementById('next-button').disabled = currentPage >= totalPages - 1
}

function changePage (step) {
  currentPage = Math.max(0, Math.min(currentPage + step, totalPages - 1))
  initPokeApi()
}

document.addEventListener('DOMContentLoaded', () => {
  const closeModalElement = document.getElementById('close-modal')

  if (closeModalElement) {
    document.getElementById('close-modal').addEventListener('click', () => {
      document.getElementById('pokemon-modal').style.display = 'none'
    })

    window.onclick = function (event) {
      if (event.target === document.getElementById('pokemon-modal')) {
        document.getElementById('pokemon-modal').style.display = 'none'
      }
    }
  }

  const pokemonContainer = document.getElementById('pokemon-container')

  if (pokemonContainer) {
    initPokeApi()

    document.getElementById('prev-button').addEventListener('click', () => {
      changePage(-1)
    })

    document.getElementById('next-button').addEventListener('click', () => {
      changePage(1)
    })
  }
})

// window.pokeApi = { initPokeApi }
