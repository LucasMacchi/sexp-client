import { useExpStore } from "../Store/expStore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IAddExp } from "../Utils/interface"
import meses from '../meses.json'
import './addexp.css'

export default function AddExp () {

    const navigator = useNavigate()
    const tipoFn = useExpStore(s => s.tiposFn)
    const ubiFn = useExpStore(s => s.ubiFn)
    const estadosFn = useExpStore(s => s.estadosFn)
    const serviciosFn = useExpStore(s => s.serviciosFn)
    const empresasFn = useExpStore(s => s.empresasFn)
    const createExp = useExpStore(s => s.createExpediente)
    const tipos = useExpStore(s => s.tipos)
    const ubicaciones = useExpStore(s => s.ubicaciones)
    const servicios = useExpStore(s => s.servicios)
    const empresas = useExpStore(s => s.empresas)
    const estados = useExpStore(s => s.estados)
    const [exp, setExp] = useState<IAddExp>({
        servicio_id: 0,
        numero_exp: '',
        concepto: '',
        periodo: '',
        fecha_presentacion: '',
        nro_factura: '',
        empresa_id: 0,
        estado_id: 0,
        importe: 0,
        descripcion: '',
        user_id: 0,
        tipo: '',
        ubicacion: ''
    })

    const empresaReturner = (id: number): string => {
        let name = 'NaN'
        empresas.forEach(e => {
            if(e.empresa_id === id) name = e.nombre+' - '+servicioReturner(e.servicio_id)
        });
        return name
    }

    const estadoReturner = (id: number): string => {
        let name = 'NaN'
        estados.forEach(e => {
            if(e.estado_id === id) name = e.concepto
        });
        return name
    }

    const servicioReturner = (id: number): string => {
        let name = 'NaN'
        servicios.forEach(e => {
            if(e.servicio_id === id) name = e.nombre
        });
        return name
    }
    const servicioIdReturner = (id: number): number => {
        let service_id = 0
        empresas.forEach(e => {
            if(e.empresa_id === id) service_id = e.servicio_id
        });
        return service_id
    }

    useEffect(() => {
        if(!localStorage.getItem('jwToken')){
            navigator('/login')
        }
        if(servicios.length === 0) serviciosFn()
        if(empresas.length === 0) empresasFn()
        if(estados.length === 0) estadosFn()
        if(tipos.length === 0 ) tipoFn()
        if(ubicaciones.length === 0 ) ubiFn()
    },[])
    useEffect(() => {
        handleExp(servicioIdReturner(exp.empresa_id),'servicio_id')
    },[exp.empresa_id])

    const handleExp = (value: number | string, prop: string) => {
        setExp({...exp, [prop]:value})
    }

    const createExpediente = async () => {
        if(exp.estado_id && exp.empresa_id && exp.fecha_presentacion && exp.numero_exp
            && exp.concepto) {
                if(confirm('¿Quieres crear un nuevo expediente?')) {
                    await createExp(exp)
                    setExp({
                        servicio_id: 0,
                        numero_exp: '',
                        concepto: '',
                        periodo: '',
                        fecha_presentacion: '',
                        nro_factura: '',
                        empresa_id: 0,
                        estado_id: 0,
                        importe: 0,
                        descripcion: '',
                        user_id: 0,
                        tipo: '',
                        ubicacion: ''
                    })
                }
            }
            else alert('Ingrese todos los campos.')
    }

    return(
        <div className="add-div">
            <h1 className="title-Homepage">Nuevo Expediente</h1>
            <hr color='#3399ff'/>
            <h3 className="filter-title">Concepto*</h3>
            <input className="textfield-big" value={exp.concepto} type="text" onChange={(e) => handleExp(e.target.value, 'concepto')}/>
            <h3 className="filter-title">Numero de Expediente*</h3>
            <input className="textfield-big" value={exp.numero_exp} type="text" onChange={(e) => handleExp(e.target.value, 'numero_exp')}/>
            <h3 className="filter-title">Numero de Factura</h3>
            <input className="textfield-small" value={exp.nro_factura} min={0} type="text" onChange={(e) => handleExp(e.target.value, 'nro_factura')}/>
            <h3 className="filter-title">Importe</h3>
            <input className="textfield-small" value={exp.importe} type="number" min={0} step={'0.01'} onChange={(e) => handleExp(parseFloat(e.target.value ), 'importe')}/>
            <div>
            <h3 className="filter-title">Empresa*</h3>
            <select className="textfield-big" value={exp.empresa_id} onChange={(e) => handleExp(parseInt(e.target.value),'empresa_id')}>
                <option value={0}>---</option>
                {empresas.map((e) => (
                    <option key={e.empresa_id} value={e.empresa_id}>{empresaReturner(e.empresa_id)}</option>
                ))}
            </select>
            </div>
            <div>
            <h3 className="filter-title">Estado*</h3>
            <select className="textfield-small" value={exp.estado_id} onChange={(e) => handleExp(parseInt(e.target.value),'estado_id')}>
                <option value={0}>---</option>
                {estados.map((e) => (
                    <option key={e.estado_id} value={e.estado_id}>{estadoReturner(e.estado_id)}</option>
                ))}
            </select>
            </div>
            <div>
                <h3 className="filter-title">Periodo*</h3>
                <select className="textfield-small" value={exp.periodo} onChange={(e) => handleExp(e.target.value,'periodo')}>
                    <option value={0}>---</option>
                    {meses.meses.map((e) => (   
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>
            </div>
            <div>
                <h3 className="filter-title">Fecha de presentacion*</h3>
                <input className="textfield-small" type="date" value={exp.fecha_presentacion} onChange={(e) => handleExp(e.target.value,'fecha_presentacion')}/>
            </div>
            <div>
                <h3 className="filter-title">Tipo*</h3>
                <select className="textfield-small" value={exp.tipo} onChange={(e) => handleExp(e.target.value,'tipo')}>
                    <option value={0}>---</option>
                    {tipos.map((e) => (   
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>
            </div>
            <div>
                <h3 className="filter-title">Ubicacion*</h3>
                <select className="textfield-small" value={exp.ubicacion} onChange={(e) => handleExp(e.target.value,'ubicacion')}>
                    <option value={0}>---</option>
                    {ubicaciones.map((e) => (   
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>
            </div>
            <div>
            <h4 className="exp-data-h">Comentarios:</h4>
                    <textarea className="textarea-exp" 
                    value={exp.descripcion} onChange={(e) => handleExp(e.target.value, 'descripcion')}/>
            </div>
            <div className="div-exp-btn">
                    <button className="btn-exp" onClick={() => navigator('/')}>Salir</button>
                    <button className="btn-exp" onClick={() => createExpediente()}>Crear</button>
            </div>
        </div>
    )
}