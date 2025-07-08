import { useEffect, useState } from "react";
import Header from "./Header";
import sessionCheck from "../Utils/sessionCheck";
import { getByNumber } from "../Utils/getData";

export default function Search () {

    const textInput: React.CSSProperties = {
        width: "350px", fontSize: "x-large"
    }
    useEffect(() => {
        sessionCheck()
    },[])

    const [search, setSearch] = useState('')

    const searchExpediente = () => {
        if(search.length > 3) {
            getByNumber(search)
        }
        else alert("Ingrese un expediente valido.")
    }
    return (
        <div>
            <Header />
            <div>
                <h1 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Buscar Expediente</h1>
                <hr color='#3399ff'/>
                <input style={textInput} type="text" onChange={(e) => setSearch(e.target.value)}/>
                <p></p>
                <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => searchExpediente()}>
                    Buscar
                </button>
            </div>
        </div>
    )
}