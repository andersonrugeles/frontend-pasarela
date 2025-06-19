import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Compra {
  id: string;
  idCompra: string;
  total: number;
  estado: 'PENDING' | 'APPROVED' | 'DECLINED';
}

interface CompraState {
  transaccion: Compra | null;
}

const initialState: CompraState = {
  transaccion: JSON.parse(localStorage.getItem('transaccion') || 'null'),
};

const compraSlice = createSlice({
  name: 'compra',
  initialState,
  reducers: {
    setTransaccion(state, action: PayloadAction<Compra>) {
      state.transaccion = action.payload;
      localStorage.setItem('transaccion', JSON.stringify(action.payload));
    },
    limpiarTransaccion(state) {
      state.transaccion = null;
      localStorage.removeItem('transaccion');
    },
  },
});

export const { setTransaccion, limpiarTransaccion } = compraSlice.actions;
export default compraSlice.reducer;
