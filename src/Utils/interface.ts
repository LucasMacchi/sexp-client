export interface IUser {
    first_name?: string,
    last_name?: string,
    email: string,
    activated: boolean,
    admin: boolean,
    user_id: number,
    credentials: ICredential[]
}
export interface ICredential {
    user_empresa_id: number,
    empresa_id: number,
    user_id: number
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
    descripcion: string,
    invitacion: boolean,
    orden_compra: boolean,
    tipo: string,
    fecha_facturacion: string,
    fecha_tesoreria: string
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
    descripcion: string,
    user_id: number,
    tipo: string
}
export interface IModExp {
    ultima_mod: string,
    estado_id: number,
    descripcion: string,
    importe: number,
    numero_exp: string,
    nro_factura: string,
    invitacion: boolean,
    orden_compra: boolean,
    fecha_facturacion: string,
    fecha_tesoreria: string,
    concepto: string
}
export interface IUserCreate {
    first_name: string,
    last_name: string,
    email: string,
    admin: boolean
}
export interface IServicio {
    servicio_id: number,
    nombre: string
}
export interface IEmpresas {
    empresa_id: number,
    nombre: string,
    servicio_id: number
}
export interface IEstados {
    estado_id: number,
    concepto: string
}
export interface IFilterPref {
    empresa: number,
    estado: number,
    periodo: string,
    start: string,
    end: string,
    ubicacion:string
}
