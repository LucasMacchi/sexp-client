import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './Components/Login'
import Mainpage from './Components/Mainpage'
import Expediente from './Components/Expediente'
import Search from './Components/Search'
import CrearExpediente from './Components/CrearExpediente'
import Usuarios from './Components/Usuarios'
import Data from './Components/Data'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Mainpage/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/Search' element={<Search/>}/>
            <Route path='/Crear' element={<CrearExpediente/>}/>
            <Route path='/Usuarios' element={<Usuarios/>}/>
            <Route path='/Datos' element={<Data/>}/>
            <Route path='/expediente/:id' element={<Expediente/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
