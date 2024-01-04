export const POKEMON_FETCH_DATA_QUERY = `
query {
  pokemons(limit: 20) {
    results {
      name
      image
    }
  }
}
`

export const POKEMON_DETAILS_QUERY = `
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
      base_stat
    }
  }
}
`
