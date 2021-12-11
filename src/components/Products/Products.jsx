import React from 'react'
import { Grid } from '@material-ui/core'
import Product from './Product/Product'
import useStyles from './styles'


// const products = [
//     { id:1, name: 'Shoes', description: 'Running shoes', price:'$5', image: 'https://images.the-house.com/under-armour-thrill-shoes-blk-blk-white-16-1.jpg'},
//     { id:2, name: 'Mcbook', description: 'Apple macbook', price:'$10', image: 'https://re-store.hu/vision/bsempty/uploaded_images/product/img4071-wyedbqjsz.jpg?dummy=5244324'}
// ]

const Products = ({ products, onAddToCart }) => {

    const classes = useStyles()

    console.log( products )

    return (
        <main className={classes.content}>
            <div className={classes.toolbar}/>
            <Grid container justifyContent="center" spacing={4}>
                { products.map( (product) =>(
                    <Grid item key={product.id} xs={12} sm={6} lg={3}>
                        <Product product={ product } onAddToCart={ onAddToCart }/>
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}


export default Products
