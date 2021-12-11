import React, { useState, useEffect } from 'react'
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import useStyles from './styles';
import { commerce } from '../../../lib/commerce';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { useNavigate, Link } from 'react-router-dom';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {

    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({})
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    let navigate = useNavigate();

    useEffect(() => {   // Si existe un carrito generamos un token cuyo estado se almacenará en checkoutToken
      if (cart.id) {
        const generateToken = async () => {
          try {
            const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
            console.log(token)
            setCheckoutToken(token);
          } catch {
            if (activeStep !== steps.length) navigate('/');
          }
        };
      generateToken();
    }
    }, [cart]);

    const next = ( data ) => {
      setShippingData( data )
      nextStep();
    }

    const timeout = () => {
      setTimeout(() => {
        setIsFinished( true )
      }, 3000);
    }

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)



    let Confirmation = () => (order.customer ? (
        
        <>
          <div>
            <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
          </div>
        </>

    ) : (

        <div className={classes.spinner}>
          <CircularProgress />
        </div>
    
    ));

    if (error && isFinished) {  // Como no hemos dado los datos de tarjeta de credito a commercejs simulamos una confirmación positiva 
      Confirmation = () => (    // a pesar del error que nos devuelve.
        <>
          {/* <Typography variant="h5">Error: {error}</Typography> */}
          
          <div>
            <Typography variant="h5">Thank you for your purchase!</Typography>
            <Divider className={classes.divider} />
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
          </div>
        </>
      );
    }


     const Form = () => (activeStep === 0                                             // Si estamos en el primer paso del pago 
        ? <AddressForm checkoutToken={checkoutToken} next={next}/>                    // vamos al formulario para rellenar los datos   
        : <PaymentForm                                                                // Sino significa que estamos en el segundo y solo queda pagar
            shippingData={shippingData} 
            checkoutToken={checkoutToken} 
            backStep={backStep}
            nextStep={nextStep}
            onCaptureCheckout={onCaptureCheckout}
            timeout={timeout}
      />);  

    return (
        <>
        <CssBaseline />
         <div className={classes.toolbar} /> 
         <main className={classes.layout}>
             <Paper className={classes.paper}>
                 <Typography variant="h4" align="center">Checkout</Typography>
                 <Stepper
                    activeStep={ activeStep }
                    className={classes.stepper}
                >
                    {steps.map((step) => (
                        <Step key={step}>
                            <StepLabel>{ step }</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length ? <Confirmation/>  : checkoutToken && <Form />} 
                {/* Si estamos en el último paso te lleva a confirmation sino al formulario siempre y cuando tengamos el token*/}
             </Paper>
         </main>  
        </>
    )
}

export default Checkout
