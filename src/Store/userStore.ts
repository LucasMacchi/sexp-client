import { create } from "zustand";
import { IUserStore } from "../Utils/interface";
import { useNavigate } from "react-router-dom";

const emptyUser = {
    first_name: '',
    last_name: '',
    email: '',
    activated: false,
    admin: false,
}

export const useUserStore = create<IUserStore>((set) => ({
    log: false,
    user:{
        first_name: '',
        last_name: '',
        email: '',
        activated: false,
        admin: false,
    },
    login: async (/*email: string*/) => {
        console.log('Logeado')
        const data = {
            first_name: 'Lucas', 
            last_name: 'Macchi', 
            email: 'email@gmail.cm',
            activated: true,
            admin: true
        }
        set({user: data})
        localStorage.setItem('jwToken', 'usuario')
    },
    logout: async () => {
        console.log('Fin Sesion')   
        set({user: emptyUser})
        localStorage.removeItem('jwToken')
    },
    session: async () => {
        if(localStorage.getItem('jwToken')){
            set({log: true})
            useNavigate()('/')
        }
        else{
            useNavigate()('/login')
            window.location.reload()
        }
    }
}))