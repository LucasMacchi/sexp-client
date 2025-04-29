import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useExpStore } from "../Store/expStore"
import { jwtDecode } from "jwt-decode"
import { IUser } from "../Utils/interface"
import './data.css'

export default function DataPage () {

    const navigator = useNavigate()
    const serviciosFn = useExpStore(s => s.serviciosFn)
    const empresasFn = useExpStore(s => s.empresasFn)
    const estadosFn = useExpStore(s => s.estadosFn)
    const createServiceFn = useExpStore(s => s.createServiceFn)
    const createEstadoFn = useExpStore(s => s.createEstadoFn)
    const createEmpresaFn = useExpStore(s => s.createEmpresaFn)
    const servicios = useExpStore(s => s.servicios)
    const empresas = useExpStore(s => s.empresas)
    const estados = useExpStore(s => s.estados)
    const [menu, setMenu] = useState(0)
    const [empresaNew, setEmpresa] = useState('')
    const [serviceId, setService] = useState(0)
    const [serviceNew, setServiceNew] = useState('')
    const [estadoNew, setEstadoNew] = useState('')
    const tipos = useExpStore(s => s.tipos)
    const ubicaciones = useExpStore(s => s.ubicaciones)
    const tipoFn = useExpStore(s => s.tiposFn)
    const ubiFn = useExpStore(s => s.ubiFn)


    useEffect(() => {
        const token = localStorage.getItem('jwToken')
        const userData:IUser = jwtDecode(token ? token : '')
        if(!userData.admin) navigator('/')
        if(servicios.length === 0) serviciosFn()
        if(empresas.length === 0) empresasFn()
        if(estados.length === 0) estadosFn()
        if(tipos.length === 0 ) tipoFn()
        if(ubicaciones.length === 0 ) ubiFn()
    },[])
    useEffect(() => {
        setServiceNew('')
        setEmpresa('')
        setService(0)
    },[menu])

    const servicioReturner = (id: number): string => {
        let name = 'NaN'
        servicios.forEach(e => {
            if(e.servicio_id === id) name = e.nombre
        });
        return name
    }

    const createEmpresaServicio = async () => {
        if(confirm('¿Quieres crear una nueva empresa '+empresaNew+' ?')) await createEmpresaFn(empresaNew, serviceId)
    }

    const createServicio = async () => {
        if(confirm('¿Quieres crear un nuevo servicio '+serviceNew+' ?')) await createServiceFn(serviceNew)
    }

    const createEstado = async () => {
        if(confirm('¿Quieres crear un nuevo estado '+estadoNew+' ?')) await createEstadoFn(estadoNew)
    }

    const postDisplayer = () => {
        switch(menu) {
            case 1:
                return(
                <div>
                    <h5 className="text-body">Escriba el servicio a agregar</h5>
                    <input type="text" value={serviceNew} onChange={(e) => setServiceNew(e.target.value)}/>
                    <button onClick={() => createServicio()} className="filter-btn-save">Crear</button>

                </div>
                )
            case 2:
                return (
                    <div>
                    <h5 className="text-body">Seleccione la empresa</h5>
                        <div>
                        <select className="textfield-small" value={empresaNew} 
                        onChange={(e) => setEmpresa(e.target.value)}>
                            <option value={0}>---</option>
                            {formatedEmpresas().map((e) => (
                                <option value={e}>{e}</option>
                            ))}
                        </select>
                        </div>
                        <h5 className="text-body">Seleccione el servicio</h5>
                        <div>
                            <select className="textfield-small" value={serviceId}
                            onChange={(e) => setService(parseInt(e.target.value))}>
                                <option value={0}>---</option>
                                {servicios.map((s) => (
                                    <option value={s.servicio_id}>{s.nombre}</option>
                                ))}
                        </select> 
                        </div>
                        <button onClick={() => createEmpresaServicio()} className="filter-btn-save">Crear</button>
                    </div>
                )
            case 3:
                return (
                    <div>
                        <h5 className="text-body">Escriba el estado a agregar</h5>
                        <input type="text" value={estadoNew} onChange={(e) => setEstadoNew(e.target.value)}/>
                        <button onClick={() => createEstado()} className="filter-btn-save">Crear</button>
                    </div>
                )
            default:
                return(<h5 className="text-body">Seleccione una opcion</h5>)
        }
    }

    const formatedEmpresas = (): string[] => {
        const set = new Set(empresas.map((e) => e.nombre))
        const finalarray = Array.from(set)
        return finalarray
    }

    return(
        <div>
            <h1 className="title-Homepage">Datos</h1>
            <hr color='#3399ff'/>
            <div>
            <h3 className="title-Homepage">Empresas Registradas</h3>
            <table className="table-exp">
                <tbody>
                    <tr>
                        <th className="table-exp-column-top">Nombre Empresa</th>
                    </tr>
                    {formatedEmpresas().map((e) => {
                        return(
                            <tr key={e}>
                                <th className="table-exp-column">{e}</th>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
            </div>
            <div>
            <h3 className="title-Homepage">Servicios Registrados</h3>
            <table className="table-exp">
                <tbody>
                    <tr>
                        <th className="table-exp-column-top">Nombre Servicio</th>
                    </tr>
                    {servicios.map((e) => {
                        return(
                            <tr key={e.servicio_id}>
                                <th className="table-exp-column">{e.nombre}</th>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
            </div>
            <div>
            <h3 className="title-Homepage">Empresa - Serivicio Registrados</h3>
            <table className="table-exp">
                <tbody>
                    <tr>
                        <th className="table-exp-column-top">Empresa</th>
                        <th className="table-exp-column-top">Servicio</th>
                    </tr>
                    {empresas.map((e) => {
                        return(
                            <tr key={e.empresa_id}>
                                <th className="table-exp-column">{e.nombre}</th>
                                <th className="table-exp-column">{servicioReturner(e.servicio_id)}</th>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
            </div>
            <div>
            <h3 className="title-Homepage">Estados Registrados</h3>
            <table className="table-exp">
                <tbody>
                    {estados.map((e) => {
                        return(
                            <tr key={e.estado_id}>
                                <th className="table-exp-column">{e.concepto}</th>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
            </div>
            <div>
            <h3 className="title-Homepage">Tipos Registrados</h3>
            <table className="table-exp">
                <tbody>
                    {tipos.map((e) => {
                        return(
                            <tr key={e}>
                                <th className="table-exp-column">{e}</th>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
            </div>
            <div>
            <h3 className="title-Homepage">Ubicaciones Registradas</h3>
            <table className="table-exp">
                <tbody>
                    {ubicaciones.map((e) => {
                        return(
                            <tr key={e}>
                                <th className="table-exp-column">{e}</th>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
            </div>
            <div>
                <h3 className="title-Homepage">Añadir datos</h3>
                <select name="type-choose" className="textfield-small" 
                onChange={(e) => setMenu(parseInt(e.target.value))}>
                    <option value={0}>---</option>
                    <option value={1}>Servicio</option>
                    <option value={2}>Empresa-Servicio</option>
                    <option value={3}>Estado</option>
                </select>
            </div>
            {postDisplayer()}
        </div>
    )

}