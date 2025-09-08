import { useEffect, useState } from "react";
import Header from "./Header";
import { IConcepto, IProveedor, ITicket, ITxtData, ITxtDto } from "../Utils/interface";
import sessionCheck from "../Utils/sessionCheck";
import { createTicketFn, getConceptos, getProveedores, getTicketsFn, getTicketsTxtFn } from "../Utils/getData";
import downloadTxt from "../Utils/downloadTxt";

export default function Tickets () {

    const [proveedores, setProveedores] = useState<IProveedor[]>([])
    const [conceptos, setConceptos] = useState<IConcepto[]>([])
    const [tickets, setTickets] = useState<ITicket[]>([])
    const [ticket, setTicket] = useState<ITicket>({
        fecha: "",
        comprobante: "TIK",
        tipo: "A",
        pv: "",
        nro: "",
        prov_cuit: 0,
        prov_name: "",
        prov_cod: 0,
        provsiv_cod: 0,
        proprv_codigo: 0,
        neto: 0,
        ivapor: 21.0,
        iva: 0,
        total: 0,
        concepto: "",
        concepto_cod: "",
        samabe: false
    })
    const [conceptoId, setConceptoId] = useState(99)
    const [provId, setProvId] = useState(99)
    const [txtData, setTxtData] = useState<ITxtDto>({fechaFin:"",fechaInicio:"",cco:"0900006", samabe: false})

    useEffect(() => {
        sessionCheck()
        getProveedores().then(prv => setProveedores(prv))
        getConceptos().then(conc => setConceptos(conc))
        getTicketsFn().then(tks => setTickets(tks))
    },[])

    useEffect(() => {
        if(ticket.neto) {
            const iva = ticket.neto * ticket.ivapor / 100
            const total = ticket.neto + iva
            setTicket({...ticket, total: parseFloat(total.toFixed(2)), iva: Math.round(iva*100) / 100})
        }

    },[ticket.neto])
    
    useEffect(() => {
        if(conceptoId > 0 && conceptoId < 50 && conceptos[conceptoId]){
            setTicket({...ticket, ivapor: conceptos[conceptoId].concepto_iva})
        }
    },[conceptoId])

    useEffect(() => {
        const prov = proveedores[provId]
        if(prov){
            setTicket({...ticket, prov_name: prov.pro_razsoc, prov_cod: prov.pro_cod, proprv_codigo: prov.proprv_codigo, prov_cuit: prov.pro_cuit, provsiv_cod: prov.prosiv_cod})
        }
    },[provId])


    const addProveedor = (index: number) => {
        //const prov = proveedores[index]
        setProvId(index)
        //setTicket({...ticket, prov_name: prov.pro_razsoc, prov_cod: prov.pro_cod, proprv_codigo: prov.proprv_codigo, prov_cuit: prov.pro_cuit, provsiv_cod: prov.prosiv_cod})
        //console.log(prov)
    }

    const addConcepto = (index: number) => {
        const concepto = conceptos[index]
        setConceptoId(index)
        setTicket({...ticket, concepto: concepto.concepto_des, concepto_cod: concepto.concepto_cod})
    }

    const checkData = (): boolean => {
        if(ticket.comprobante.length>0 && ticket.concepto.length>0
            &&ticket.fecha.length>0 && ticket.iva && ticket.ivapor && ticket.neto && ticket.total &&
            ticket.nro.length > 0 && ticket.prov_cuit && ticket.prov_name.length>0 && 
            ticket.tipo.length>0 && ticket.pv.length>0
        ) return true
        else return false
    }

    const addTicket = async () => {
        if(checkData() && confirm("Quieres registrar este comprobante?")) {
            await createTicketFn(ticket)
            setTicket({...ticket, total: 0, neto: 0, iva: 0, nro: "", fecha: ""})
        }
        else {
            alert("Faltan Datos")
        }
    }

    const clearTicket = () => {
        const empty: ITicket = {fecha: "",comprobante: "TIK",tipo: "A",
        pv: "",nro: "",prov_cuit: 0,prov_name: "",prov_cod: 0,provsiv_cod: 0,
        proprv_codigo: 0,neto: 0,ivapor: 21.0,iva: 0,total: 0,concepto: "",
        concepto_cod: "", samabe: false}
        setTicket(empty)
        setConceptoId(99)
        setProvId(99)
    }

    const createTxt = async () => {
        if(txtData.fechaFin.length > 0 && txtData.fechaFin.length > 0 && txtData.cco && 
            confirm("Quieres exportar los comprobantes desde la fecha "+txtData.fechaInicio+" hasta "+txtData.fechaFin+"? (Los mismos se ocultaran despues de hacerlo.)")
        ){
            setTxtData({...txtData, fechaFin: "", fechaInicio: "", samabe: false})
            const lineas: ITxtData = await getTicketsTxtFn(txtData)
            downloadTxt(lineas,txtData.samabe)

        }
        else alert("Ingrese una fecha de inicio y fin valido.")
    }

    return (
        <div>
            <Header />
            <h1 style={{fontWeight: "bold", color:"#3399ff", margin: "10px"}}>Carga de Tickets</h1>
            <hr color='#3399ff'/>
            <div style={{display: "flex", marginLeft: 20}}>
                <div>
                    <div style={{width: "450px"}}>
                        <h2 style={textStyle}>Samabe:
                        <input type="checkbox" checked={ticket.samabe} 
                        onChange={(e) => setTicket({...ticket,samabe:e.target.checked})}/>
                        </h2>
                        <hr color='#3399ff'/>
                    </div>
                    <div style={{width: "450px"}}>
                        <h2 style={textStyle}>Tipo de Comprobante:</h2>
                        <input type="text" value={ticket.comprobante} style={{width: "200px", fontSize: 24}}
                        onChange={(e) => setTicket({...ticket,comprobante:e.target.value})} disabled={true}/>
                        <hr color='#3399ff'/>
                    </div>
                    <div style={{width: "450px"}}>
                        <h2 style={textStyle}>IVA:</h2>
                        <input type="number" value={ticket.ivapor} style={{width: "200px", fontSize: 24}}
                        onChange={(e) => setTicket({...ticket,ivapor:parseFloat(e.target.value)})} disabled={true}/>
                        <hr color='#3399ff'/>
                    </div>
                    <div style={{width: "450px"}}>
                        <h2 style={textStyle}>Fecha:</h2>
                        <input type="date" value={ticket.fecha} style={{width: "200px", fontSize: 24}}
                        onChange={(e) => setTicket({...ticket,fecha:e.target.value})}/>
                        <hr color='#3399ff'/>
                    </div>
                    <div style={{width: "450px"}}>
                        <h2 style={textStyle}>Punto de Venta:</h2>
                        <input type="number" value={ticket.pv} style={{width: "200px", fontSize: 24}}
                        onChange={(e) => setTicket({...ticket,pv:e.target.value})}/>
                        <hr color='#3399ff'/>
                    </div>
                    <div style={{width: "450px"}}>
                        <h2 style={textStyle}>Numero de Comprobante:</h2>
                        <input type="number" value={ticket.nro} style={{width: "200px", fontSize: 24}}
                        onChange={(e) => setTicket({...ticket,nro:e.target.value})}/>
                        <hr color='#3399ff'/>
                    </div>
                    <div style={{width: "450px"}}>
                        <h2 style={textStyle}>Proveedor:</h2>
                        <select style={{width: "450px", fontSize: 20}} value={provId} onChange={(e) => addProveedor(parseInt((e.target.value)))}>
                            <option value={99}>---</option>
                            {proveedores.map((p, i) => (
                                <option value={i}>{p.pro_razsoc}</option>
                            ))}
                            
                        </select>
                        <h2 style={textStyle}>CUIT: {ticket.prov_cuit}</h2>
                        <hr color='#3399ff'/>
                    </div>
                    <div style={{width: "450px"}}>
                        <h2 style={textStyle}>Neto:</h2>
                        <input type="number" value={ticket.neto} style={{width: "200px", fontSize: 24}}
                        min={0} onChange={(e) => setTicket({...ticket,neto:parseFloat(e.target.value)})}/>
                        <h2 style={textStyle}>IVA: </h2>
                        <input type="number" value={ticket.iva} style={{width: "200px", fontSize: 24}}
                        min={0} onChange={(e) => setTicket({...ticket,iva:parseFloat(e.target.value)})}/>
                        <h2 style={textStyle}>Total: </h2>
                        <input type="number" value={ticket.total} style={{width: "200px", fontSize: 24}}
                        min={0} onChange={(e) => setTicket({...ticket,total:parseFloat(e.target.value)})}/>
                        <hr color='#3399ff'/>
                    </div>
                </div>
                <div style={{marginLeft: "50px"}}>
                    <div style={{width: "500px"}}>
                        <h2 style={textStyle}>Concepto:</h2>
                        <select style={{width: "450px", fontSize: 24}} value={conceptoId} onChange={(e) => addConcepto(parseInt(e.target.value))}>
                            <option value={99}>---</option>
                            {conceptos.map((c,i) => (
                                <option value={i}>{c.concepto_des}</option>
                            ))}
                        </select>
                        <hr color='#3399ff'/>
                    </div>
                    <div style={{display: "flex"}}>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "200px", height: "50px"}} onClick={() => addTicket()}>
                            Crear Ticket
                        </button>
                        <button style={{color: "white", backgroundColor: "#fa2323ff", fontSize: "large", width: "200px", height: "50px", marginLeft: "20px"}} onClick={() => clearTicket()}>
                            Limpiar
                        </button>
                    </div>
                    <div>
                        <h2 style={textStyle}>Exportar TXT:</h2>
                        <hr color='#3399ff'/>
                        <div style={{width: "500px"}}>
                            <h2 style={textStyle}>Fecha Inicio:</h2>
                            <input type="date" value={txtData.fechaInicio} style={{width: "200px", fontSize: 24}}
                            onChange={(e) => setTxtData({...txtData, fechaInicio: e.target.value})}/>
                        </div>
                        <div style={{width: "500px"}}>
                            <h2 style={textStyle}>Fecha Fin:</h2>
                            <input type="date" value={txtData.fechaFin} style={{width: "200px", fontSize: 24}}
                            onChange={(e) => setTxtData({...txtData, fechaFin: e.target.value})}/>
                        </div>
                        <div style={{width: "450px"}}>
                            <h2 style={textStyle}>Samabe:
                            <input type="checkbox" checked={txtData.samabe} 
                            onChange={(e) => setTxtData({...txtData, samabe: e.target.checked})}/>
                            </h2>
                            <hr color='#3399ff'/>
                        </div>
                        <div style={{width: "500px"}}>
                            <h2 style={textStyle}>Centro de costo: {txtData.cco}</h2>
                        </div>
                        <button style={{color: "white", backgroundColor: "#3399ff", fontSize: "large", width: "200px", height: "50px"}} onClick={() => createTxt()}>
                            Crear TXTs
                        </button>
                    </div>

                </div>
                <div style={{marginLeft: "50px", width: "700px"}}>
                    <h2 style={textStyle}>Ultimos comprobantes cargados:</h2>
                    <hr color='#3399ff'/>
                    <table>
                        <tbody>
                            <tr>
                                <th style={rowStyle}>Numero</th>
                                <th style={rowStyle}>Proveedor</th>
                                <th style={rowStyle}>Proveedor Cuit</th>
                                <th style={rowStyle}>Punto de Venta</th>
                            </tr>
                            {tickets.map((t) => (
                                <tr>
                                    <th style={rowStyle}>{t.nro}</th>
                                    <th style={rowStyle}>{t.prov_name}</th>
                                    <th style={rowStyle}>{t.prov_cuit}</th>
                                    <th style={rowStyle}>{t.pv}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const textStyle: React.CSSProperties = {
    fontWeight: "normal",
    color: "#3399ff",
    margin: "5px",
    textAlign: "left"
}
const rowStyle: React.CSSProperties = {
    border: "1px solid",
    width: "20%"
}