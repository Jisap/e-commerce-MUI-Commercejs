import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/commerce.png'
import useStyles from './styles';

const Navbar = ({ totalItems }) => {
    
    const classes = useStyles();
    const location = useLocation(); // es una función que devuelve el objeto de ubicación que contiene información sobre la URL actual. 
                                    // Siempre que cambie la URL, se devolverá un nuevo objeto de ubicación.
    
    return (
        // Con Material Ui los Links se hacen dentro de una prop llamada "component" seguida de otra "to="" que indica la ruta.
        // El boton del carrito solo se mostrará si estamos en la página principal, si estamos en el carrito no. 
        <>
            <AppBar position="fixed" className={classes.appBar} color="inherit" >
                <Toolbar>
                    <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
                        <img src={logo} alt="Commerce.js" height="25px" className={classes.image}/>
                        PakuTienda.js
                    </Typography>
                    <div className={classes.grow} />
                    { location.pathname === '/' && (
                    <div className={classes.button}>
                        <IconButton component={Link} to="/cart" aria-label="Show cart Items" color="inherit">
                            <Badge badgeContent={ totalItems } color="secondary"></Badge>
                                <ShoppingCart />
                        </IconButton>
                    </div>) }
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar