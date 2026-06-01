import { useNavigate } from 'react-router-dom'

const LogoutButton = ({ handleLogout }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    handleLogout()
    navigate('/')
  }

  return (
    <>
      <button type="button" onClick={ handleClick }>Log out</button>
    </>
  )
}

export default LogoutButton