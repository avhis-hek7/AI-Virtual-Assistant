import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Customize from './components/Customize'
import UserDataContext from './context/UserDataContext'
import Home from './components/Home'
import Customize2 from './components/Customize2'

function App() {

  const {userData} = useContext(UserDataContext)
  return (
    <Routes>
      
      <Route path='/' element={(userData?.assistantImage && userData?.assistantName)? <Home/>:<Navigate to={'/customize'}/>}  />
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"} />}  />
      <Route path='/login' element={!userData?<Login/>:<Navigate to={"/"} />} />
      <Route path='/customize' element={userData?<Customize/>:<Navigate to={"/signup"} />} />
      <Route path='/customize2' element={userData?<Customize2/>:<Navigate to={"/signup"} />} />
    </Routes>
  )
}

export default App