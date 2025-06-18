export interface Compra {
    productoId?: string;
    cantidad?: number;
    nombreCliente: string;
    telefono: string;
    email: string;
    direccion: string;
    total?: number
}

export interface BodyHash {
    reference: string,
    amount: number,
    currency: string
}

export interface EstadoCompra {
    estado: string,
    nombreCliente: string,
    direccion: string,
    total: number,
    cantidad: number
}

export interface Transaccion {
    id:string;
    idCompra:string;
    total:number
}

export const initialTransaccion = {
    id:'',
    idCompra:'',
    total:0
}

export const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  DECLINED: 'Declinada',
};