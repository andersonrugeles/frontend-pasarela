import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { obtenerProductos } from '../api/productoApi';

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagen?: string;
  cantidad:number
}

interface ProductosState {
  items: Producto[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductosState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProductos = createAsyncThunk('producto/fetchProductos', async () => {
    return await obtenerProductos();
});


const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error desconocido';
      });
  },
});

export default productosSlice.reducer;
