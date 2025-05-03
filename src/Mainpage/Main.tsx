import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useExpStore } from "../Store/expStore"
import './Main.css'
import { IExpediente, IFilterPref, IModExp, IUser } from "../Utils/interface"
import tokenExpireCheck from "../Utils/tokenExpireCheck"
import { jwtDecode } from "jwt-decode"
import { useUserStore } from "../Store/userStore"

export default function Main () {

    const navigator = useNavigate()
    const tipoFn = useExpStore(s => s.tiposFn)
    const ubiFn = useExpStore(s => s.ubiFn)
    const modExpFn = useExpStore(s => s.modExpediente)
    const estadosFn = useExpStore(s => s.estadosFn)
    const serviciosFn = useExpStore(s => s.serviciosFn)
    const empresasFn = useExpStore(s => s.empresasFn)
    const userEmpresaFn = useUserStore(s => s.empresaFn)
    const expedientes = useExpStore(s => s.expedientes)
    const servicios = useExpStore(s => s.servicios)
    const empresas = useExpStore(s => s.empresas)
    const estados = useExpStore(s => s.estados)
    const meses = useExpStore(s => s.meses)
    const tipos = useExpStore(s => s.tipos)
    const ubicaciones = useExpStore(s => s.ubicaciones)
    const [editMode, setEdit] = useState(false)
    const [save, setSave] = useState(0)
    const [modComment, setComment] = useState(``)
    const [exp, setExp] = useState<IExpediente>()
    const [exp_id, setExpId] = useState(0)
    const [modEstado, setEstado] = useState(0)
    const [modDate, setDate] = useState('')
    const [modImporte, setModImporte] = useState(0)
    const [modExpNro, setModExpNro] = useState('')
    const [modNroF, setModNroF] = useState('')
    const [modInvitacion, setModInvitacion] = useState(false)
    const [modOrdenCompra, setModOrdenCompra] = useState(false)
    const [modUbicacion, setModUbicacion] = useState('')
    const [modDateFac, setModDateFac] = useState('')
    const [modTesoreria, setTesoreria] = useState('')
    const [filter, setFilter] = useState<IFilterPref>({
        empresa: 0,
        estado: 0,
        periodo: '',
        start: '',
        end: '',
        ubicacion: ''
    })
    const expedientesFn = useExpStore(s => s.expedientesFn)

    const handleFilter = (value: number | string, prop: string) => {
        setFilter({...filter, [prop]:value})
    }

    useEffect(() => {
        if(!localStorage.getItem('jwToken')){
            navigator('/login')
        }
        if(tokenExpireCheck()) {
            localStorage.removeItem('jwToken')
            window.location.reload()
        }
        if(servicios.length === 0) serviciosFn()
        if(empresas.length === 0) empresasFn()
        if(estados.length === 0) estadosFn()
        if(expedientes.length === 0 ) expedientesFn()
        if(tipos.length === 0 ) tipoFn()
        if(ubicaciones.length === 0 ) ubiFn()
        
    },[])

    useEffect(() => {
        const token = localStorage.getItem('jwToken')
        const userData:IUser = jwtDecode(token ? token : '')
        const credential = userData.credentials[0].empresa_id
        let empresa = ''
        empresas.forEach(e => {
            if(e.empresa_id === credential) empresa = e.nombre
        });
        userEmpresaFn(empresa)
    },[empresas])

    useEffect(() => {
        if(editMode && exp){
            setModImporte(exp.importe)
            setModExpNro(exp.numero_exp)
            setModNroF(exp.nro_factura)
            setModOrdenCompra(exp.orden_compra)
            setModInvitacion(exp.invitacion)
            setDate(dateReturner(exp.fecha_ult_mod, true))
            setEstado(exp.estado_id)
            setComment(exp.descripcion)
            setModUbicacion(exp.ubicacion)
            setModDateFac(exp.fecha_facturacion ? dateReturner(exp.fecha_facturacion, true) : '')
            setTesoreria(exp.fecha_tesoreria ? dateReturner(exp.fecha_tesoreria, true) : '')
        }
    },[editMode])

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
                end: '',
                ubicacion: ''
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
        if(filter.periodo) arr = arr.filter((e) => e.periodo === filter.periodo)
        if(filter.ubicacion) arr = arr.filter((e) => e.ubicacion === filter.ubicacion)
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
                ultima_mod: modDate !== exp.fecha_ult_mod ? modDate : '',
                estado_id: modEstado !== exp.estado_id ? modEstado : 0,
                descripcion: modComment !== exp.descripcion ? modComment : '',
                numero_exp: modExpNro !== exp.numero_exp ? modExpNro : '',
                importe: modImporte !== exp.importe ? modImporte : 0,
                nro_factura: modNroF !== exp.nro_factura ? modNroF : '',
                invitacion: modInvitacion !== exp.invitacion ? modInvitacion : exp.invitacion,
                orden_compra: modOrdenCompra !== exp.orden_compra ? modOrdenCompra : exp.orden_compra,
                ubicacion: modUbicacion !== exp.ubicacion ? modUbicacion : '',
                fecha_facturacion: modDateFac !== exp.fecha_facturacion ? modDateFac : '',
                fecha_tesoreria: modTesoreria !== exp.fecha_tesoreria ? modTesoreria : ''

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
                        <select value={filter.periodo} onChange={(e) => handleFilter(e.target.value,'periodo')}>
                            <option value={''}>---</option>
                            {meses.map((e) => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h6 className="filter-title">Ubicaciones</h6>
                        <select value={filter.ubicacion} onChange={(e) => handleFilter(e.target.value,'ubicacion')}>
                            <option value={0}>---</option>
                            {ubicaciones.map((e) => (
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
                    <div className="input-div-register">
                        <label className="label-form-register">Modo edicion</label>
                        <input type="checkbox" checked={editMode} onChange={(e) => setEdit(e.target.checked)}/>
                    </div>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Numero de Expediente:</h4>
                    {editMode ?
                        <input className="textfield-small" value={modExpNro} type="text" 
                        onChange={(e) => setModExpNro(e.target.value)}/>
                    :
                    <h4 className="exp-data-h">{exp.numero_exp}</h4>
                    }
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Concepto:</h4>
                    <h4 className="exp-data-h">{exp.concepto}</h4>
                    <hr color='#3399ff'/>
                    <div>
                    <h4 className="exp-data-h">Estado:</h4>
                    {editMode ?
                        <select value={modEstado} onChange={(e) => setEstado(parseInt(e.target.value))}>
                        {estados.map((e) => (
                            <option key={e.estado_id} value={e.estado_id}>{estadoReturner(e.estado_id)}</option>
                        ))}
                    </select>
                    : 
                    <h4 className="exp-data-h">{estadoReturner(exp.estado_id)}</h4>
                    }
                    </div>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Periodo:</h4>
                    <h4 className="exp-data-h">{exp.periodo}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Fecha de presentacion:</h4>
                    <h4 className="exp-data-h">{dateReturner(exp.fecha_presentacion, false)}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Ultima Modificacion:</h4>
                    {editMode ? 
                    <input type="date" min={exp.fecha_ult_mod ? dateReturner(exp.fecha_ult_mod, true) : dateReturner(exp.fecha_presentacion, true)} value={modDate} onChange={(e) => setDate(e.target.value)}/>
                    :
                    <h4 className="exp-data-h">{dateReturner(exp.fecha_ult_mod, false)}</h4>
                    }
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Fecha Facturacion:</h4>
                    {editMode ? 
                    <input type="date" value={modDateFac} onChange={(e) => setModDateFac(e.target.value)}/>
                    :
                    <h4 className="exp-data-h">{exp.fecha_facturacion ? dateReturner(exp.fecha_facturacion, false) : 'NaN'}</h4>
                    }
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Fecha de Tesoreria:</h4>
                    {editMode ? 
                    <input type="date" value={modTesoreria} onChange={(e) => setTesoreria(e.target.value)}/>
                    :
                    <h4 className="exp-data-h">{exp.fecha_tesoreria ? dateReturner(exp.fecha_tesoreria, false) : 'NaN'}</h4>
                    }
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Numero de factura:</h4>
                    {editMode ?
                    <input className="textfield-small" value={modNroF} type="text" 
                    onChange={(e) => setModNroF(e.target.value)}/>
                    :
                    <h4 className="exp-data-h">{exp.nro_factura}</h4>
                    }
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Importe:</h4>
                    {editMode ?
                    <input className="textfield-small" value={modImporte} type="number" min={0} step={'0.01'} 
                    onChange={(e) => setModImporte(parseFloat(e.target.value))}/>
                    :
                    <h4 className="exp-data-h">{'$'+exp.importe}</h4>
                    }
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Empresa y Servicio:</h4>
                    <h4 className="exp-data-h">{empresaReturner(exp.empresa_id)}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Tipo:</h4>
                    <h4 className="exp-data-h">{exp.tipo}</h4>
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Ubicacion:</h4>
                    {editMode ?
                        <select value={modUbicacion} onChange={(e) => setModUbicacion(e.target.value)}>
                        {ubicaciones.map((e) => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                    : 
                    <h4 className="exp-data-h">{exp.ubicacion}</h4>
                    }
                    <hr color='#3399ff'/>
                    {editMode ? 
                    <div className="input-div-register">
                        <label className="label-form-register">Invitacion: </label>
                        <input type="checkbox" checked={modInvitacion} onChange={(e) => setModInvitacion(e.target.checked)}/>
                    </div>  
                    :
                    <h4 className="exp-data-h">Invitacion: {exp.invitacion ? 'Si' : 'No'}</h4>
                    }
                    <hr color='#3399ff'/>
                    {editMode ? 
                    <div className="input-div-register">
                        <label className="label-form-register">Orden de Compra: </label>
                        <input type="checkbox" checked={modOrdenCompra} onChange={(e) => setModOrdenCompra(e.target.checked)}/>
                    </div>  
                    :
                    <h4 className="exp-data-h">Orden de Compra: {exp.orden_compra ? 'Si' : 'No'}</h4>
                    }
                    <hr color='#3399ff'/>
                    <h4 className="exp-data-h">Comentarios:</h4>
                    <hr color='#3399ff'/>
                    {editMode ? 
                    <textarea className="textarea-exp" 
                    value={modComment} onChange={(e) => setComment(e.target.value)}/>
                    :
                    <p className="description-exp">
                        {exp.descripcion}
                    </p>
                    }
                    
                    <div className="div-exp-btn">
                        <button className="btn-exp" onClick={() => setExpId(0)}>Salir</button>
                        <button className={editMode ? "btn-exp" : 'delete-column'} onClick={() => editExp()}>Modificar</button>
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
                        <th className={deleteColumn("table-exp-column-top")}>Tipo</th>
                        <th className={deleteColumn("table-exp-column-top")}>Ubicacion</th>
                        <th className={deleteColumn("table-exp-column-top")}>Presentacion</th>
                        <th className="table-exp-column-top">Empresa</th>
                        <th className={deleteColumn("table-exp-column-top")}>Estado</th>
                    </tr>
                    {filterExp().map((e) => (
                        <tr 
                        onClick={() => {setExpId(e.exp_id); setExp(e)}} 
                        key={e.exp_id}>
                            <th className="table-exp-column">{e.numero_exp}</th>
                            <th className="table-exp-column">{e.concepto}</th>
                            <th className={deleteColumn("table-exp-column")}>{e.periodo}</th>
                            <th className={deleteColumn("table-exp-column")}>{e.tipo}</th>
                            <th className={deleteColumn("table-exp-column")}>{e.ubicacion}</th>
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
            <h1 className="title-Homepage">{'Expedientes'}</h1>
            <hr color='#3399ff'/>
            {filterDisplayer()}
            {detailExp()}
        </div>
    )
}