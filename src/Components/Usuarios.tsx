import { useEffect, useState } from "react";
import Header from "./Header";
import { ICredential, IEmpresas, IServicio, IUser, IUserCreate } from "../Utils/interface";
import { activateUser, addUserCredential, deactivateUser, empresaReturner, getAllUsers, getEmpresas, getServicios, registerUser, removeUserCredential } from "../Utils/getData";
import sessionCheck from "../Utils/sessionCheck";


export default function Usuarios () {

    const [users, setUsers] = useState<IUser[]>([])
    const [register, setRegister] = useState<IUserCreate>({
    last_name: "",first_name: "",email: "",admin: false})
    const [servicios, setServicios] = useState<IServicio[]>([])
    const [empresas, setEmpresas] = useState<IEmpresas[]>([])
    const [selectedUser, setSelectedUser] = useState(0)
    
    useEffect(() => {
        sessionCheck()
        getAllUsers().then(usrs => setUsers(usrs))
        getServicios().then(se => setServicios(se))
        getEmpresas().then(e => setEmpresas(e))
    },[])

    const actdeactUser = (id: number, actv: boolean) =>{
        if(actv && confirm("Quieres activar el usuario?")) activateUser(id)
        else if (!actv && confirm("Quieres desactivar el usuario?")) deactivateUser(id)
    }

    const registerAction = async () => {
        if(register.last_name.length>0 && register.first_name.length>0 && register.email.length>0){
            if(confirm("Quieres crear este nuevo usuario?")) await registerUser(register)
        }
        else alert("Faltan datos del usuario")
    }

    const userCred = (): ICredential[] => {
        if(selectedUser) {
            let user:IUser = {first_name:"",last_name:"",email:"",admin:false,credentials:[],user_id:0,activated:false}
            users.forEach(us => {
                if(us.user_id === selectedUser) user = us
            });
            return user.credentials
        }
        else return []
    }

    const filterEmpresa = (): IEmpresas[] => {
        if(selectedUser) {
            let cred: ICredential[] = []
            users.forEach(us => {
                if(us.user_id === selectedUser) cred = us.credentials
            });
            if(cred.length>0){
                let controller = false
                let newArr: IEmpresas[] = []
                empresas.forEach(em => {
                    controller = false
                    cred.forEach(c => {
                        if(c.empresa_id === em.empresa_id) {
                            controller = true
                        }
                    });
                    if(!controller) newArr.push(em)
                });
                return newArr
            }
            else return empresas
        }

        else return []
    }

    const addCredential = async (empId: number, userId: number) => {
        if(confirm("Quires modificar las credenciales?")){
            await addUserCredential(userId, empId)
        }
    }

    const removeCredential = async (credId: number) => {
        if(confirm("Quires modificar las credenciales?")){
            await removeUserCredential(credId)
        }
    }
    
    return (
        <div>
            <Header />
            <div>
                <h1 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Usuarios</h1>
                <hr color='#3399ff'/>
                <div style={{width: "100%", maxWidth: "1800px", maxHeight: "200px", overflow: "scroll"}}>
                    <table>
                        <tbody>
                            <tr>
                                <th style={rowStyle}>Nombre</th>
                                <th style={rowStyle}>Apellido</th>
                                <th style={rowStyle}>Email</th>
                                <th style={rowStyle}>Admin</th>
                                <th style={rowStyle}>Activado</th>
                            </tr>
                            {users.map((u) => (
                                <tr onClick={() => u.activated ? actdeactUser(u.user_id,false) : actdeactUser(u.user_id,true)}>
                                    <th style={rowStyle}>{u.first_name}</th>
                                    <th style={rowStyle}>{u.last_name}</th>
                                    <th style={rowStyle}>{u.email}</th>
                                    <th style={rowStyle}>{u.admin ? "Si" : "No"}</th>
                                    <th style={rowStyle}>{u.activated ? "Si" : "No"}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div style={{width: "100%"}}>
                        <h1 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Registrar</h1>
                        <hr color='#3399ff'/>
                        <div>
                            <h3 style={textStyle}>Nombre</h3>
                            <input type="text" value={register.first_name} size={35} 
                            onChange={(e) => setRegister({...register,first_name:e.target.value})}/>
                        </div>
                        <div>
                            <h3 style={textStyle}>Apellido</h3>
                            <input type="text" value={register.last_name} size={35} 
                            onChange={(e) => setRegister({...register,last_name:e.target.value})}/>
                        </div>
                        <div>
                            <h3 style={textStyle}>Email</h3>
                            <input type="text" value={register.email} size={35} 
                            onChange={(e) => setRegister({...register,email:e.target.value})}/>
                        </div>
                        <div>
                            <h3 style={textStyle}>Admin
                                <input type="checkbox" checked={register.admin} 
                                onChange={(e) => setRegister({...register,admin:e.target.checked})}/>
                            </h3>
                        </div>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px", marginTop: "30px"}} onClick={() => registerAction()}>
                            Registrar
                        </button>
                    </div>
                    <div style={{width: "100%"}}>
                        <h1 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Credenciales</h1>
                        <hr color='#3399ff'/>
                        <div>
                            <h3 style={textStyle}>Selecciona el usuario</h3>
                            <select name="empresas"  style={selectFilterBg}
                            onChange={(e) => setSelectedUser(parseInt(e.target.value))}>
                                <option value={0}>---</option>
                                {users.map((us) => (
                                    <option value={us.user_id}>{us.email}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h3 style={textStyle}>Agregar Credencial</h3>
                            <select name="empresas"  style={selectFilterBg}
                            onChange={(e) => addCredential(parseInt(e.target.value),selectedUser)}>
                                <option value={0}>---</option>
                                {filterEmpresa().map((e) => (
                                    <option value={e.empresa_id}>{empresaReturner(e.empresa_id, empresas, servicios)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h3 style={textStyle}>Eliminar Credencial</h3>
                            <select name="empresas"  style={selectFilterBg}
                            onChange={(e) => removeCredential(parseInt(e.target.value))}>
                                <option value={0}>---</option>
                                {userCred().map((e) => (
                                    <option value={e.user_empresa_id}>{empresaReturner(e.empresa_id, empresas, servicios)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}


const rowStyle: React.CSSProperties = {
    border: "1px solid",
    width: "20%"
}

const textStyle: React.CSSProperties = {
    fontWeight: "normal",
    color: "#3399ff",
    margin: "5px",
    textAlign: "left"
}

const selectFilterBg: React.CSSProperties = {
    width: "400px"
}