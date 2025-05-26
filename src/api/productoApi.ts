import axios from 'axios';
import type { Producto } from '../types/producto';
import { BASE_URL } from '../utils/contants';

export const obtenerProductos = async (): Promise<Producto[]> => {
  const response = await axios.get(`${BASE_URL}/dev/productos`);
  return response.data;
};