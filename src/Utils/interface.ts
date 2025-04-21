export interface IUser {
    first_name: string,
    last_name: string,
    email: string,
    activated: boolean,
    admin: boolean
}
export interface IUserStore {
    user: IUser,
    log: boolean,
    login: (email: string) => void,
    logout: () => void,
    session: () => void
}

export interface IExpStore {
    expedientes: IExpediente[],
    servicios: IServicio[],
    empresas: IEmpresas[],
    estados: IEstados[],
    meses: string[],
    expedientesFn: () => void,
    createExpediente: (exp: IAddExp) => void
}
export interface IExpediente {
    exp_id: number,
    servicio_id: number,
    numero_exp: string,
    concepto: string,
    periodo: string,
    fecha_presentacion: string,
    fecha_ult_mod: string,
    nro_factura: string,
    empresa_id: number,
    estado_id: number,
    importe: number,
    descripcion: string
}
export interface IAddExp {
    servicio_id: number,
    numero_exp: string,
    concepto: string,
    periodo: string,
    fecha_presentacion: string,
    nro_factura: string,
    empresa_id: number,
    estado_id: number,
    importe: number,
    descripcion: string
}
export interface IUserCreate {
    first_name: string,
    last_name: string,
    email: string,
}
export interface IServicio {
    servicio_id: number,
    nombre: string
}
export interface IEmpresas {
    empresa_id: number,
    nombre: string
}
export interface IEstados {
    estado_id: number,
    concepto: string
}
export interface IFilterPref {
    empresa: number,
    servicio: number,
    estado: number,
    periodo: string,
    start: string,
    end: string
}
