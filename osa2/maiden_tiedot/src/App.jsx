import { useState, useEffect } from 'react'
import axios from 'axios'


const FilterForm = ({ filter, handleFilterChange }) => {
  return (
  <form>
    <div>
      Etsi maita: <input
        value={filter}
        onChange={handleFilterChange} />
    </div>
  </form>
  )
}

const TulostaMaatListana = ({ maa, etsiMaa }) => {
  return (
    <>
    <p>{maa.name.common} <button type="button" onClick={() => etsiMaa(maa)}>Näytä tiedot</button></p>
    </>
  )
}

const TulostaMaanTiedot = ({ maa }) => {
  const apiURL = "https://api.open-meteo.com/v1/forecast?latitude=" + maa.capitalInfo.latlng[0] + "&longitude=" + maa.capitalInfo.latlng[1] + "&current=temperature_2m,rain,wind_speed_10m,precipitation"
  console.log(apiURL)

  const [saatiedot, setSaatiedot] = useState(null)

  useEffect(() => {
  axios.get(apiURL)
  .then(tiedot => {
    console.log('Säätiedot ladattu palvelimelta', tiedot.data)
    setSaatiedot(tiedot.data)
  })
  .catch(error => {
    console.log('Säätietojen haku palvelimelta epäonnistui')
  })
  }, [maa])

  return (
    <>
    <h2>{maa.name.common}</h2>
    <p>Capital: {maa.capital[0]}</p>
    <p>Asukasluku: {maa.population}</p>
    <h3>Kielet:</h3>
      <ul>
        {Object.values(maa.languages).map(kieli => (
          <li key={kieli}>{kieli}</li>
        ))}
      </ul>
    <img src={maa.flags.png} alt="Maan lipun kuva" border="1"/>
    <h3>Säätiedot pääkaupungissa juuri nyt:</h3>
    <p>Lämpötila: {saatiedot?.current.temperature_2m} astetta celsiusta</p>
    <p>Tuulennopeus: {(saatiedot?.current.wind_speed_10m / 3.6).toFixed(2)} m/s</p>
    <p>Sadetta: {saatiedot?.current.rain} mm</p>
    </>
  )
}

const FilteredMaat = ({maat, filter, etsiMaa}) => {

  const filtteroity = maat.filter(maa => maa.name.common.toLowerCase().includes(filter.trim().toLowerCase()))
  /*console.log("Toimiiko filtteri: ", filter, filtteroity)*/

  if (filtteroity.length > 10) {
    return (
      <><p>Maita löytyy liian paljon, tarkenna hakuehtoa</p></>
    )
  }
  else if ((filtteroity.length <= 10) && (filtteroity.length > 1)) {
    return (
      filtteroity.map(maa => <TulostaMaatListana key={maa.name.common} maa={maa} etsiMaa={etsiMaa} />)
    )
  }

  else if (filtteroity.length === 1) {
    return (
      <TulostaMaanTiedot maa={filtteroity[0]} />
    )
  }

  else {
    return (
    <><p>Ei löydy yhtään maata! Tarkista hakuehto.</p></>
    )
  }
}


const App = () => {

  const [filter, setFilter] = useState('')

  const [maat, setMaat] = useState([])

  const handleFilterChange = (event) => {
  setFilter(event.target.value)
  }

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(maat => {
      console.log('Maat ladattu palvelimelta', maat.data)
      setMaat(maat.data)
    })
    .catch(error => {
    console.log('Maiden tietojen haku palvelimelta epäonnistui')
    })
  }, [])

  const etsiMaa = (maa) => {
    console.log("Näytä tiedot yhteydessä saapui objekti:", maa)
    setFilter(maa.name.common)
  }

  return (
    <div>
      <h2>Maiden perustiedot</h2>
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
      <FilteredMaat maat={maat} filter={filter} etsiMaa={etsiMaa} />
    </div>
  )
}

export default App