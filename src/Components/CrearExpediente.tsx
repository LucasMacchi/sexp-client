import React, { useEffect, useState } from "react";
import Header from "./Header";
import { IAddExp, IEmpresas, IEstados, IServicio, IUser } from "../Utils/interface";
import { empresaReturner, getEmpresas, getEstados, getMeses, getServicios, getTipos, postExpediente } from "../Utils/getData";
import sessionCheck from "../Utils/sessionCheck";
import { jwtDecode } from "jwt-decode";


export default function CrearExpediente () {

    const [empresas, setEmpresas] = useState<IEmpresas[]>([])
    const [servicios, setServicios] = useState<IServicio[]>([])
    const [estados, setEstados] = useState<IEstados[]>([])
    const [meses, setMeses] = useState<string[]>([])
    const [tipos, setTipos] = useState<string[]>([])

    useEffect(() => {
        sessionCheck()
        getEmpresas().then(e => setEmpresas(e))
        getEstados().then(es => setEstados(es))
        getServicios().then(se => setServicios(se))
        getTipos().then(tps => setTipos(tps))
        setMeses(getMeses())
    },[])
    const textStyle: React.CSSProperties = {
        fontWeight: "normal",
        color: "#3399ff",
        margin: "5px",
        textAlign: "left"
    }
    const textAreaStyle: React.CSSProperties = {
        width: "350px", maxWidth: "300px", height: "120px", resize: "none", overflow: "scroll"
    }
    const filterSelect: React.CSSProperties = {
        fontSize: "large", width: "350px",border: "1px solid"
    }
    const inputStyle: React.CSSProperties = {
        width: "250px"
    }
    const [data, setData] = useState<IAddExp>({
        servicio_id: 0,
        numero_exp: "",
        concepto: "",
        periodo: "",
        fecha_presentacion: "",
        nro_factura: "",
        empresa_id: 0,
        estado_id: 0,
        importe: 0,
        descripcion: "",
        user_id: 0,
        tipo: ""
    })

    const setEmpresaServicio = (empresa: number): number => {
        let service = 0
        empresas.forEach(em => {
            if(em.empresa_id === empresa){
                service = em.servicio_id
            }
        });
        return service
    }

    const createExpediente = async () => {
        const token = localStorage.getItem("jwToken");
        data.servicio_id = setEmpresaServicio(data.empresa_id)
        console.log(data)
        if(data.servicio_id && data.numero_exp.length > 2 && data.concepto.length > 2 && data.periodo.length > 0 && data.empresa_id && data.estado_id 
            && token && data.tipo.length > 0 && confirm("Quieres crear el nuevo expediente?")
        ) {
            const user: IUser = jwtDecode(token);
            data.user_id = user.user_id
            console.log(data)
            await postExpediente(data)
            setData({
                servicio_id: 0,
                numero_exp: "",
                concepto: "",
                periodo: "",
                fecha_presentacion: "",
                nro_factura: "",
                empresa_id: 0,
                estado_id: 0,
                importe: 0,
                descripcion: "",
                user_id: 0,
                tipo: ""
            })
        }
        else {
            alert("Faltan datos.")
        }
    }

    return (
        <div>
            <Header />
            <div>
                <div>
                    <h1 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Crear nuevo Expediente</h1>
                    <hr color='#3399ff'/>
                </div>
                    <div style={{width: "50%"}}>
                        <h2 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Datos del Expediente</h2>
                        <hr color='#3399ff'/> 
                        <table>
                        <tbody>
                            <tr>
                                <th><h3 style={textStyle}>Numero de Expediente:</h3></th>
                                <th style={inputStyle}>
                                    <input type="text" style={{width:"100%"}} value={data.numero_exp} 
                                    onChange={(e) => setData({...data,numero_exp:e.target.value})}/>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Empresa y Servicio:</h3></th>
                                <th>
                                    <select style={filterSelect} name="invitacion" value={data.empresa_id} 
                                    onChange={(e) => setData({...data, empresa_id: parseInt(e.target.value)})}>
                                        <option value={0}>---</option>
                                        {empresas.map((es) => (
                                            <option value={es.empresa_id}>{empresaReturner(es.empresa_id, empresas,servicios)}</option>
                                        ))}
                                    </select>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Estado:</h3></th>
                                <th>
                                <select style={filterSelect} name="invitacion" value={data.estado_id} onChange={(e) => setData({...data,estado_id: parseInt(e.target.value)})}>
                                    <option value={0}>---</option>
                                    {estados.map((es) => (
                                        <option value={es.estado_id}>{es.concepto}</option>
                                    ))}
                                </select>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Tipo:</h3></th>
                                <th>
                                    <select style={filterSelect} name="invitacion" value={data.tipo} onChange={(e) => setData({...data,tipo: e.target.value})}>
                                        <option value={0}>---</option>
                                        {tipos.map((tp) => (
                                            <option value={tp}>{tp}</option>
                                        ))}
                                    </select>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Periodo:</h3></th>
                                <th>
                                    <select style={filterSelect} name="invitacion" onChange={(e) => setData({...data,periodo: e.target.value})}>
                                        <option value={''}>---</option>
                                        {meses.map((m) => (
                                            <option value={m}>{m}</option>
                                        ))}
                                    </select>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Concepto:</h3></th>
                                <th style={inputStyle}>
                                    <input type="text" style={{width:"100%"}} value={data.concepto} 
                                    onChange={(e) => setData({...data,concepto:e.target.value})}/>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Fecha de Presentacion:</h3></th>
                                <th>
                                    <input type="date" style={{width:"100%"}} value={data.fecha_presentacion} 
                                    onChange={(e) => setData({...data,fecha_presentacion:e.target.value})}/>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Numero de factura (opcional):</h3></th>
                                <th>
                                    <input type="text" style={{width:"100%"}} value={data.nro_factura} 
                                    onChange={(e) => setData({...data,nro_factura:e.target.value})}/>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Importe (Opcional):</h3></th>
                                <th>
                                    <input type="number" min={0} style={{width:"30%"}} value={data.importe} 
                                    onChange={(e) => setData({...data,importe:parseInt(e.target.value)})}/>
                                </th>
                            </tr>
                            <tr>
                                <th><h3 style={textStyle}>Descripcion (Opcional):</h3></th>
                                <th>
                                    <textarea style={textAreaStyle} value={data.descripcion} 
                                    onChange={(e) => setData({...data,descripcion:e.target.value})}/>
                                </th>
                            </tr>
                            <tr>
                                <th></th>
                                <th>
                                    <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}} 
                                    onClick={() => createExpediente()}>
                                        Crear expediente
                                    </button>
                                </th>
                            </tr>
                        </tbody>
                       </table>
                    </div>
            </div>
        </div>
    )
}