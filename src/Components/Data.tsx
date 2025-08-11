import { useEffect, useState } from "react";
import Header from "./Header";
import { IEmpresas, IEstados, IServicio } from "../Utils/interface";
import sessionCheck from "../Utils/sessionCheck";
import { addEmpresaServicioFn, addEstado, addService, empresaReturner, getEmpresas, getEmpresasNames, getEstados, getServicios, getTipos } from "../Utils/getData";


export default function Data () {

    const [empresas, setEmpresas] = useState<IEmpresas[]>([])
    const [servicios, setServicios] = useState<IServicio[]>([])
    const [estados, setEstados] = useState<IEstados[]>([])
    const [empname, setEmpname] = useState({emp: "", srv: 0})
    const [tipos, setTipos] = useState<string[]>([])
    const [newEstado, setNewEstado] = useState("")
    const [newServicio, setNewServicio] = useState("")

    useEffect(() => {
        sessionCheck()
        getEmpresas().then(e => setEmpresas(e))
        getEstados().then(es => setEstados(es))
        getServicios().then(se => setServicios(se))
        getTipos().then(typs => setTipos(typs))
    },[])

    const createEstado = async () => {
        if(newEstado.length > 0) {
            await addEstado(newEstado)
        }
        else alert("Ingrese un estado valido")
    }

    const createServicio = async () => {
        if(newServicio.length > 0) {
            await addService(newServicio)
        }
        else alert("Ingrese un servicio valido")
    }

    const createEmpresaServ = async () => {
        if(empname.emp.length > 0 && empname.srv) {
            await addEmpresaServicioFn(empname.emp, empname.srv)
        } else alert("Falta datos para crear la empresa.")
    }

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
                        <h4 style={textStyle}>Agregar Estado</h4>
                        <input type="text" value={newEstado} size={35} 
                        onChange={(e) => setNewEstado(e.target.value)}/>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px", marginTop: "30px"}} onClick={() => createEstado()}>
                            Agregar
                        </button>
                    </div>
                    <div style={{width: "600px", textAlign: "left" }}>
                        <h3 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Empresa Servicio</h3>
                        <hr color='#3399ff'/>
                        <div style={{maxHeight: "350px", height: "350px", overflow: "scroll"}}>
                        <table>
                            <tbody>
                                {empresas.map((e) => (<tr>
                                    <th style={rowStyle}>{empresaReturner(e.empresa_id,empresas,servicios)}</th></tr>))}
                            </tbody>
                        </table>
                        </div>
                        <div>
                            <h4 style={textStyle}>Crear Empresa - Servicio</h4>
                            <h4 style={textStyle}>Seleccione la empresa:</h4>
                            <select value={empname.emp} style={{width: "250px", textAlign: "left" }}
                            onChange={(e) => setEmpname({...empname ,emp: e.target.value})}>
                                <option value={""}>---</option>
                                {getEmpresasNames(empresas).map((e) => (
                                    <option value={e} key={e}>{e}</option>
                                ))}
                            </select>
                            <h4 style={textStyle}>Seleccione el servicio:</h4>
                            <select value={empname.srv} style={{width: "250px", textAlign: "left" }}
                            onChange={(e) => setEmpname({...empname ,srv: parseInt(e.target.value)})}>
                                <option value={""}>---</option>
                                {servicios.map((s) => (
                                    <option value={s.servicio_id} key={s.servicio_id}>{s.nombre}</option>
                                ))}
                            </select>
                            <div>
                                <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px", marginTop: "30px"}} onClick={() => createEmpresaServ()}>
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{width: "250px", textAlign: "left" }}>
                        <h3 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Tipo</h3>
                        <hr color='#3399ff'/>
                        <div style={{maxHeight: "350px", height: "350px", overflow: "scroll"}}>
                        <table>
                            <tbody>
                                {tipos.map((e) => (<tr>
                                    <th style={rowStyle}>{e}</th></tr>))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div style={{width: "400px", textAlign: "left" }}>
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
                        <h4 style={textStyle}>Agregar Servicio</h4>
                        <input type="text" value={newServicio} size={35} 
                        onChange={(e) => setNewServicio(e.target.value)}/>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px", marginTop: "30px"}} onClick={() => createServicio()}>
                            Agregar
                        </button>
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
