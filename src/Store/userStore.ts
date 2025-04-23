import { create } from "zustand";
import { IUser, IUserStore } from "../Utils/interface";
import { useNavigate } from "react-router-dom";
const SERVER = import.meta.env.VITE_SERVER
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const useUserStore = create<IUserStore>((set) => ({
    log: false,
    sysUsers: [],
    modCredential: async ( empresaId: number, userId?: number) => {
        try {
            if(userId){
                await axios.post(SERVER+'/user/credential/'+userId+'/'+empresaId)
                alert('Credenciales modificadas.')
            }
            else{
                await axios.delete(SERVER+'/user/credential/'+empresaId)
                alert('Credenciales revocadas.')
            }
           
        } catch (error) {
            alert('Error cambiando las credenciales')
            console.log(error)
        }
    },
    activateUser: async (id: number) => {
        try {
            await axios.patch(SERVER+'/user/activate/'+id)
            alert('Usuario activado.')
        } catch (error) {
            alert('Error para activar usuario.')
            console.log('Error al activar usuario: ',error)
        }
    },
    deactivateUser: async (id: number) => {
        try {
            await axios.patch(SERVER+'/user/deactivate/'+id)
            alert('Usuario desactivado.')
        } catch (error) {
            alert('Error para desactivar usuario.')
            console.log('Error al desactivar usuario: ',error)
        }
    },
    getAllUsers: async () => {
        try {
            const users: IUser[] = (await axios.get(SERVER+'/user/all')).data
            set({sysUsers: users})
        } catch (error) {
            console.log('Cannot fetch users: ',error)
        }
    },
    login: async (email: string) => {
        try {
            const token: string = (await axios.post(SERVER+'/user/login', {email:email})).data
            localStorage.setItem('jwToken', token)
        } catch (error) {
            alert('Error a iniciar sesion.')
        }
    },
    logout: async () => {
        console.log('Fin Sesion')   
        localStorage.removeItem('jwToken')
    },
    session: async () => {
        const token = localStorage.getItem('jwToken')
        if(token){
            const data: IUser = jwtDecode(token)
            console.log(data)
            set({log: true})
            useNavigate()('/')
        }
        else{
            useNavigate()('/login')
            window.location.reload()
        }
    }
}))