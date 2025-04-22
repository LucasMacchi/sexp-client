import { create } from "zustand";
import { IAddExp, IEmpresas, IEstados, IExpediente, IExpStore, IServicio, IUser } from "../Utils/interface";
import mesesJSON from '../meses.json'
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SERVER = import.meta.env.VITE_SERVER

export const useExpStore = create<IExpStore>((set) => ({
    expedientes: [],
    servicios: [],
    empresas: [],
    estados: [],
    meses: mesesJSON.meses,
    async createExpediente (exp: IAddExp) {
        try {
            const token = localStorage.getItem('jwToken')
            const userData:IUser = jwtDecode(token ? token : '')
            exp.user_id = userData.user_id
            console.log(exp)
            await axios.post(SERVER+'/expediente/add',exp)
            alert('Expediente Creado')
            window.location.reload()
        } catch (error) {
            alert('Error a crear un pedido.')
        }
    },
    async expedientesFn() {
        const expedientes: IExpediente[] = await (await axios.get(SERVER+'/expediente/all')).data
        console.log(expedientes)
        set({expedientes: expedientes})
    },
    async serviciosFn() {
        const servicios: IServicio[] = (await axios.get(SERVER+'/data/services')).data
        set({servicios: servicios})
    },
    async empresasFn () {
        const empresas: IEmpresas[] = (await axios.get(SERVER+'/data/empresas')).data
        set({empresas: empresas})
    },
    async estadosFn () {
        const estados: IEstados[] = (await axios.get(SERVER+'/data/estados')).data
        set({estados: estados})
    }

}))