import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const put = async newObject => {
  const idToEdit = newObject.id
  const urlWithId = `${baseUrl}/${idToEdit}`
  console.log('request:')
  console.log(newObject)
  console.log(urlWithId)

  const response = await axios.put(urlWithId, newObject)
  return response.data
}

const remove = async objectToDelete => {
  const idToDelete = objectToDelete.id
  const urlWithId = `${baseUrl}/${idToDelete}`

  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(urlWithId, config)
  return response
}

export default { getAll, create, setToken, put, remove }