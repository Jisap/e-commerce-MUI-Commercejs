import React from 'react'
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom'
import useStyles from './styles';
import CartItem from './CartItem/CartItem';

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart }) => {

    const classes = useStyles();
    
    const isEmpty = !cart.line_items?.length;

    const EmptyCart = () => (
        <Typography variant="subtitle1">
            You have no items in your shopping cart, 
            <Link to="/" className={classes.link}> Start adding some!</Link>
        </Typography>
    )

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                { cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem 
                            item={ item }
                            onUpdateCartQty={ onUpdateCartQty }
                            onRemoveFromCart={ onRemoveFromCart }
                        />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Subtotal: { cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button 
                        className={classes.emptyButton} 
                        size="large" 
                        type="button" 
                        variant="contained"
                        color="secondary"
                        onClick={ onEmptyCart }
                    >
                        Empty Cart
                    </Button>
                    <Button 
                        className={classes.checkoutButton} 
                        size="large" 
                        type="button" 
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/checkout"
                    >
                        Checkout
                    </Button>
                </div>
            </div>
        </>
    );

    if(!cart.line_items) return 'Loading...'

    return (
        <Container>
            <div className={classes.toolbar}/>
            <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>
            { isEmpty ? <EmptyCart /> : <FilledCart /> }

        </Container>
    )
}

export default Cart
