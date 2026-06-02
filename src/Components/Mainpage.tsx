import { useEffect, useState } from "react"
import sessionCheck from "../Utils/sessionCheck"
import Header from "./Header"
import { ICliente, IEmpresas, IEstados, IExpediente, IFilterPref, IServicio } from "../Utils/interface"
import { empresaReturner, estadoReturner, getClientes, getEmpresas, getEstadoName, getEstados, getExpedientes,getServicios } from "../Utils/getData"


export default function Mainpage () {

    const [empresas, setEmpresas] = useState<IEmpresas[]>([])
    const [estados, setEstados] = useState<IEstados[]>([])
    const [clientes, setClientes] = useState<ICliente[]>([])
    const [servicios, setServicios] = useState<IServicio[]>([])
    const [expedientes, setExpedientes] = useState<IExpediente[]>([])
    const [expedientesF, setExpedienteF] = useState<IExpediente[]>([])
    const [filter, setFilter] = useState<IFilterPref>({
        empresa: 0,
        estado: 0,
        periodo: '',
        servicio: 0,
        cliente: 0,
        start: '',
        end: '',
        ubicacion: '',
        oculto: false
    })

    const thTable: React.CSSProperties = {
        border: "1px solid", fontSize: "small"
    }
    const thTableBg: React.CSSProperties = {
        border: "1px solid", width: "20%", fontSize: "small"
    }


    const selectFilterBg: React.CSSProperties = {
        width: "auto"
    }

    const divFilter: React.CSSProperties = {
        margin: "8px"
    }
    useEffect(() => {
        sessionCheck()
        getEmpresas().then(e => setEmpresas(e))
        getEstados().then(es => setEstados(es))
        getServicios().then(s => setServicios(s))
        getExpedientes().then(ex => {
            setExpedientes(ex)
            setExpedienteF(ex.filter((exp) => !exp.ocultado))
        })
        getClientes().then(c => setClientes(c))
    },[])

    const filterAction = () => {
        let arr: IExpediente[] = expedientes
        if(filter.empresa){
            arr = arr.filter((e) => e.empresa_id === filter.empresa)
        }
        if(filter.estado){
            arr = arr.filter((e) => e.estado_id === filter.estado)
        }
        if(filter.servicio){
            arr = arr.filter((e) => e.service_id === filter.servicio)
        }
        if(filter.cliente){
            arr = arr.filter((e) => e.client_id === filter.cliente)
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
        const lastmod = exp.last_mod ? exp.last_mod.split("T")[0] : null
        const lastsaw = exp.last_saw ? exp.last_saw.split("T")[0] : null
        const now = new Date().toISOString().split("T")[0]
        if(lastmod && lastmod === now) return "LimeGreen"
        else if(lastsaw && lastsaw === now) return "LightSkyBlue"
    }

    const parsedPeriodo = (periodo: Date) => {
        const [year, month, _day] = periodo.toString().split("-")
        let mes = ""
        switch(month){
            case "01":
                mes = "Enero"
                break;
            case "02":
                mes = "Febrero"
                break;
            case "03":
                mes = "Marzo"
                break;
            case "04":
                mes = "Abril"
                break;
            case "05":
                mes = "Mayo"
                break;
            case "06":
                mes = "Junio"
                break;
            case "07":
                mes = "Julio"
                break;
            case "08":
                mes = "Agosto"
                break;
            case "09":
                mes = "Septiembre"
                break;
            case "10":
                mes = "Octubre"
                break;
            case "11":
                mes = "Noviembre"
                break;
            case "12":
                mes = "Diciembre"
                break;
            default:
                mes = "NaN"
        }
        return mes + " " + year
    }

    const servicioReturner = (service_id: number): string => {
        let serv = "NaN"
        servicios.forEach(s => {
            if(s.servicio_id === service_id) serv = s.nombre
        })
        return serv
    }

    const clienteReturner = (client_id: number): string => {
        let cliente = "NaN"
        clientes.forEach(c => {
            if(c.client_id === client_id) cliente = c.descripcion
        })
        return cliente
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
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Empresa</h5>
                    <select name="empresas" value={filter.empresa} style={selectFilterBg}
                    onChange={(e) => setFilter({...filter, empresa: parseInt(e.target.value)})}>
                        <option value={0}>---</option>
                        {empresas.map((e) => (
                            <option value={e.empresa_id}>{e.nombre}</option>
                        ))}
                    </select>
                </div>
                <div style={divFilter}>
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Servicio</h5>
                    <select name="servicios" value={filter.servicio} style={selectFilterBg}
                    onChange={(e) => setFilter({...filter, servicio: parseInt(e.target.value)})}>
                        <option value={0}>---</option>
                        {servicios.map((s) => (
                            <option value={s.servicio_id}>{s.nombre}</option>
                        ))}
                    </select>
                </div>
                <div style={divFilter}>
                    <h5 style={{fontWeight: "bold", color: "#3399ff"}}>Cliente</h5>
                    <select name="clientes" value={filter.cliente} style={selectFilterBg}
                    onChange={(e) => setFilter({...filter, cliente: parseInt(e.target.value)})}>
                        <option value={0}>---</option>
                        {clientes.map((c) => (
                            <option value={c.client_id}>{c.descripcion}</option>
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
                            <th style={thTable}>Empresa</th>
                            <th style={thTable}>Servicio</th>
                            <th style={thTable}>Cliente</th>
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
                                <th style={thTableBg}>{empresaReturner(ex.empresa_id,empresas)}</th>
                                <th style={thTable}>{servicioReturner(ex.service_id)}</th>
                                <th style={thTable}>{clienteReturner(ex.client_id)}</th>
                                <th style={thTable}>{parsedPeriodo(ex.periodo)}</th>
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