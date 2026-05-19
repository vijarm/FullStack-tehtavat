import { useState, useEffect } from 'react'
import axios from 'axios'
import luettelo from './services/luettelo'
import Notification from './components/Notification'

const TulostaTiedot = ({person, poistaNimi}) => {
  return (
    <>
    <p>
      {person.name} {person.number}  
      <button type="submit" onClick={() => poistaNimi(person.id, person.name)}>delete</button> 
    </p>
    </>
  )
}

const FilterForm = ({filter, handleFilterChange}) => {
  return (
  <form>
    <div>
      Filter shown with: <input
        value={filter}
        onChange={handleFilterChange} />
    </div>
  </form>
  )
}

const PersonForm = (props) => {  
  return(
    <form>
    <div>
      name: <input 
        value={props.newName}
        onChange={props.handleNameChange} />
    </div>
    <div>number: <input 
        value={props.newNumber}
        onChange={props.handleNumberChange}/>
    </div>
    <div>
      <button type="submit" onClick={props.addName}>add</button>
    </div>
    </form>
  )
}

const FilteredNames = ({persons, filter, poistaNimi}) => {
/*    console.log("Toimiiko filtteri: ", filter, persons.filter(person => person.name.includes(filter)))*/
  
  const filtteroity = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    filtteroity.map(person => <TulostaTiedot key={person.name} person={person} poistaNimi={poistaNimi}/>)
  )
}

const App = () => {

  const [persons, setPersons] = useState([]) 
  
  useEffect(() => {
    luettelo
    .getAll()
    .then(alkulista => {
      console.log('Luettelo ladattu palvelimelta', alkulista)
      setPersons(alkulista)
    })
  }, [])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

  const [Ilmoitus, setIlmoitus] = useState({message: null})

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
  setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    console.log("Add nappia painettu, onko jo olemassa:", persons.map(person => person.name).includes(newName), ", nimi on:", newName, "ja numero:", newNumber)
    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} on jo luettelossa, vaihdetaanko uusi puhelinnumero?`)) {
        paivitaNumero(newName, newNumber)          
      }
    }
    else {
      const uusiNimi = {
        name: newName,
        number: newNumber
      }
      luettelo
        .create(uusiNimi)
        .then(lisattyNimi => {
          setPersons(persons.concat(lisattyNimi))
          setIlmoitus({message: `Henkilön ${uusiNimi.name} tiedot lisätty luetteloon.`, tyyppi: "kuittaus"})
          setTimeout(() => {setIlmoitus({message: null, tyyppi: null})}, 4000)
          }
        )

      setNewName('')
      setNewNumber('')
    }
  }
  
  const poistaNimi = (id, name) => {
    console.log("Delete nappia painettu, id: " + id)
    if (window.confirm(`Poistetaanko ${name} varmasti luettelosta?`)) {
      luettelo
        .poista(id)
        .then(poistettu => {setPersons(persons.filter(person => person.id !== id))
          setIlmoitus({message: `Henkilön ${name} tiedot on poistettu.`, tyyppi: "kuittaus"})
          setTimeout(() => {setIlmoitus({message: null, tyyppi: null})}, 4000)
        })
        .catch(error => {alert("ei löyry tätä!")
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const paivitaNumero = (newName, newNumber) => {
    console.log("Päivitetään uusi numero objektiin", persons.find(person => person.name === newName))
    const muokattava = persons.find(person => person.name === newName)
    const uusiObj = {...muokattava, number: newNumber}
    luettelo
        .update(muokattava.id, uusiObj)
        .then(muokattu => 
          {setPersons(persons.map(person => person.id !== muokattava.id ? person : muokattu))
          setIlmoitus({message: `Henkilön ${newName} numero on päivitetty, uusi numero ${newNumber}.`, tyyppi: "kuittaus"})
          setTimeout(() => {setIlmoitus({message: null, tyyppi: null})}, 4000)})
        .catch(error => {
          setIlmoitus({message: `Henkilön ${newName} tietoja ei löydy serverin luettelosta!`, tyyppi: "virhe"})
          setTimeout(() => {setIlmoitus({message: null, tyyppi: null})}, 4000)
          setPersons(persons.filter(person => person.id !== muokattava.id))
        })
            
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={Ilmoitus.message} tyyppi={Ilmoitus.tyyppi} />
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new number</h2>
      <PersonForm newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange}
      addName={addName} />
      <h2>Numbers</h2>
      <FilteredNames persons={persons} filter={filter} poistaNimi={poistaNimi} />
      {/* <div>debug: {newName} ja {newNumber} ja filtteri on {filter} </div> */}
        
    </div>
    
  )

}

export default App