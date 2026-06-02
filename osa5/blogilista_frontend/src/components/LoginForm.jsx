import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const clickLogin = async event => {
    event.preventDefault()
    const loginOk = await handleLogin(username, password)
    if (loginOk) { navigate('/')}
  }

  return(
    <form onSubmit={ clickLogin }>
      <div>
        <h2>Log in to application</h2>
      </div>
      <div>
        <TextField
          label='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          variant='outlined'
          size='small'
          margin='dense'
        />
      </div>
      <div>
        <TextField
          label='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          variant='outlined'
          size='small'
          margin='dense'
          type='password'
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }} >login</Button>
    </form>
  )
}

export default LoginForm