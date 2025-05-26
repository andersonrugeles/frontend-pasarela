
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
import HomeIcon from '@mui/icons-material/Home';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
interface ModalPagoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (datos: any) => void;
}

export default function ModalPago({ isOpen, onClose, onConfirm }: ModalPagoProps) {
    const [numero, setNumero] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [cvv, setCvv] = useState('');
    const [fecha, setFecha] = useState('');

    const esVisa = /^4[0-9]{12}(?:[0-9]{3})?$/.test(numero);
    const esMastercard = /^5[1-5][0-9]{14}$/.test(numero);

    const esValido = esVisa || esMastercard && !!nombre && !!direccion && !!cvv && !!fecha;
    //5407347968812090
    const handleConfirm = () => {
        if (!esValido || !nombre || !direccion || !cvv || !fecha) return;
        onConfirm({ numero, nombre, direccion, cvv, fecha, telefono,email });
        onClose();
    };

    const detectarTipoTarjeta = (num: string) => {
        if (/^4/.test(num)) return 'visa';
        if (/^5[1-5]/.test(num) || /^2(2[2-9]|[3-6]|7[01])/.test(num)) return 'mastercard';
        return 'unknown';
    };

    const tipo = detectarTipoTarjeta(numero.replace(/\s/g, ''));

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
                            endAdornment: (
                                <InputAdornment position="end">
                                    {tipo === 'visa' && (
                                        <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" />
                                    )}
                                    {tipo === 'mastercard' && (
                                        <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" className="h-6" />
                                    )}
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
                        inputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            ), maxLength: 3
                        }}
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

                     <TextField
                        fullWidth
                        label="Telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalPhoneIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                     <TextField
                        fullWidth
                        label="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
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
                <Button onClick={handleConfirm} disabled={!esValido} color="primary" variant="contained">
                    Siguiente
                </Button>
            </DialogActions>
        </Dialog>
    );
}
