import { useState } from "react"
import { useUserStore } from "../Store/userStore"
import { useNavigate } from "react-router-dom"
import './Login.css'

export default function Login () {

    const navigator = useNavigate()
    const [username, setUsername] = useState('')
    const loginstore = useUserStore(state => state.login)

    const loginAction = async (e: React.MouseEvent) => {
        e.preventDefault()
        await loginstore(username)
        navigator('/')
        setUsername('')
        window.location.reload()
    }

    return(
        <div className='app-div'>
            <img src="/final_logo.png" alt="" className='logo-big-home'/>
            <h1 className='title-Homepage'>Sistema de Expedientes</h1>
            <hr color='#3399ff'/>
            <h2 className='logintext'>Ingrese el Correo</h2>
            <form >
                <div className='div-login-input'>
                  <input type='email' id='username' size={20} className='textfield-login'
                  value={username} onChange={e => setUsername(e.target.value)}/>
                </div>
                <button className='btn-small' onClick={(e) => loginAction(e)}>Ingresar</button>
            </form>
      </div>
    )
}