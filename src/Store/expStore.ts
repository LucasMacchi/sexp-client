import { create } from "zustand";
import { IAddExp, IEmpresas, IEstados, IExpediente, IExpStore, IModExp, IServicio, IUser } from "../Utils/interface";
import mesesJSON from '../meses.json'
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import authReturner from "../Utils/authReturner";


const SERVER = import.meta.env.VITE_SERVER

export const useExpStore = create<IExpStore>((set) => ({
    expedientes: [],
    servicios: [],
    empresas: [],
    estados: [],
    tipos: [],
    ubicaciones: [],
    meses: mesesJSON.meses,
    async tiposFn () {
        const tipos: string[] = (await axios.get(SERVER+'/data/tipos', authReturner())).data
        set({tipos: tipos})
    },
    async ubiFn () {
        const ubicaciones: string[] = (await axios.get(SERVER+'/data/ubicaciones', authReturner())).data
        set({ubicaciones: ubicaciones})
    },
    async createEmpresaFn (empresa: string, service: number) {
        await axios.post(SERVER+'/data/empresa/'+empresa+'/'+service,{}, authReturner())
        alert(`Empresa ${empresa} creada.`)
        window.location.reload()
    },
    async createServiceFn (service: string) {
        await axios.post(SERVER+'/data/service/'+service,{}, authReturner())
        alert(`Servicio ${service} creado.`)
        window.location.reload()
    },
    async createEstadoFn (estado: string) {
        await axios.post(SERVER+'/data/estado/'+estado,{}, authReturner())
        alert(`Estado ${estado} creada.`)
        window.location.reload()
    },
    async modExpediente (data: IModExp, id: number) {
        try {
            await axios.patch(SERVER+'/expediente/edit/'+id,data, authReturner())
            alert('Expediente modificado.')
        } catch (error) {
            alert('Error al modificar el Expediente.')
        }
    },
    async createExpediente (exp: IAddExp) {
        try {
            const token = localStorage.getItem('jwToken')
            const userData:IUser = jwtDecode(token ? token : '')
            exp.user_id = userData.user_id
            await axios.post(SERVER+'/expediente/add',exp, authReturner())
            alert('Expediente Creado')
            window.location.reload()
        } catch (error) {
            alert('Error a crear un pedido.')
        }
    },
    async expedientesFn() {
        const token = localStorage.getItem('jwToken')
        const userData:IUser = jwtDecode(token ? token : '')
        const empresas: number[] = userData.credentials.map(c => c.empresa_id)
        const expedientes: IExpediente[] = await (await axios.get(SERVER+'/expediente/all', authReturner())).data
        if(userData.admin){
            set({expedientes: expedientes})
        }
        else {
            const allowedExps = expedientes.filter((e) => empresas.includes(e.empresa_id))
            set({expedientes: allowedExps})

        }
    },
    async serviciosFn() {
        const servicios: IServicio[] = (await axios.get(SERVER+'/data/services', authReturner())).data
        set({servicios: servicios})
    },
    async empresasFn () {
        const empresas: IEmpresas[] = (await axios.get(SERVER+'/data/empresas', authReturner())).data
        set({empresas: empresas})
    },
    async estadosFn () {
        const estados: IEstados[] = (await axios.get(SERVER+'/data/estados', authReturner())).data
        set({estados: estados})
    }

}))