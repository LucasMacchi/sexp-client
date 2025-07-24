import { useEffect, useState } from "react";
import Header from "./Header";
import { IEmpresas, IEstados, IExpediente, IServicio } from "../Utils/interface";
import { editExpediente, empresaReturner, estadoReturner, getEmpresas, getEstados, getServicios, getTipos, getUniqueExpediente } from "../Utils/getData";
import { useParams } from "react-router-dom";
import sessionCheck from "../Utils/sessionCheck";

export default function Expediente () {

    const params = useParams();
    const [exp, setExp] = useState<IExpediente | null>(null)
    const [empresas, setEmpresas] = useState<IEmpresas[]>([])
    const [servicios, setServicios] = useState<IServicio[]>([])
    const [estados, setEstados] = useState<IEstados[]>([])
    const [categoria, setCategoria] = useState('')
    const [tipos, setTipos] = useState<string[]>([])
    const [data, setData] = useState({
        prop: "",
        value: ""
    })

    const textStyle: React.CSSProperties = {
        fontWeight: "normal",
        color: "#3399ff",
        margin: "5px",
        textAlign: "left"
    }
    const textAreaStyle: React.CSSProperties = {
        width: "350px", maxWidth: "300px", height: "120px", resize: "none", overflow: "scroll"
    }
    useEffect(() => {
        sessionCheck()
        if(params.id){
            getUniqueExpediente(parseInt(params.id)).then(e => setExp(e))
            getEmpresas().then(e => setEmpresas(e))
            getEstados().then(es => setEstados(es))
            getServicios().then(se => setServicios(se))
            getTipos().then(tys => setTipos(tys))
        }
        
    },[])

    useEffect(() => {
        setData({prop: '', value: ''})
    },[categoria])

    const filterSelect: React.CSSProperties = {
        fontSize: "large", width: "350px",border: "1px solid"
    }

    const filterSelectSm: React.CSSProperties = {
        fontSize: "large", width: "50px",border: "1px solid"
    }
    const editExp = () => {
        if(data.value.length > 0 && exp && exp.exp_id) {
            if(data.prop === "invitacion" || data.prop === "orden_compra"){
                const bool = data.value === "true" ? true : false
                setExp({...exp, [data.prop]:bool})
            }
            else if(data.prop === "estado_id") {
                setExp({...exp, [data.prop]:parseInt(data.value)})
            }
            else {
                setExp({...exp, [data.prop]:data.value})
            }
            editExpediente(exp.exp_id,data.prop,data.value)
        }
        else alert("Faltan datos")
    }

    const displayMod = () => {
        switch(categoria){
            case "expediente":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.numero_exp}</h3>
                        <input type="text" value={data.value} 
                        onChange={(e) => setData({prop:"numero_exp",value:e.target.value})}/>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "estado":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.estado_id && estadoReturner(exp?.estado_id, estados)}</h3>
                        <select style={filterSelect} name="invitacion" onChange={(e) => setData({prop:"estado_id",value: e.target.value})}>
                            <option value={0}>---</option>
                            {estados.map((es) => (
                                <option value={es.estado_id}>{es.concepto}</option>
                            ))}
                        </select>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "ultmod":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.fecha_ult_mod ? exp?.fecha_ult_mod.split("T")[0] : "NaN"}</h3>
                        <input type="date" value={data.value} 
                        onChange={(e) => setData({prop:"fecha_ult_mod",value:e.target.value})}/>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "tesodate":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.fecha_tesoreria ? exp?.fecha_tesoreria.split("T")[0] : "NaN"}</h3>
                        <input type="date" value={data.value} 
                        onChange={(e) => setData({prop:"fecha_tesoreria",value:e.target.value})}/>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "facdate":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.fecha_facturacion ? exp?.fecha_facturacion.split("T")[0] : "NaN"}</h3>
                        <input type="date" value={data.value} 
                        onChange={(e) => setData({prop:"fecha_facturacion",value:e.target.value})}/>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "nrofac":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.nro_factura ? exp?.nro_factura : "NaN"}</h3>
                        <input type="text" value={data.value} 
                        onChange={(e) => setData({prop:"nro_factura",value:e.target.value})}/>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "importe":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.importe ? exp.importe : "NaN"}</h3>
                        <input type="number" value={data.value} 
                        onChange={(e) => setData({prop:"importe",value:e.target.value})}/>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "invitacion":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.invitacion ? "Si":"No"}</h3>
                        <select style={filterSelectSm} name="invitacion" onChange={(e) => setData({prop:"invitacion",value: e.target.value})}>
                            <option value="">---</option>
                            <option value="true">Si</option>
                            <option value="false">No</option>
                        </select>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "ordencompra":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.orden_compra ? "Si":"No"}</h3>
                        <select style={filterSelectSm} name="invitacion" onChange={(e) => setData({prop:"orden_compra",value: e.target.value})}>
                            <option value="">---</option>
                            <option value="true">Si</option>
                            <option value="false">No</option>
                        </select>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "descripcion":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo:</h3>
                        <p style={textStyle}>
                            {exp?.descripcion}
                        </p>
                        <h3 style={textStyle}>Nueva descripcion:</h3>
                        <textarea style={textAreaStyle} 
                        onChange={(e) => setData({prop: "descripcion", value:e.target.value})}/>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            case "tipo":
                return (
                    <div>
                        <h3 style={textStyle}>Valor previo: {exp?.tipo ? exp?.tipo : "NaN"}</h3>
                        <select style={filterSelect} name="invitacion" onChange={(e) => setData({prop:"tipo",value: e.target.value})}>
                            <option value={""}>---</option>
                            {tipos.map((tp) => (
                                <option value={tp}>{tp}</option>
                            ))}
                        </select>
                        <p></p>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} onClick={() => editExp()}>
                            Editar
                        </button>
                    </div>
                )
            default:
                return(<h4 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Ningun elemento seleccionado</h4>)
        }

    }

    return(
        <div>
            <Header />
            <div>
                <h1 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Expediente - {exp?.numero_exp}</h1>
                <hr color='#3399ff'/>
                <div style={{display: "flex", justifyContent: "space-evenly"}}>
                    <div style={{width: "50%"}}>
                       <h2 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Datos del Expediente</h2>
                       <hr color='#3399ff'/> 
                       <table style={{borderRight: "1px solid"}}>
                        <tbody>
                            <tr>
                                <th><h3 style={textStyle}>Concepto:</h3></th>
                                <th><h3 style={textStyle}>{exp?.concepto}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Fecha de Presentacion:</h3></th>
                                <th><h3 style={textStyle}>{exp?.fecha_presentacion.split("T")[0]}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Fecha de ultima modificacion:</h3></th>
                                <th><h3 style={textStyle}>{exp?.fecha_ult_mod.split("T")[0]}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Fecha de facturacion:</h3></th>
                                <th><h3 style={textStyle}>{exp?.fecha_facturacion ? exp?.fecha_facturacion.split("T")[0] : "NaN"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Fecha de tesoreria:</h3></th>
                                <th><h3 style={textStyle}>{exp?.fecha_tesoreria ? exp?.fecha_tesoreria.split("T")[0] : "NaN"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Estado:</h3></th>
                                <th><h3 style={textStyle}>{exp?.estado_id ? estadoReturner(exp.estado_id, estados) : "NaN"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Empresa:</h3></th>
                                <th><h3 style={textStyle}>{exp?.empresa_id ? empresaReturner(exp?.empresa_id, empresas,servicios) : "NaN"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Numero de factura:</h3></th>
                                <th><h3 style={textStyle}>{exp?.nro_factura ? exp?.nro_factura : "NaN"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Importe:</h3></th>
                                <th><h3 style={textStyle}>{exp?.importe ? exp?.importe : "NaN"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Tipo:</h3></th>
                                <th><h3 style={textStyle}>{exp?.tipo ? exp?.tipo : "NaN"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Periodo:</h3></th>
                                <th><h3 style={textStyle}>{exp?.periodo ? exp?.periodo : "NaN"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Orden de compra:</h3></th>
                                <th><h3 style={textStyle}>{exp?.orden_compra ? "Si" : "No"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Invitacion:</h3></th>
                                <th><h3 style={textStyle}>{exp?.invitacion ? "Si" : "No"}</h3></th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Descripcion:</h3></th>
                                <th><h3 style={textStyle}>{exp?.descripcion && exp?.descripcion}</h3></th>
                            </tr>
                        </tbody>
                       </table>
                    </div>
                    <div style={{width: "50%"}}>
                        <h2 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Modificar expediente</h2>
                       <hr color='#3399ff'/>
                       <div>
                            <select name="edit" style={filterSelect} onChange={(e) => setCategoria(e.target.value)}>
                                <option value="">---</option>
                                <option value="expediente">Numero de expediente</option>
                                <option value="estado">Estado</option>
                                <option value="ultmod">Fecha de ultima modificacion</option>
                                <option value="tesodate">Fecha de tesoreria</option>
                                <option value="facdate">Fecha de facturacion</option>
                                <option value="nrofac">Numero de factura</option>
                                <option value="importe">Importe</option>
                                <option value="invitacion">Invitacion</option>
                                <option value="ordencompra">Orden de Compra</option>
                                <option value="descripcion">Descripcion</option>
                                <option value="tipo">Tipo</option>
                            </select>
                            {displayMod()}
                       </div>
                    </div>
                </div>
            </div>
        </div>
    )
}