import { PUBLIC_KEY, URL_INTEGRATION } from "../utils/contants";
import { hashCode } from "../utils/utils";

export const tokenizarTarjeta = async (datosTarjeta: {
    number: string,
    cvc: string,
    exp_month: string,
    exp_year: string,
    card_holder: string
}) => {
    const response = await fetch(`${URL_INTEGRATION}/v1/tokens/cards`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${PUBLIC_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosTarjeta)
    });

    const data = await response.json();
    return data.data.id;
};


export const obtenerTokenPrefirmado = async () => {
  const response = await fetch(`${URL_INTEGRATION}/v1/merchants/${PUBLIC_KEY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data.data.presigned_acceptance?.acceptance_token;
};

export const crearTransaccion = async (body: {
    amount_in_cents: number,
    customer_email: string,
    payment_method_id: string,
    reference: string,
    acceptance_token: string,
}) => {

    const response = await fetch(`${URL_INTEGRATION}/v1/transactions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${PUBLIC_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount_in_cents: body.amount_in_cents,
            currency: 'COP',
            customer_email: body.customer_email,
            payment_method: {
                type: 'CARD',
                token: body.payment_method_id,
                installments: 1
            },
            reference: body.reference,
            acceptance_token: body.acceptance_token,
            signature: await hashCode({
                reference: body.reference,
                currency: 'COP',
                amount: body.amount_in_cents
            })
        })
    });

    return response.json();
};

export const consultarTransaccion = async (idTransaccion: string) => {
    const response = await fetch(`${URL_INTEGRATION}/v1/transactions/${idTransaccion}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
};
