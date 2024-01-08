import { POKEMON_DETAILS_QUERY, POKEMON_FETCH_DATA_QUERY } from '../api/graphqlQueries.js'
import { POKEMON_API_URL } from '../api/apiUrls'

const pokemonsLimit = 10

export async function fetchPokemonData (offset = 0) {
  const graphqlQuery = {
    query: POKEMON_FETCH_DATA_QUERY(pokemonsLimit, offset)
  }

  try {
    const response = await fetch(POKEMON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })

    const data = await response.json()

    if (data.data && data.data.pokemons) {
      totalPages = Math.ceil(data.data.pokemons.count / itemsPerPage)
      return data.data.pokemons.results
    } else {
      console.error('No data returned from Pokémon API.')
      return null
    }
  } catch (error) {
    console.error('Error fetching Pokémon data:', error)
    return null
  }
}

const fetchPokemonDetailsQuery = POKEMON_DETAILS_QUERY

async function fetchPokemonDetails (name) {
  const graphqlQuery = {
    query: fetchPokemonDetailsQuery,
    variables: { name }
  }

  try {
    const response = await fetch(POKEMON_API_URL, {
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
      console.error('No detailed data returned from Pokémon API for', name)
      return null
    }
  } catch (error) {
    console.error('Error fetching detailed Pokémon data:', error)
    return null
  }
}

// let pokemonNames = []
let currentPage = 0
const itemsPerPage = 10
let totalPages

export async function initPokeApi () {
  currentPage = 0
  updatePageContent()
}

async function updatePageContent () {
  const offset = currentPage * itemsPerPage
  const pageItems = await fetchPokemonData(offset)
  const pokemonContainer = document.getElementById('pokemon-container')
  pokemonContainer.innerHTML = ''

  if (pageItems) {
    pageItems.forEach(pokemon => {
      displayPokemon(pokemon)
    })
  }

  const pageInfo = document.getElementById('page-info')
  pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`
  document.getElementById('prev-button').disabled = currentPage <= 0
  document.getElementById('next-button').disabled = currentPage >= totalPages - 1
}

function displayPokemon (pokemon) {
  const container = document.getElementById('pokemon-container')

  const pokemonElement = document.createElement('div')
  pokemonElement.classList.add('pokemon')

  const nameElement = document.createElement('h2')
  nameElement.textContent = capitalizeFirstLetter(pokemon.name)

  const imageElement = document.createElement('img')
  imageElement.src = pokemon.image
  imageElement.alt = `Sprite of ${pokemon.name}`

  const detailsElement = document.createElement('p')
  detailsElement.textContent = 'Click for details'
  detailsElement.classList.add('details-text')

  pokemonElement.appendChild(nameElement)
  pokemonElement.appendChild(imageElement)
  pokemonElement.appendChild(detailsElement)

  container.appendChild(pokemonElement)

  pokemonElement.addEventListener('click', () => {
    fetchAndDisplayPokemonDetails(pokemon.name)
  })
}

function showMoreInfo (pokemon) {
  document.getElementById('pokemon-name-modal').textContent = capitalizeFirstLetter(pokemon.name)
  document.getElementById('pokemon-weight-modal').textContent = 'Weight: ' + pokemon.weight
  document.getElementById('pokemon-height-modal').textContent = 'Height: ' + pokemon.height
  document.getElementById('pokemon-image-front-modal').src = pokemon.sprites.front_default
  document.getElementById('pokemon-image-back-modal').src = pokemon.sprites.back_default
  document.getElementById('pokemon-types-modal').textContent = 'Types: ' + pokemon.types.map(pt => pt.type.name).join(', ')
  document.getElementById('pokemon-abilities-modal').textContent = 'Abilities: ' + pokemon.abilities.map(pa => pa.ability.name).join(', ')

  let statsText = 'Stats: '
  pokemon.stats.forEach(stat => { statsText += stat.base_stat + ', ' })
  statsText = statsText.slice(0, -2)
  document.getElementById('pokemon-stats-modal').textContent = statsText
  document.getElementById('pokemon-base-experience-modal').textContent = 'Base experience: ' + pokemon.base_experience
  document.getElementById('pokemon-modal').style.display = 'block'
}

function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function changePage (step) {
  currentPage = Math.max(0, Math.min(currentPage + step, totalPages - 1))
  updatePageContent()
}

async function fetchAndDisplayPokemonDetails (pokemonName) {
  const pokemonDetails = await fetchPokemonDetails(pokemonName)
  if (pokemonDetails) {
    showMoreInfo(pokemonDetails)
  }
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
