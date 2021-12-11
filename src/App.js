import React, { useState, useEffect } from 'react'
import { Products, Navbar, Cart, Checkout } from './components'
import { commerce } from './lib/commerce'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const App = () => {

    const [products, setProducts] = useState([]);           // Estado para products
    const [cart, setCart] = useState({})                    // Estado para el carrito de la compra
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState()

    const fetchProducts = async () => {                     // Petición a commerce.js para que nos de la lista de productos
        const { data } = await commerce.products.list();
        setProducts(data);
    }

    const fetchCart = async() => {
        const cart = await commerce.cart.retrieve();                            // Petición a commerce.js para ver el estado del carrito
        setCart(cart);
    }

    const handleAddToCart = async (productId, quantity) => {                    // Función para añadir productos al carrito de la compra
        const { cart } = await commerce.cart.add(productId, quantity);
        setCart( cart );
    }

    const handleUpdateCartQty = async (productId, quantity) => {                // Función para actualizar la cantidad de un producto
        const { cart } = await commerce.cart.update(productId, { quantity });
        setCart( cart );
    };

    const handleRemoveFromCart = async ( productId ) => {                        // Función para actualizar la cant
        const { cart } = await commerce.cart.remove(productId);
        setCart( cart );
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart( cart );
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart( newCart )
    }

    const handleCaptureCheckout = async ( checkoutTokenId, newOrder ) => {
        try {
          const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)  // Le dice a commercejs que acepta el pedido
            setOrder( incomingOrder )                                                       // Se establece el estado para order
            refreshCart()                                                                   // Vacia el carrito
        } catch (error) {
            setErrorMessage(error.data.error.message)
        }
    }

    useEffect(() => {                                       // Cada vez que se cargue el componente se cargarán los productos
        fetchProducts();                                    // y el estado del carrito.                                 
        fetchCart();
    },[])

    console.log(cart)

    //Nueva implementación de react-router-dom V-6.
    // Switch se cambia por routes, desaparece el exact y se llama "element" al componente a renderizar
    return (
        <Router>
            <div>
                <Navbar totalItems={ cart.total_items }/>
                <Routes>
                    <Route path="/" element={
                        <Products products={ products } onAddToCart={ handleAddToCart }/>
                    }>
                    </Route>
                    <Route path="/cart" element={
                        <Cart 
                            cart={ cart }
                            onUpdateCartQty={handleUpdateCartQty} 
                            onRemoveFromCart={handleRemoveFromCart} 
                            onEmptyCart={handleEmptyCart} />
                    }>
                    </Route>
                    <Route path="/checkout" element={
                        <Checkout 
                            cart={cart}
                            order={order}
                            onCaptureCheckout={ handleCaptureCheckout }
                            error={errorMessage}
                        />
                    }>
                    </Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App
