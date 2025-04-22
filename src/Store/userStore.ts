import { create } from "zustand";
import { IUser, IUserStore } from "../Utils/interface";
import { useNavigate } from "react-router-dom";
const SERVER = import.meta.env.VITE_SERVER
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const useUserStore = create<IUserStore>((set) => ({
    log: false,
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