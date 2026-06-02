import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LogoutButton = ({ handleLogout }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    handleLogout()
    navigate('/')
  }

  return (
    <>
      <Button color='inherit' type='button' onClick={ handleClick }>Log out</Button>
    </>
  )
}

export default LogoutButton