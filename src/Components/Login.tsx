import { useEffect,useState } from "react";
import LoginFn from "../Utils/LoginFn";
export default function Login () {

    const [email, setEmail] = useState('')
    const [save, setSave] = useState(false)
    const [load, setLoad] = useState(false)

    const loginAction = async () => {
        setLoad(true)
        const res = await LoginFn(email)
        setTimeout(() => {
            setLoad(true)
            if(res) window.location.href = "/"
            else {
                console.log("No log")
                setLoad(false)
            }
        }, 1500);
    }

    useEffect(() => {
        if(save){
            localStorage.setItem('save',email)
        }
        else{
            localStorage.removeItem('save')
        }
    },[save, email])

    return(
        <div style={{textAlign: "center"}}>
            <h1 id="titulo" style={{fontWeight: "bold", color: "#3399ff"}}>Sistema de Expedientes</h1>
            <hr color='#3399ff'/>
            <form >
                <div style={{padding: "8px"}}>
                    <h2 id='subtitle' style={{fontWeight: "normal", color: "#3399ff"}}>Ingrese el Correo</h2>
                    <input type='text' id='username' size={20} value={email} onChange={e => setEmail(e.target.value)}
                    style={{fontSize:"x-large", color: "#3399ff"}}/>
                </div>
                <div style={{padding: "7px"}}>
                    <h4 id='subtitle' style={{fontWeight: "normal", color: "#3399ff"}}>Recordar usuario
                    <input type="checkbox" id='remember' checked={save} onChange={e => setSave(e.target.checked)} style={{fontSize:"x-large", color: "#3399ff"}}/>
                    </h4>
                </div>
                <button id="bg-btn" style={{color: "white", backgroundColor: "#3399ff", fontSize: "x-large", width: "160px"}} disabled={load} 
                onClick={() => loginAction()}>{load ? "Ingresando...." : "Ingresar"}</button>
            </form>
        </div>
    )
}