import { useNavigate } from 'react-router-dom'
import './Header.css'
import { useState } from 'react'
import { useUserStore } from '../Store/userStore'
import { IUser } from '../Utils/interface'
import { jwtDecode } from 'jwt-decode'

export default function Header () {

    const logout = useUserStore(s => s.logout)
    const [drop, setDrop] = useState(false)
    const navigator = useNavigate()


    const navigateTo = (link: string) => {
        setDrop(false)
        navigator(link)
    }

    const logOutHeader = () => {
        if(confirm('¿Seguro que quieres cerrar sesion?')) {
            logout()
            navigator('/login')
            window.location.reload()
        }
        else setDrop(false)
    }

    const userBtnsDisplayer = () => {
        const token = localStorage.getItem('jwToken')
        const userData:IUser = jwtDecode(token ? token : '')
        if(userData.admin) {
            return(
                <li className='dropdown-li' onClick={() => navigateTo('/users')}>
                    Admin - Usuarios
                </li>
            )
        }

    }
    const dataBtnsDisplayer = () => {
        const token = localStorage.getItem('jwToken')
        const userData:IUser = jwtDecode(token ? token : '')
        if(userData.admin) {
            return(
                <li className='dropdown-li' onClick={() => navigateTo('/data')}>
                    Admin - Datos
                </li>
            )
        }

    }

    return(
        <div className='div-header'>
            <div className='div-logo'>
                <img src="/logo_big.webp" alt="" className='logo-big-home'/>
            </div>
            <div className="dropdown">
                <button className='btn-menu-header' onClick={() => setDrop(!drop)}>Menu</button>
                {drop && (
                    <ul className='dropdown-ul'>
                        <li className='dropdown-li' onClick={() => logOutHeader()}>
                            Cerrar Sesion
                            </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/')}>
                            Expedientes
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/add')}>
                            Nuevo Expediente
                        </li>
                        {userBtnsDisplayer()}
                        {dataBtnsDisplayer()}
                    </ul>
                )}
            </div>
        </div>
    )
}