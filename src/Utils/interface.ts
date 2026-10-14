export interface IUser {
    first_name?: string,
    last_name?: string,
    email: string,
    activated: boolean,
    admin: boolean,
    moderador: boolean,
    user_id: number,
    credentials: ICredential[]
}
export interface ICredential {
    user_empresa_id: number,
    empresa_id: number,
    user_id: number
}
export interface IPeriodo {
    nombre:string,
    numeracion:string
}

export interface IExpHistorial {
    log_id: number,
    exp_id: number,
    col: string,
    des: string,
    fecha: string,
    user_id: string,
    first_name: string,
    last_name: string
    prev?:string
}

export interface IExpHistorialLast {
    log_id: number,
    exp_id: number,
    col: string,
    des: string,
    fecha: string,
    user_id: string,
    first_name: string,
    last_name: string,
    numero_exp: string,
    concepto: string,
    prev?:string
}

export interface IAddContrato {
    concepto: string,
    direccion: string,
    fecha_inicio: string,
    fecha_final: string,
    fecha_prorroga: string,
    tipo_id: number,
    estado_id: number,
    descripcion: string,
    empresa_id: number,
    precio: number,
    p_periodo: string,
    ajuste_periodo: string,
    ajuste_indice: string,
    ajuste_extraordinario: string,
    user_id: number,
    ocultado: boolean,
    deleted: boolean,
    auto_prorroga: boolean,
    existe: boolean
    servicios?: IAddCcoToContract[]
}

export interface IAddCcoToContract {
    cco_id: number
    porcentaje: number
    servicio_id: number
}

export interface IContrato {
    contract_id: number,
    concepto: string,
    direccion: string,
    fecha_inicio: Date,
    fecha_final: Date,
    fecha_prorroga?: Date,
    tipo_id: number,
    estado_id: number,
    descripcion: string,
    empresa_id: number,
    precio: number,
    p_periodo: string,
    ajuste_periodo: string,
    ajuste_indice: string,
    ajuste_extraordinario: null,
    user_id: number,
    created: string,
    ocultado: boolean,
    deleted: boolean,
    auto_prorroga: boolean,
    estado: string,
    tipo: string,
    nombre: string,
    prestaciones?: string[],
    clientes?:string[],
    servicios?: IContratoService[]
}

export interface IContratoTipo {
    tipo_id: number,
    tipo:string
}

export interface ICco {
    cco_id:number,
    codigo:number,
    des: string,
    cliente: string,
    empresa_id:number
}

export interface IContratoEstado {
    estado_id: number,
    estado:string
}

export interface IContratoService {
    const_serv_id:number,
    contract_id:number,
    cco_id:number,
    porcentaje:number,
    service_id:number,
    codigo: number,
    des:string,
    cliente:string,
    empresa_id:number,
    nombre:string    
}

export interface IExpediente {
    exp_id: number,
    service_id: number,
    numero_exp: string,
    client_id: number,
    concepto: string,
    periodo: Date,
    fecha_presentacion: string,
    fecha_ult_mod: string,
    nro_factura: string,
    empresa_id: number,
    estado_id: number,
    importe: number,
    importe_2: number,
    descripcion: string,
    invitacion: boolean,
    orden_compra: boolean,
    tipo: string,
    fecha_facturacion: string,
    fecha_tesoreria: string,
    ocultado: boolean,
    deleted: boolean,
    track: true,
    dias_diff: number,
    last_saw?: string,
    last_mod?: string,
    historial?:IExpHistorial[],
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
    client_id: number,
    ocultado: boolean,
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
    admin: boolean,
    password: string,
    moderador: boolean
}
export interface IServicio {
    servicio_id: number,
    nombre: string
}
export interface ICliente {
    client_id: number,
    descripcion: string
}
export interface IEmpresas {
    empresa_id: number,
    nombre: string,
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
    cliente:number,
    servicio: number,
    end: string,
    ubicacion:string,
    oculto: boolean,
    tracked: number
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