import React, { useState, useEffect } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './Checkout/CustomTextField';
import { commerce } from '../../lib/commerce';
import { Link } from 'react-router-dom';

const AddressForm = ({ checkoutToken, next }) => {

    const [shippingCountries, setShippingCountries] = useState([]);         // Total paises {}
    const [shippingCountry, setShippingCountry] = useState('');             // Total paises por sus siglas []
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    //3º
    const countries = Object.entries(shippingCountries).map(([code,name]) => ({id:code, label:name})); // Creamos un [{}] [{id: 'ES', label: 'Spain'},...]
                                                                                                       // para poder mapearlos. 
    //2º
    const fetchShippingCountries = async (checkoutTokenId) => {                                      
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId); // Obtiene los paises según token
        setShippingCountries(countries);                                                            // Establece el estado de los paises como {}   
                                                                                                    // {Es:spain, Usa: EEUU}
        setShippingCountry(Object.keys(countries)[0]);                                              // Establece el estado del pais como un []
    };                                                                                              // según las iniciales de cada uno
    //1º
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);   // Cada vez que se carga el componente se determina que país se escogio para el envio.
    }, []);


    //3º
    const subdivisions = Object.entries(shippingSubdivisions).map(([code,name]) => ({id:code, label:name})); // Creamos un [{}] pero con las subdivisions
    //2º
    const fetchSubdivisions = async ( countryCode ) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);       // {01: "provincia1", 02: "provincia2", ....}
        setShippingSubdivisions(subdivisions);                                                      // Establece el estado para las subdivisions como un {}
        setShippingSubdivision(Object.keys(subdivisions)[0]);                                          // Establece el el estado para la subdivision como un []
    }                                                                                               // según las iniciales de cada una.    
    //1º
    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry); // Cada vez que cambia la elección de un país se determina que subdivisiones tiene.
    }, [shippingCountry]);


    // En este punto en el select se seleccionaron el país, la provincia y en base a esto se optionen los precios de envio.
    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });
        setShippingOptions(options);        // [{countries, description, id, price}]
        setShippingOption(options[0].id);   // ship_NqKE50Pbg5dgBL
    };

    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [shippingSubdivision]);

    const options = shippingOptions.map((sO)=> ({id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})`}))
    // [{ id: "ship_NqKE50Pbg5dgBL", label: "Normal - ($5.00)" }]


    const methods = useForm(); 

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                {/* El submit contiene un CB que envía toda la data del formulario mas los estados a la función next de Checkoutjs*/}
                <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
                    <Grid container spacing={3}>
                        <FormInput name='firstName' label='First name'/>
                        <FormInput name='lastName' label='Last name'/>
                        <FormInput name='address' label='Address'/>
                        <FormInput name='email' label='Email'/>
                        <FormInput name='city' label='City'/>
                        <FormInput name='zip' label='ZIP / Postal code'/>
                    
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={ shippingCountry } fullWidth onChange={(e) => setShippingCountry( e.target.value )}>
                                {/* [{id: 'ES', label: 'Spain'}, {}, ...] */}
                                { countries.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ))}
                                
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision( e.target.value )}>
                                {/* [{id:AL, label:"Almeria"}, {}, ...] */}
                                {subdivisions.map((subdivision) => (  
                                    <MenuItem key={subdivision.id} value={subdivision.id}>
                                        {subdivision.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption( e.target.value )}>
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent:'space-between'}}>
                        <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
