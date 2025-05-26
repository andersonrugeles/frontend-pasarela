import axios from 'axios';
import type { Compra, EstadoCompra } from '../types/compra';
import { BASE_URL } from '../utils/contants';


export const compraProducto = async (body:Compra): Promise<any> => {
  const response = await axios.post(`${BASE_URL}/dev/compra`,{...body});
  return response.data;
};

export const actualizarCompra = async (body:EstadoCompra,idCompra:string): Promise<any> => {
  const response = await axios.patch(`${BASE_URL}/dev/compra/${idCompra}`,{...body});
  return response.data;
};
