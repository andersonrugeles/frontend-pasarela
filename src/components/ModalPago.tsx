
import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    InputAdornment,
    Grid,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HomeIcon from '@mui/icons-material/Home';


interface ModalPagoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (datos: any) => void;
}

export default function ModalPago({ isOpen, onClose, onConfirm }: ModalPagoProps) {
    const [numero, setNumero] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [cvv, setCvv] = useState('');
    const [fecha, setFecha] = useState('');

    const esVisa = /^4[0-9]{12}(?:[0-9]{3})?$/.test(numero);
    const esMastercard = /^5[1-5][0-9]{14}$/.test(numero);

    const esValido = esVisa || esMastercard && !!nombre && !!direccion && !!cvv && !!fecha;
    //5407347968812090
    const handleConfirm = () => {
        if (!esValido || !nombre || !direccion || !cvv || !fecha) return;
        onConfirm({ numero, nombre, direccion, cvv, fecha });
        onClose();
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value.replace(/\D/g, '');
        if (valor.length <= 3) {
            setCvv(valor);
        }
    };

    const handleExpiracionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;
        setFecha(val);
    };


    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Datos de pago</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>

                    <TextField
                        fullWidth
                        label="Nombre del titular"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />


                    <TextField
                        fullWidth
                        label="Número de tarjeta"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CreditCardIcon />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="1234 5678 9012 3456"
                    />


                    <TextField
                        fullWidth
                        label="Expiración (MM/AA)"
                        value={fecha}
                        onChange={handleExpiracionChange}
                        placeholder="MM/AA"
                    />


                    <TextField
                        fullWidth
                        label="CVV"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        inputProps={{ maxLength: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Dirección de entrega"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <HomeIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirm} color="primary" variant="contained">
                    Pagar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
