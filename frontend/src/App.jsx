import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/SignUp'
import LoginIn from './components/LoginIn'

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignUp/>}  />
      <Route path='/login' element={<LoginIn/>} />
    </Routes>
  )
}

export default App