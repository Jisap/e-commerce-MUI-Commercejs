import React from 'react'
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

const FormInput = ({name, label }) => {   // Esta función construye un campo de texto para los inputs de Material UI
   
    const { control } = useFormContext(); // Este gancho personalizado le permite acceder al contexto del formulario. 
                                          // Necesita envolver su formulario con el FormProvider componente para que useFormContext funcione.  
    return (
        <Grid item xs={12} sm={6}>
            <Controller                   // Controller devuelve un elemento de React y proporciona la capacidad de adjuntar 
                                          // eventos y valores al componente donde se use.
                control={control}
                name={name}
                defaultValue=""              
                render = {({ field })=> (   // En definitiva esta función construye inputs de texto y recoge los valores de los campos, 
                    <TextField              // sus etiquetas, eventos y demas props que a traves del formProvider 
                        fullWidth           // serán usados en los formularios construidos con Material UI
                        label={label}
                        required
                    />
                )}
            />
        </Grid>
    )
}

export default FormInput
