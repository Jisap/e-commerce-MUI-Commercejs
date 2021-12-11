import React from 'react'
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const PaymentForm = ({ checkoutToken, shippingData, backStep, onCaptureCheckout, nextStep, timeout }) => {

    console.log(checkoutToken.live.line_items)

    const handleSubmit = async( event, elements, stripe ) => {
        event.preventDefault();

        if(!stripe || !elements) return;

        const cardElement = elements.getElement( CardElement );
        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
        
        if(error){
            console.log(error)
        }else{
            const orderData = {
                line_items: checkoutToken.live.line_items,
                customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
                shipping: { 
                    name: 'Primary', 
                    street: shippingData.address1, 
                    town_city: shippingData.city,
                    county_state: shippingData.shippingSubdivision,
                    postal_zip_code: shippingData.zip,
                    country: shippingData.shippingCountry,
                },
                fulfillment: { shipping_method: shippingData.shippingOption},
                payment: { 
                    gateway: 'stripe',
                    stripe: { 
                        payment_method_id: paymentMethod.id
                    }
                }
            }

            onCaptureCheckout( checkoutToken.id, orderData )    // Se envía a stripe la id y la orden con el pedido de compra

            timeout()                                           // como no hemos habilitado stripe en commercejs ( para no dar la tarjeta)
                                                                // despues de 3 secs establecemos una bandera isFinished = true para simular el pago    
            nextStep()
        }
    }

    return (
        <>
           <Review  checkoutToken={ checkoutToken }/>
           <Divider />
           <Typography variant='h6' gutterBottom style={{margin: '20px 0'}}>Payment method</Typography>
            {/* Elements permite acceder a los métodos de stripe */}
            <Elements stripe={ stripePromise }>
                <ElementsConsumer>
                    {/* Elements es una instancia usada para crear elementos de pago */}
                    {({ elements, stripe }) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                            <CardElement />
                            <br /> <br />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="outlined" onClick={backStep}>Back</Button>
                                <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                                    Pay { checkoutToken.live.subtotal.formatted_with_symbol }
                                </Button>
                            </div>
                        </form>
                    )}
                </ElementsConsumer>
            </Elements>
        </>
    )
}

export default PaymentForm
