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
    fecha_tesoreria: string,
    ocultado: boolean
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
    ubicacion:string,
    oculto: boolean
}
export interface ITicket {
    fecha: string,
    comprobante: string,
    tipo: string,
    pv: string,
    nro: string,
    prov_cuit: number,
    prov_name: string,
    prov_cod: number,
    provsiv_cod: number,
    proprv_codigo: number,
    neto: number,
    ivapor: number,
    iva: number,
    total: number,
    concepto: string,
    concepto_cod: string,
    ticket_id?: number,
    samabe: boolean
}

export interface IProveedor {
    pro_cod: number,
    pro_razsoc: string,
    pro_cuit: number,
    prosiv_cod: number,
    proprv_codigo: number
}

export interface IConcepto {
    concepto_cod: string,
    concepto_des: string,
    concepto_iva: number
}

export interface ITxtData {
    cabecera: string[],
    items: string[],
    medpago: string[],
    cco: string[]
}

export interface ITxtDto {
    fechaInicio: string,
    fechaFin: string,
    cco: string,
    samabe: boolean
}