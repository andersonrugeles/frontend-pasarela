import * as integration from '../../src/api/integration';
import { PUBLIC_KEY, URL_INTEGRATION } from '../../src/utils/contants';
import { hashCode } from '../../src/utils/utils';

jest.mock('../../src/utils/utils', () => ({
    hashCode: jest.fn(() => Promise.resolve('fake-signature')),
}));

describe('integration API', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('tokenizarTarjeta', () => {
        it('debe hacer POST y devolver id del token', async () => {
            const fakeResponse = { data: { id: 'token123' } };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(fakeResponse),
            });

            const datosTarjeta = {
                number: '4242424242424242',
                cvc: '123',
                exp_month: '12',
                exp_year: '25',
                card_holder: 'Juan Perez',
            };

            const id = await integration.tokenizarTarjeta(datosTarjeta);

            expect(global.fetch).toHaveBeenCalledWith(
                `${URL_INTEGRATION}/v1/tokens/cards`,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${PUBLIC_KEY}`,
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify(datosTarjeta),
                }),
            );
            expect(id).toBe('token123');
        });
    });

    describe('obtenerTokenPrefirmado', () => {
        it('debe hacer GET y devolver acceptance_token', async () => {
            const fakeResponse = { data: { presigned_acceptance: { acceptance_token: 'prefirmado123' } } };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(fakeResponse),
            });

            const token = await integration.obtenerTokenPrefirmado();

            expect(global.fetch).toHaveBeenCalledWith(
                `${URL_INTEGRATION}/v1/merchants/${PUBLIC_KEY}`,
                expect.objectContaining({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }),
            );
            expect(token).toBe('prefirmado123');
        });
    });

    describe('crearTransaccion', () => {
        it('debe hacer POST con la firma y devolver respuesta JSON', async () => {
            const fakeResponse = { data: { id: 'trx123' } };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(fakeResponse),
            });

            const body = {
                amount_in_cents: 10000,
                customer_email: 'juan@example.com',
                payment_method_id: 'token123',
                reference: 'compra123',
                acceptance_token: 'prefirmado123',
            };

            const res = await integration.crearTransaccion(body);

            expect(hashCode).toHaveBeenCalledWith({
                reference: 'compra123',
                currency: 'COP',
                amount: 10000,
            });

            expect(global.fetch).toHaveBeenCalledWith(
                `${URL_INTEGRATION}/v1/transactions`,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${PUBLIC_KEY}`,
                        'Content-Type': 'application/json',
                    }),
                    body: expect.any(String),
                }),
            );

            const sentBody = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
            expect(sentBody.signature).toBe('fake-signature');

            expect(res).toEqual(fakeResponse);
        });
    });

    describe('consultarTransaccion', () => {
        it('debe hacer GET y devolver respuesta JSON', async () => {
            const fakeResponse = { data: { status: 'APPROVED' } };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(fakeResponse),
            });

            const id = 'trx123';

            const res = await integration.consultarTransaccion(id);

            expect(global.fetch).toHaveBeenCalledWith(
                `${URL_INTEGRATION}/v1/transactions/${id}`,
                expect.objectContaining({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }),
            );

            expect(res).toEqual(fakeResponse);
        });
    });
});