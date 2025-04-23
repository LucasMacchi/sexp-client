import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useExpStore } from "../Store/expStore"
import './Main.css'
import { IExpediente, IFilterPref, IModExp } from "../Utils/interface"

export default function Main () {

    const navigator = useNavigate()
    const modExpFn = useExpStore(s => s.modExpediente)
    const estadosFn = useExpStore(s => s.estadosFn)
    const serviciosFn = useExpStore(s => s.serviciosFn)
    const empresasFn = useExpStore(s => s.empresasFn)
    const expedientes = useExpStore(s => s.expedientes)
    const servicios = useExpStore(s => s.servicios)
    const empresas = useExpStore(s => s.empresas)
    const estados = useExpStore(s => s.estados)
    const meses = useExpStore(s => s.meses)
    const [save, setSave] = useState(0)
    const [modComment, setComment] = useState(``)
    const [exp, setExp] = useState<IExpediente>()
    const [exp_id, setExpId] = useState(0)
    const [modEstado, setEstado] = useState(0)
    const [modDate, setDate] = useState('')
    const [filter, setFilter] = useState<IFilterPref>({
        empresa: 0,
        estado: 0,
        periodo: '',
        start: '',
        end: ''
    })
    const expedientesFn = useExpStore(s => s.expedientesFn)

    const handleFilter = (value: number | string, prop: string) => {
        setFilter({...filter, [prop]:value})
    }

    useEffect(() => {
        if(!localStorage.getItem('jwToken')){
            navigator('/login')
        }
        if(servicios.length === 0) serviciosFn()
        if(empresas.length === 0) empresasFn()
        if(estados.length === 0) estadosFn()
        if(expedientes.length === 0 ) expedientesFn()
    },[])

    const saveFilter = () => {
        const storeName = 'filter'+save
        localStorage.setItem(storeName, JSON.stringify(filter))
    }

    useEffect(() => {
        const storeName = 'filter'+save
        if(save === 0) {
            setFilter({        
                empresa: 0,
                estado: 0,
                periodo: '',
                start: '',
                end: ''
            })
        }
        else {
            const filterStore = localStorage.getItem(storeName)
            if(filterStore){
                const data: IFilterPref = JSON.parse(filterStore)
                setFilter(data)
            }
        }
    },[save])

    const filterExp = (): IExpediente[] => {
        let arr = expedientes
        if(filter.estado) arr = arr.filter((e) => e.estado_id === filter.estado)
        if(filter.empresa) arr = arr.filter((e) => e.empresa_id === filter.empresa)
        if(filter.start) {
            const date = new Date(filter.start)
            arr = arr.filter((e) => {
                const exdate = new Date(e.fecha_presentacion)
                if(exdate >= date) return e
            })
        }
        if(filter.end) {
            const date = new Date(filter.end)
            arr = arr.filter((e) => {
                const exdate = new Date(e.fecha_presentacion)
                if(exdate <= date) return e
            })
        }
        return arr
    }

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

    const dateReturner = (date: string, input: boolean): string => {
        const dateFormat = new Date(date)
        const fecha = dateFormat.getDate() < 10 ? '0' + (dateFormat.getDate()) : (dateFormat.getDate())
        const mes = dateFormat.getMonth() < 10 ? '0' + (dateFormat.getMonth() + 1) : (dateFormat.getMonth() + 1)
        if(input){
            return dateFormat.getFullYear()+'-'+mes +'-'+fecha
        }
        else return fecha+'/'+mes +'/'+dateFormat.getFullYear()
        
    }

    const editExp = async () =>   {
        if(confirm('¿Quiere modificar el expediente?') && exp?.exp_id){
            const data: IModExp = {
                ultima_mod: modDate ? modDate : '',
                estado_id: modEstado ? modEstado : 0,
                descripcion: modComment ? modComment : ''
            }
            await modExpFn(data, exp.exp_id)
            navigator('/')
            window.location.reload()
        }
    }

    const deleteColumn = (currentClass: string):string => {
        if(window.innerWidth < 1000) return 'delete-column'
        else return currentClass
    }

    const filterDisplayer = () => {
        if(!exp_id) {
            return(
                <div className={deleteColumn("div-filter")}>
                    <h5 className="title-Homepage">Filtro:</h5>
                    <div>
                        <h6 className="filter-title">Guardados</h6>
                        <select value={save} onChange={(e) => setSave(parseInt(e.target.value))}>
                            <option value={0}>---</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>
                    <div>
                        <h6 className="filter-title">Estado</h6>
                        <select value={filter.estado} onChange={(e) => handleFilter(parseInt(e.target.value),'estado')}>
                            <option value={0}>---</option>
                            {estados.map((e) => (
                                <option key={e.estado_id} value={e.estado_id}>{estadoReturner(e.estado_id)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h6 className="filter-title">Empresa</h6>
                        <select value={filter.empresa} onChange={(e) => handleFilter(parseInt(e.target.value),'empresa')}>
                            <option value={0}>---</option>
                            {empresas.map((e) => (
                                <option key={e.empresa_id} value={e.empresa_id}>{empresaReturner(e.empresa_id)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h6 className="filter-title">Periodo</h6>
                        <select value={filter.periodo} onChange={(e) => handleFilter(parseInt(e.target.value),'servicio')}>
                            <option value={0}>---</option>
                            {meses.map((e) => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h6 className="filter-title">Fecha inicio</h6>
                        <input type="date" value={filter.start} onChange={(e) => handleFilter(e.target.value, 'start')}/>
                    </div>
                    <div>
                        <h6 className="filter-title">Fecha Fin</h6>
                        <input type="date" value={filter.end} onChange={(e) => handleFilter(e.target.value, 'end')}/>
                    </div>
                    <div>
                    <h6 className="filter-title">Guardar filtro</h6>
                        <button onClick={() => saveFilter()} className="filter-btn-save">Guardar</button>
                    </div>
                </div>
            )
        }
    }

    const detailExp = () => {
        if(exp_id && exp) {
            return(
                <div className="div-exp-detail">
                    <h4 className="exp-data-h">Concepto:</h4>
                    <h4 className="exp-data-h">{exp.concepto}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Estado:
                        <select value={modEstado} onChange={(e) => setEstado(parseInt(e.target.value))}>
                            {estados.map((e) => (
                                <option key={e.estado_id} value={e.estado_id}>{estadoReturner(e.estado_id)}</option>
                            ))}
                        </select>
                    </h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Periodo:</h4>
                    <h4 className="exp-data-h">{exp.periodo}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Fecha de presentacion:</h4>
                    <h4 className="exp-data-h">{dateReturner(exp.fecha_presentacion, false)}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Ultima Modificacion: {dateReturner(exp.fecha_ult_mod, false)}</h4>
                    <input type="date" value={modDate} onChange={(e) => setDate(e.target.value)}/>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Numero de factura:</h4>
                    <h4 className="exp-data-h">{exp.nro_factura}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Importe:</h4>
                    <h4 className="exp-data-h">{'$'+exp.importe}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Empresa y Servicio:</h4>
                    <h4 className="exp-data-h">{empresaReturner(exp.empresa_id)}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Comentarios:</h4>
                    <textarea className="textarea-exp" 
                    value={modComment} onChange={(e) => setComment(e.target.value)}/>
                    <div className="div-exp-btn">
                        <button className="btn-exp" onClick={() => setExpId(0)}>Salir</button>
                        <button className="btn-exp" onClick={() => editExp()}>Modificar</button>
                    </div>
                </div>
            )
        }
        else{
            return(
                <table className="table-exp">
                <tbody>
                    <tr>
                        <th className="table-exp-column-top">Nº Exp</th>
                        <th className="table-exp-column-top">Concepto</th>
                        <th className={deleteColumn("table-exp-column-top")}>Periodo</th>
                        <th className={deleteColumn("table-exp-column-top")}>Presentacion</th>
                        <th className="table-exp-column-top">Empresa</th>
                        <th className={deleteColumn("table-exp-column-top")}>Estado</th>
                    </tr>
                    {filterExp().map((e) => (
                        <tr 
                        onClick={() => {setExpId(e.exp_id);
                        setExp(e);
                        setEstado(e.estado_id);
                        setDate(dateReturner(e.fecha_ult_mod || '', true));
                        setComment(e.descripcion)
                        }} 
                        key={e.exp_id}>
                            <th className="table-exp-column">{e.numero_exp}</th>
                            <th className="table-exp-column">{e.concepto}</th>
                            <th className={deleteColumn("table-exp-column")}>{e.periodo}</th>
                            <th className={deleteColumn("table-exp-column")}>{dateReturner(e.fecha_presentacion, false)}</th>
                            <th className="table-exp-column">{empresaReturner(e.empresa_id)}</th>
                            <th className={deleteColumn("table-exp-column")}>{estadoReturner(e.estado_id)}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
            )
        }
    }
    
    return(
        <div>
            <h1 className="title-Homepage">{exp_id ? 'Expediente '+exp?.numero_exp : 'Expedientes'}</h1>
            <hr color='#3399ff'/>
            {filterDisplayer()}
            {detailExp()}
        </div>
    )
}