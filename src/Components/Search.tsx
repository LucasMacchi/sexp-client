import { useEffect, useState } from "react";
import Header from "./Header";
import sessionCheck from "../Utils/sessionCheck";
import { getByNumber, getLastModified } from "../Utils/getData";
import { IExpHistorialLast } from "../Utils/interface";

export default function Search () {

    const thTable: React.CSSProperties = {
        border: "1px solid", fontSize: "small"
    }
    const textInput: React.CSSProperties = {
        width: "350px", fontSize: "x-large"
    }
    const categoryReturner = (col: string): string => {
        switch(col){
            case "expediente":
                return "EXPEDIENTE"
            case "concepto":
                return "CONCEPTO"
            case "estado_id":
                return "ESTADO"
            case "presf":
                return "FECHA DE PRESENTACION"
            case "tesodate":
                return "FECHA DE TESORERIA"
            case "facdate":
                return "FECHA DE FACTURA"
            case "periodo":
                return "PERIODO"
            case "nrofac":
                return "NUMERO DE FACTURA"
            case "importe":
                return "IMPORTE"
            case "importe_2":
                return "COBRADO"
            case "invitacion":
                return "INVITACION"
            case "ordencompra":
                return "ORDEN DE COMPRA"
            case "ocult":
                return "OCULTADO"
            case "descripcion":
                return "DESCRIPCION"
            case "SEGUIMIENTO":
                return "SEGUIMIENTO"
            default:
                return "OTRO"
        }
    }
    const [historia, setHistorial] = useState<IExpHistorialLast[]>([])
    useEffect(() => {
        sessionCheck()
        getLastModified().then(h => setHistorial(h))
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
            <div style={{marginTop: 50}}>
                <h1 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>ULTIMAS MODIFICACIONES</h1>
                <hr color='#3399ff'/>
                <table style={{width: 600}}>
                    <tbody>
                        <tr>
                            <th style={thTable}>Nro Expediente</th>
                            <th style={thTable}>Concepto</th>
                            <th style={thTable}>Campo</th>
                            <th style={thTable}>Fecha</th>
                        </tr>
                        {historia.map((h) => (
                            <tr key={h.exp_id} onClick={() => window.location.href = "/expediente/"+h.exp_id}>
                                <th style={thTable}>{h.numero_exp}</th>
                                <th style={thTable}>{h.concepto}</th>
                                <th style={thTable}>{categoryReturner(h.col)}</th>
                                <th style={thTable}>{h.fecha.split("T")[0]}</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}