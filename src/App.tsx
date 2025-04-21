import './App.css'
import Login from './Login/Login'
import Main from './Mainpage/Main'
import Header from './Header/Header'
import AddExp from './AddExp/AddExp'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
function App() {
  const [token, setToken] = useState('')

  useEffect(() => {
    setToken(localStorage.getItem('jwToken') || '')
  },[])
  const headerDisplayer = () => {
    if(token) {
      return (<Header />)
    }
  }

  return (
    <div>
      <BrowserRouter>
        {headerDisplayer()}
        <Routes>
            <Route path='/' element={<Main/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/add' element={<AddExp/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
