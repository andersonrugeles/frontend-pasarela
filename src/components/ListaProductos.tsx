import React, { useState } from 'react';
import type { Producto } from '../store/productoSlice';
import ProductoCard from './ProductoCard';
import ModalPago from './ModalPago';
import { Box } from '@mui/material';

interface ListaProductosProps {
  productos: Producto[];
}

const ListaProductos: React.FC<ListaProductosProps> = ({ productos }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const confirmarCompra = (datos: any) => {
    console.log('Datos enviados:', datos, 'Producto:', productoSeleccionado);
    // Aquí llamas a tu backend o proceso de pago simulado
  };

  if (productos.length === 0) {
    return <p className="text-center mt-6 text-gray-500">No hay productos disponibles.</p>;
  }

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        gap={3}
        p={2}
      >
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} onModal={(producto: Producto) => abrirModal(producto)} />
        ))}
      </Box>
      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={confirmarCompra}
      />
    </>
  );
};

export default ListaProductos;
