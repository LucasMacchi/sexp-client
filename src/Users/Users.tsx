import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../Store/userStore"
import { jwtDecode } from "jwt-decode"
import { IUser, IUserCreate } from "../Utils/interface"
import './Users.css'
import { useExpStore } from "../Store/expStore"
import tokenExpireCheck from "../Utils/tokenExpireCheck"
export default function Users () {

    const navigator = useNavigate()
    const modCredentialsFn = useUserStore(s => s.modCredential)
    const activateUserFn = useUserStore(s => s.activateUser)
    const deactivateUserFn = useUserStore(s => s.deactivateUser)
    const registerFn = useUserStore(s => s.register)
    const getUsers = useUserStore(s => s.getAllUsers)
    const serviciosFn = useExpStore(s => s.serviciosFn)
    const empresasFn = useExpStore(s => s.empresasFn)
    const sysUsers = useUserStore(s => s.sysUsers)
    const [userActivate, setActivation] = useState(0)
    const [userDeactivate, setDeactivation] = useState(0)
    const [userCredentialIndex, setUserCredentialsIndex] = useState(-1)
    const servicios = useExpStore(s => s.servicios)
    const empresas = useExpStore(s => s.empresas)
    const [registerUser, setRegister] = useState<IUserCreate>({
        first_name: '',
        last_name: '',
        admin: false,
        email: ''
    })

    const handleRegister = (value: number | string | boolean, prop: string) => {
        setRegister({...registerUser, [prop]:value})
    }

    useEffect(() => {
        const token = localStorage.getItem('jwToken')
        const userData:IUser = jwtDecode(token ? token : '')
        if(!userData.admin) navigator('/')
        if(tokenExpireCheck()) {
            localStorage.removeItem('jwToken')
            window.location.reload()
        }
        if(sysUsers.length === 0) getUsers()
        if(servicios.length === 0) serviciosFn()
        if(empresas.length === 0) empresasFn()
    },[])

    const activateUser = async (id: number) => {
        await activateUserFn(id)
        window.location.reload()
    }
    const deactivateUser = async (id: number) => {
        await deactivateUserFn(id)
        window.location.reload()
    }

    const servicioReturner = (id: number): string => {
        let name = 'NaN'
        servicios.forEach(e => {
            if(e.servicio_id === id) name = e.nombre
        });
        return name
    }

    const empresaReturner = (id: number): string => {
        let name = 'NaN'
        empresas.forEach(e => {
            if(e.empresa_id === id) name = e.nombre+' - '+servicioReturner(e.servicio_id)
        });
        return name
    }

    const modCred = async (empresaId: number, userId?: number ) => {
        if(userId) {
            if(confirm('¿Quieres agregar las credenciales?')){
                await modCredentialsFn(empresaId, userId)
                window.location.reload()
            }
        }
        else {
            if(confirm('¿Quieres elminiar las credenciales?')) {
                await modCredentialsFn(empresaId)
                window.location.reload()
            }
        }
    }

    const registerNewUser = async () => {
        if(registerUser.email && registerUser.first_name && registerUser.last_name) {
                if(confirm('¿Quiere registrar a un nuevo usuario?')){
                    await registerFn(registerUser)
                    setRegister({
                        first_name: '',
                        last_name: '',
                        admin: false,
                        email: ''
                    })
                }
        }
        else alert('Debe completar todos los campos.')
    }

    const credentialsShower = () => {
        if(userCredentialIndex >= 0) {
            return(
            <div >
                <div>
                <table className="table-exp">
                    <tbody>
                        <tr>
                            <th className="table-exp-column-top">Empresa y Servicio</th>
                        </tr>
                        {sysUsers[userCredentialIndex].credentials.map((u) => {
                            return(
                                <tr>
                                    <th className="table-exp-column" onClick={() => modCred(u.user_empresa_id)}>
                                        {empresaReturner(u.empresa_id)}
                                    </th>
                                </tr> 
                            )
                        })}
                    </tbody>
                </table>
                </div>
                <div>
                    <h3 className="title-Homepage">Agregar Credenciales</h3>
                    <select name="credentials" className="select-user-activate"
                    onChange={(e) => modCred(parseInt(e.target.value), sysUsers[userCredentialIndex].user_id)}>
                        <option value={0}>---</option>
                        {empresas.map((e) => (
                            <option value={e.empresa_id}>{empresaReturner(e.empresa_id)}</option>
                        ))}
                    </select>
                </div>
            </div>
            )
        }
    }

    return(
        <div className="div-user">
            <h1 className="title-Homepage">Usuarios</h1>
            <hr color='#3399ff'/>
            <h3 className="title-Homepage">Usuarios Registrados</h3>
            <table className="table-exp">
                <tbody>
                    <tr>
                        <th className="table-exp-column-top">Nombre Completo</th>
                        <th className="table-exp-column-top">Email</th>
                        <th className="table-exp-column-top">Admin</th>
                        <th className="table-exp-column-top">Activado</th>
                    </tr>
                    {sysUsers.map((u) => {
                        return(
                            <tr key={u.user_id}>
                                <th className="table-exp-column">{u.first_name + ' ' + u.last_name}</th>
                                <th className="table-exp-column">{u.email}</th>
                                <th className="table-exp-column">{u.admin ? 'Si':'No'}</th>
                                <th className="table-exp-column">{u.activated ? 'Si':'No'}</th>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
            <div>
            <h3 className="title-Homepage">Activar Usuarios</h3>
            <select className="select-user-activate" value={userActivate} 
            name="activate" onChange={(e) => setActivation(parseInt(e.target.value))}>
                    <option value={0}>---</option>
                    {sysUsers.map((u) => {
                        if(!u.activated){
                            return(
                                <option value={u.user_id}>{u.email}</option>
                            )
                        }
                    })}
            </select>
            <button className="btn-exp" onClick={() => activateUser(userActivate)} >Activar</button>
            </div>
            <div>
            <h3 className="title-Homepage">Desactivar Usuarios</h3>
            <select className="select-user-activate" value={userDeactivate} 
            name="activate" onChange={(e) => setDeactivation(parseInt(e.target.value))}>
                    <option value={0}>---</option>
                    {sysUsers.map((u) => {
                        if(u.activated){
                            return(
                                <option value={u.user_id}>{u.email}</option>
                            )
                        }
                    })}
            </select>
            <button className="btn-exp" onClick={() => deactivateUser(userDeactivate)} >Desactivar</button>
            </div>
            <div>
            <h3 className="title-Homepage">Mostrar Credenciales</h3>
            <select className="select-user-activate" value={userCredentialIndex} 
            name="activate" onChange={(e) => setUserCredentialsIndex(parseInt(e.target.value))}>
                    <option value={-1}>---</option>
                    {sysUsers.map((u, i) => {
                        return(
                            <option value={i}>{u.email}</option>
                        )
                    })}
            </select>
            </div>
            {credentialsShower()}
            <hr color='#3399ff'/>
            <div>
                <h3 className="title-Homepage">Registrar Usuario</h3>
                <div className="input-div-register">
                    <h5 className="text-body">Nombre</h5>
                    <input value={registerUser.first_name} type="text" onChange={(e) => handleRegister(e.target.value,'first_name')}/>
                </div>
                <div className="input-div-register">
                    <h5 className="text-body">Apellido</h5>
                    <input value={registerUser.last_name} type="text" onChange={(e) => handleRegister(e.target.value,'last_name')}/>
                </div>
                <div className="input-div-register">
                <h5 className="text-body">Email</h5>
                    <input type="text" value={registerUser.email} onChange={(e) => handleRegister(e.target.value,'email')}/>
                </div>
                <div className="input-div-register">
                    <label className="label-form-register">Admin</label>
                    <input type="checkbox" checked={registerUser.admin} onChange={(e) => handleRegister(e.target.checked,'admin')}/>
                </div>
                <div className="input-div-register">
                    <button className="btn-exp" onClick={() => registerNewUser()} >Registrar</button>
                </div>
            </div>
        </div>
    )
}