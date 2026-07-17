import { useEffect, useState } from "react";
import Header from "./Header";
import { ICliente, IEmpresas, IEstados, IServicio } from "../Utils/interface";
import sessionCheck from "../Utils/sessionCheck";
import {getClientes, getEmpresas, getEstados, getServicios } from "../Utils/getData";


export default function Data () {

    const [empresas, setEmpresas] = useState<IEmpresas[]>([])
    const [servicios, setServicios] = useState<IServicio[]>([])
    const [estados, setEstados] = useState<IEstados[]>([])
    const [newEstado, setNewEstado] = useState("")
    const [newCliente, setNewCliente] = useState({nombre: "", publico: false})
    const [clientes, setClientes] = useState<ICliente[]>([])
    const [newServicio, setNewServicio] = useState("")

    useEffect(() => {
        sessionCheck()
        getEmpresas().then(e => setEmpresas(e))
        getEstados().then(es => setEstados(es))
        getServicios().then(se => setServicios(se))
        getClientes().then(cl => setClientes(cl))
    },[])


    const editRegister = async (index: number, servicio: boolean, estado: boolean) => {
        if(servicio) {
            prompt(`Ingrese la nueva descripcion del servicio ${servicios[index].nombre}: `)
        }
        if(estado) {
            prompt(`Ingrese la nueva descripcion del estado ${estados[index].concepto}: `)
        }
        
    }

    return (
        <div>
            <Header />
            <div>
                <div style={{display: "flex"}}>
                    <div style={{width: "400px", textAlign: "left" }}>
                        <h3 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Estados</h3>
                        <hr color='#3399ff'/>
                        <div style={{maxHeight: "350px", height: "350px", overflow: "scroll"}}>
                        <table>
                            <tbody>
                                {estados.map((e,i) => (<tr><th onClick={() => editRegister(i, false, true)} style={rowStyle} >{e.concepto}</th></tr>))}
                            </tbody>
                        </table>
                        </div>
                        <div>
                            <h4 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Agregar Estado</h4>
                            <input placeholder="Nombre del estado" value={newEstado} onChange={(e) => setNewEstado(e.target.value)} style={{margin: "10px"}}/>
                            <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "medium", width: "80px"}}>Agregar</button>
                        </div>
                    </div>
                    <div style={{width: "600px", textAlign: "left" }}>
                        <h3 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Empresa</h3>
                        <hr color='#3399ff'/>
                        <div style={{maxHeight: "350px", height: "350px", overflow: "scroll"}}>
                        <table>
                            <tbody>
                                {empresas.map((e) => (<tr>
                                    <th style={rowStyle}>{e.nombre}</th></tr>))}
                            </tbody>
                        </table>
                        </div>
                        <div>
                            <h4 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Agregar Empresa</h4>
                            <input placeholder="Nombre de la empresa" value={newServicio} onChange={(e) => setNewServicio(e.target.value)} style={{margin: "10px"}}/>
                            <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "medium", width: "80px"}}>Agregar</button>
                        </div>
                    </div>
                    <div style={{width: "400px", textAlign: "left" }}>
                        <h3 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Clientes</h3>
                        <hr color='#3399ff'/>
                        <div style={{maxHeight: "350px", height: "350px", overflow: "scroll"}}>
                        <table>
                            <tbody>
                                {clientes.map((e) => (<tr>
                                    <th style={rowStyle}>{e.descripcion}</th></tr>))}
                            </tbody>
                        </table>
                        </div>
                        <div>
                            <h4 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Agregar Cliente</h4>
                            <input placeholder="Nombre del cliente" value={newCliente.nombre} onChange={(e) => setNewCliente({...newCliente,nombre: e.target.value})} style={{margin: "10px"}}/>
                            <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "medium", width: "80px"}}>Agregar</button>
                            
                        </div>
                    </div>
                    <div style={{width: "300px", textAlign: "left" }}>
                        <h3 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Servicios</h3>
                        <hr color='#3399ff'/>
                        <div style={{maxHeight: "350px", height: "350px", overflow: "scroll"}}>
                        <table>
                            <tbody>
                                {servicios.map((e) => (<tr>
                                    <th style={rowStyle}>{e.nombre}</th></tr>))}
                            </tbody>
                        </table>
                        </div>
                        <div>
                            <h4 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Agregar Servicio</h4>
                            <input placeholder="Nombre del servicio" value={newServicio} onChange={(e) => setNewServicio(e.target.value)} style={{margin: "10px"}}/>
                            <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "medium", width: "80px"}}>Agregar</button>
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
/*
const textStyle: React.CSSProperties = {
    fontWeight: "normal",
    color: "#3399ff",
    margin: "5px",
    textAlign: "left"
}
*/
