import { useEffect, useState } from "react";
import logo from "../assets/sistemasLogo.jpg";
import { Link } from "react-router";
import logoutFn from "../Utils/logoutFn";

export default function Header () {

    const [admin, setAdmin] = useState(false)

    useEffect(() => {
        const admin = localStorage.getItem("admin")
        if(admin) setAdmin(true)
    },[])

    const linkStyle: React.CSSProperties = { height: "auto", border: "1px solid", borderColor: "black",
        textDecoration: "none", padding: "10px", color:"white", fontWeight: "bold",
        fontSize: "x-large"
    }

    const logout = async () => {
        if(confirm("Quieres cerrar Sesion?")) await logoutFn()
    }

    const navbarDisplay = () => {
        return (
            <div>
                <img src={logo} alt="Logo" style={{maxWidth: "180px", width: "100%"}}/>
                <div>
                    <div style={{
                        backgroundColor: "#6495ed",
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%"
                        
                    }}>
                        <div style={{padding: "10px"}}>
                            <Link style={linkStyle} to={'/'}>Pagina Principal</Link>
                            <Link style={linkStyle} to={'/Search'}>Buscar</Link>
                            <Link style={linkStyle} to={'/Crear'}>Crear Expediente</Link>
                            {/*admin && <Link style={linkStyle} to={'/Usuarios'}>Usuarios</Link>*/}
                        </div>
                        <div style={{padding: "10px"}}>
                            <a href="/login" style={{...linkStyle, backgroundColor: "red"}} onClick={() => logout()}>Cerrar Sesion</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div style={{textAlign: 'center', marginBottom:"50px"}}>
            {navbarDisplay()}
        </div>
    )
}