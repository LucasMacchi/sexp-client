import { useEffect, useState } from "react"
import sessionCheck from "../Utils/sessionCheck"
import Header from "./Header"
import { IEmpresas, IEstados, IExpediente, IFilterPref, IServicio } from "../Utils/interface"
import { empresaReturner, estadoReturner, getEmpresas, getEstadoName, getEstados, getExpedientes, getMeses, getServicios } from "../Utils/getData"


export default function Mainpage () {

    const [empresas, setEmpresas] = useState<IEmpresas[]>([])
    const [servicios, setServicios] = useState<IServicio[]>([])
    const [estados, setEstados] = useState<IEstados[]>([])
    const [meses, setMeses] = useState<string[]>([])
    const [expedientes, setExpedientes] = useState<IExpediente[]>([])
    const [expedientesF, setExpedienteF] = useState<IExpediente[]>([])
    const [filter, setFilter] = useState<IFilterPref>({
        empresa: 0,
        estado: 0,
        periodo: '',
        start: '',
        end: '',
        ubicacion: '',
        oculto: false
    })

    const thTable: React.CSSProperties = {
        border: "1px solid", padding: "5px"
    }
    const thTableBg: React.CSSProperties = {
        border: "1px solid", width: "20%", padding: "5px"
    }

    const selectFilter: React.CSSProperties = {
        width: "100px"
    }

    const selectFilterBg: React.CSSProperties = {
        width: "300px"
    }

    const divFilter: React.CSSProperties = {
        margin: "15px"
    }
    useEffect(() => {
        sessionCheck()
        getEmpresas().then(e => setEmpresas(e))
        getEstados().then(es => setEstados(es))
        getServicios().then(se => setServicios(se))
        getExpedientes().then(ex => {
            setExpedientes(ex)
            setExpedienteF(ex.filter((exp) => !exp.ocultado))
        })
        setMeses(getMeses())
    },[])

    const filterAction = () => {
        let arr: IExpediente[] = expedientes
        if(filter.empresa){
            arr = arr.filter((e) => e.empresa_id === filter.empresa)
        }
        if(filter.estado){
            arr = arr.filter((e) => e.estado_id === filter.estado)
        }
        if(filter.periodo){
            arr = arr.filter((e) => e.periodo === filter.periodo)
        }
        if(filter.start){
            const startD = new Date(filter.start)
            arr = arr.filter((e) => {
                const date = new Date(e.fecha_presentacion)
                if(date >= startD) return e
            })
        }
        if(filter.end){
            const endD = new Date(filter.end)
            arr = arr.filter((e) => {
                const date = new Date(e.fecha_presentacion)
                if(date <= endD) return e
            })
        }
        if(!filter.oculto) arr = arr.filter((ex) => ex.ocultado === false)
        setExpedienteF(arr)
    }

    const colorChangeCheck = (exp: IExpediente) => {
        const lastmod = exp.last_mod ? new Date(exp.last_mod) : null
        const lastsaw = exp.last_saw ? new Date(exp.last_saw) : null
        console.log(lastsaw)
        console.log(exp.last_saw)
        console.log(new Date().toDateString())
        if(lastmod && lastmod.toDateString() === new Date().toDateString()) return "LimeGreen"
        else if(lastsaw && lastsaw.toDateString() === new Date().toDateString()) return "LightSkyBlue"
    }

    return(
        <div >
            <Header />
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "1800px"}}>
            <div>
                <h1 id="titulo" style={{fontWeight: "bold", color: "#3399ff"}}>Expedientes</h1>
                <hr color='#3399ff'/>
            </div>
            <div style={{display: "flex", marginBottom: "50px", alignItems: "flex-end"}}>
                <div style={divFilter}>
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Empresa y Servicio</h5>
                    <select name="empresas" value={filter.empresa} style={selectFilterBg}
                    onChange={(e) => setFilter({...filter, empresa: parseInt(e.target.value)})}>
                        <option value={0}>---</option>
                        {empresas.map((e) => (
                            <option value={e.empresa_id}>{empresaReturner(e.empresa_id, empresas, servicios)}</option>
                        ))}
                    </select>
                </div>
                <div style={divFilter}>
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Estado</h5>
                    <select name="empresas" value={filter.estado} style={selectFilterBg}
                    onChange={(e) => setFilter({...filter, estado: parseInt(e.target.value)})}>
                        <option value={0}>---</option>
                        {estados.map((e) => (
                            <option value={e.estado_id}>{estadoReturner(e.estado_id, estados)}</option>
                        ))}
                    </select>
                </div>
                <div style={divFilter}>
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Periodo</h5>
                    <select name="empresas" value={filter.periodo} style={selectFilter}
                    onChange={(e) => setFilter({...filter, periodo: e.target.value})}>
                        <option value={0}>---</option>
                        {meses.map((e) => (
                            <option value={e}>{e}</option>
                        ))}
                    </select>
                </div>
                <div style={divFilter}>
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Fecha Inicio</h5>
                    <input type="date" value={filter.start} onChange={(e) => setFilter({...filter, start: e.target.value})}/>
                </div>
                <div style={divFilter}>
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Fecha Final</h5>
                    <input type="date" value={filter.end} onChange={(e) => setFilter({...filter, end: e.target.value})}/>
                </div>
                <div style={divFilter}>
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Mostrar Ocultos</h5>
                    <input type="checkbox" checked={filter.oculto} onChange={(e) => setFilter({...filter, oculto: e.target.checked})}/>
                </div>
                <div style={divFilter}>
                    <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "130px"}}
                    onClick={() => filterAction()}>
                        Filtrar
                    </button>
                </div>
            </div>
            <div >
                <table >
                    <tbody>
                        <tr>
                            <th style={thTable}>Nro Expediente</th>
                            <th style={thTableBg}>Concepto</th>
                            <th style={thTable}>Empresa/Servicio</th>
                            <th style={thTable}>Periodo</th>
                            <th style={thTable}>Fecha Presentacion</th>
                            <th style={thTable}>Fecha Modificacion</th>
                            <th style={thTable}>Estado</th>
                            <th style={thTable}>Nro Factura</th>
                            <th style={thTable}>Importe</th>
                        </tr>
                        {expedientesF.map((ex) => (
                            <tr key={ex.exp_id} onClick={() => window.location.href = "/expediente/"+ex.exp_id} style={{backgroundColor: colorChangeCheck(ex)}}>
                                <th style={thTable}>{ex.numero_exp}</th>
                                <th style={thTableBg}>{ex.concepto}</th>
                                <th style={thTableBg}>{empresaReturner(ex.empresa_id,empresas,servicios)}</th>
                                <th style={thTable}>{ex.periodo}</th>
                                <th style={thTable}>{ex.fecha_presentacion.split("T")[0]}</th>
                                <th style={thTable}>{ex.fecha_ult_mod.split("T")[0]}</th>
                                <th style={thTable}>{getEstadoName(estados, ex.estado_id)}</th>
                                <th style={thTable}>{ex.nro_factura ? ex.nro_factura : "-"}</th>
                                <th style={thTable}>{ex.importe ? "$"+ex.importe.toString() : "$"+0}</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>

        </div>
    )
}