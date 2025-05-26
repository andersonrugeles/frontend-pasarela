export interface Cliente {
  nombre: string;
  telefono: string;
  email:string;
  direccion:string;
  numero:string;
  cvv:string;
  fecha:string;
}

export const initialCliente: Cliente = {
  nombre: '',
  numero: '',
  fecha: '',
  cvv: '',
  direccion: '',
  email: '',
  telefono: ''
};