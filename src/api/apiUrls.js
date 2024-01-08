export const POKEMON_API_URL = 'https://graphql-pokeapi.graphcdn.app/'

export const CURRENCY_API_URL = (apiKey, currencies, date) =>
    `https://api.currencyapi.com/v3/historical?apikey=${apiKey}&currencies=${encodeURIComponent(currencies)}&date=${date}`
