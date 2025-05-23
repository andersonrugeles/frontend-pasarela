import { configureStore } from '@reduxjs/toolkit';
import compraReducer from './compraSlice';
import productoReducer from './productoSlice'

export const store = configureStore({
    reducer: {
        productos: productoReducer,
        compra: compraReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
