import './App.css'
import Login from './Login/Login'
import Main from './Mainpage/Main'
import Header from './Header/Header'
import AddExp from './AddExp/AddExp'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Users from './Users/Users'
import DataPage from './Data/DataPage'
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
            <Route path='/users' element={<Users/>}/>
            <Route path='/data' element={<DataPage/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
