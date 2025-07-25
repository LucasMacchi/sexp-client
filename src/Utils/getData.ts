import axios from "axios";
import mesesJSON from '../meses.json'
import { IAddExp, IEmpresas, IEstados, IExpediente, IServicio, IUser, IUserCreate } from "./interface";
import authReturner from "./authReturner";
import { jwtDecode } from "jwt-decode";
const SERVER = import.meta.env.VITE_SERVER;

export function getMeses () : string[] {
    return mesesJSON.meses
}

export async function postExpediente (data: IAddExp) {
    try {
        await axios.post(SERVER+"/expediente/add",data, authReturner())
        alert("Expediente creado.")
    } catch (error) {
        console.log(error)
        alert("Error al crear el expediente")
    }
}

export async function getTipos () : Promise<string[]> {
    try {
        const res:string[] = (await axios.get(SERVER+"/data/tipos", authReturner())).data
        return res
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getEmpresas(): Promise<IEmpresas[]> {
    try {
        const res: IEmpresas[] = (await axios.get(SERVER+"/data/empresas", authReturner())).data
        return res
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getServicios(): Promise<IServicio[]> {
    try {
        const res: IServicio[] = (await axios.get(SERVER+"/data/services", authReturner())).data
        return res
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getEstados(): Promise<IEstados[]> {
    try {
        const res: IEstados[] = (await axios.get(SERVER+"/data/estados", authReturner())).data
        return res
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getExpedientes(): Promise<IExpediente[]> {
    try {
        const token = localStorage.getItem('jwToken')
        const userData:IUser = jwtDecode(token ? token : '')
        const empresas: number[] = userData.credentials.map(c => c.empresa_id)
        const expedientes: IExpediente[] = await (await axios.get(SERVER+'/expediente/all', authReturner())).data
        if(userData.admin){
            return expedientes
        }
        else {
            const allowedExps = expedientes.filter((e) => empresas.includes(e.empresa_id))
            return allowedExps

        }
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getUniqueExpediente(id:number): Promise<IExpediente | null> {
    try {
        const expediente: IExpediente = await (await axios.get(SERVER+'/expediente/uniq/'+id, authReturner())).data
        console.log(expediente)
        return expediente
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function getAllUsers(): Promise<IUser[]> {
    try {
        const usuarios: IUser[] = await (await axios.get(SERVER+'/user/all', authReturner())).data
        return usuarios
    } catch (error) {
        console.log(error)
        return []
    }
}

export function getEstadoName (estados: IEstados[], id: number): string {
    let name = ''
    estados.forEach(es => {
        if(es.estado_id === id) name = es.concepto
    });
    return name
}

export function empresaReturner (id: number, empresas: IEmpresas[],servicios: IServicio[]): string {
    let name = "NaN";
    empresas.forEach((e) => {
      if (e.empresa_id === id)
        name = e.nombre + " - " + servicioReturner(servicios,e.servicio_id);
    });
    return name;
}

export function servicioReturner (servicios: IServicio[], id: number): string {
    let name = "NaN";
    servicios.forEach((e) => {
      if (e.servicio_id === id) name = e.nombre;
    });
    return name;
}

export function estadoReturner (id: number, estados: IEstados[]):string {
    let name = "NaN";
    estados.forEach((e) => {
      if (e.estado_id === id) {
        name = e.concepto;
      }
    });
    return name;
}

export async function editExpediente (id: number, prop: string, value: string) {
    try {
        const data = {prop,value}
        await axios.patch(SERVER+"/expediente/edit/"+id,data,authReturner())
    } catch (error) {
        console.log(error)
        alert("Error al editar el expediente")
    }
}

export async function getByNumber (nro: string) {
    try {
        const res = (await axios.get(SERVER+"/expediente/number/"+nro,authReturner())).data['exp_id']
        if(res){
            window.location.href = "/expediente/"+res
        }
        else alert("No existe el expediente solicitado")
    } catch (error) {
        console.log(error)
        alert("No existe el expediente solicitado")
    }
}

export async function activateUser (id: number) {
    try {
        await axios.patch(SERVER+"/user/activate/"+id,{},authReturner())
        alert("Usuario activado")
        window.location.reload()
    } catch (error) {
        console.log(error)
        alert("No se pudo activar el usuario")
    }
}

export async function deactivateUser (id: number) {
    try {
        await axios.patch(SERVER+"/user/deactivate/"+id,{},authReturner())
        alert("Usuario desactivado")
        window.location.reload()
    } catch (error) {
        console.log(error)
        alert("No se pudo desactivar el usuario")
    }
}

export async function registerUser(data:IUserCreate) {
    try {
        await axios.post(SERVER+"/user/register",data,authReturner())
        alert("Usuario registrado")
        window.location.reload()
    } catch (error) {
        console.log(error)
        alert("Error al crear el usuario")
    }
}

export async function addUserCredential(user:number,empresa: number) {
    try {
        await axios.post(SERVER+`/user/credential/${user}/${empresa}`,{},authReturner())
        alert("Credenciales modificadas")
        window.location.reload()
    } catch (error) {
        console.log(error)
        alert("Error al cambiar las credenciales")
    }
}

export async function removeUserCredential(cred: number) {
    try {
        await axios.delete(SERVER+`/user/credential/${cred}`,authReturner())
        alert("Credenciales modificadas")
        window.location.reload()
    } catch (error) {
        console.log(error)
        alert("Error al cambiar las credenciales")
    }
}

export async function addEstado(estado: string) {
    try {
        await axios.post(SERVER+`/data/estado/${estado}`,{},authReturner())
        alert("Estado agregado.")
        window.location.reload()
    } catch (error) {
        console.log(error)
        alert("Error al agregar estado.")
    }
}

export async function addService(service: string) {
    try {
        await axios.post(SERVER+`/data/service/${service}`,{},authReturner())
        alert("Servicio agregado.")
        window.location.reload()
    } catch (error) {
        console.log(error)
        alert("Error al servicio estado.")
    }
}