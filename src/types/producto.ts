export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  cantidad:number
}

export const initialProducto = {
  id: '',
  nombre: '',
  precio: 0,
  stock: 0,
  cantidad: 0
}