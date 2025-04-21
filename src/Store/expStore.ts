import { create } from "zustand";
import { IAddExp, IExpStore } from "../Utils/interface";
import mock from '../expedientes.json'
import mesesJSON from '../meses.json'

export const useExpStore = create<IExpStore>((set) => ({
    expedientes: [],
    servicios: [],
    empresas: [],
    estados: [],
    meses: [],
    async createExpediente (exp: IAddExp) {
        console.log(exp)
    },
    expedientesFn() {
        set({expedientes: mock.expedientes, servicios: mock.servicios, 
            empresas: mock.empresas, estados: mock.estados, meses: mesesJSON.meses})
    }
}))