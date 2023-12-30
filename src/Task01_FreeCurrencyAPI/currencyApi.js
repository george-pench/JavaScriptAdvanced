export const apiKey = process.env.API_KEY

export async function fetchCurrencyDataForDate (date, selectedCurrencies) {
  const currencies = selectedCurrencies.join(',')
  const url = `https://api.currencyapi.com/v3/historical?apikey=${apiKey}&currencies=${encodeURIComponent(currencies)}&date=${date}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error', error)
    return null
  }
}

export function updateTableWithCurrencyData (date, currencyData) {
  const tbody = document.getElementById('currency-table').querySelector('tbody')
  const row = tbody.insertRow()

  const dateCell = row.insertCell()
  dateCell.textContent = date

  Object.keys(currencyData).forEach(key => {
    const value = currencyData[key].value
    const cell = row.insertCell()
    cell.textContent = value.toFixed(2)
  })
}

document.getElementById('fetch-data').addEventListener('click', async () => {
  const selectedDate = document.getElementById('date-picker').value
  const selectedOptions = document.getElementById('currency-select').selectedOptions
  const selectedCurrencies = Array.from(selectedOptions).map(opt => opt.value)

  if (selectedDate && selectedCurrencies.length > 0) {
    try {
      const data = await fetchCurrencyDataForDate(selectedDate, selectedCurrencies)

      if (data && data.data) {
        updateTableWithCurrencyData(selectedDate, data.data)
      } else {
        console.error('No data returned for selected currencies and date!')
      }
    } catch (error) {
      console.error('Error fetching currency data:', error)
    }
  } else {
    alert('Please select a date and at least one currency!')
  }
})
