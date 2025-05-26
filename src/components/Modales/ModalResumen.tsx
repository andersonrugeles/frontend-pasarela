import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Divider
} from '@mui/material';
import type { Producto } from '../../store/productoSlice';

interface ResumenPagoProps {
    open: boolean;
    onClose: () => void;
    onConfirmarPago: (total: number) => void;
    producto: Producto;
    cantidad: number;
    tarifaBase?: number;
    tarifaEnvio?: number;
}

const ModalResumenPago: React.FC<ResumenPagoProps> = ({
    open,
    onClose,
    onConfirmarPago,
    producto,
    cantidad,
    tarifaBase = 80000,
    tarifaEnvio = 200000,
}) => {
    const subtotal = producto.precio * cantidad;
    const total = subtotal + tarifaBase + tarifaEnvio;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Resumen del Pago</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>Producto: <strong>{producto.nombre}</strong></Typography>
                    <Typography>Cantidad: {cantidad}</Typography>
                    <Typography>Precio unitario: ${producto.precio.toLocaleString()}</Typography>
                    <Typography>Subtotal: ${subtotal.toLocaleString()}</Typography>
                    <Divider />
                    <Typography>Tarifa base: ${tarifaBase.toLocaleString()}</Typography>
                    <Typography>Tarifa de envío: ${tarifaEnvio.toLocaleString()}</Typography>
                    <Divider />
                    <Typography variant="h6">Total a pagar: ${total.toLocaleString()}</Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => onConfirmarPago(total)}
                    sx={{ px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                >
                    Confirmar y pagar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalResumenPago;
