import { Router } from "express";
import CartManager from "../../service/CartManager.js";
import ProductManager from "../../service/ProductManager.js";

const router = new Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartId = cid;

        const cart = await cartManager.getCartById(cartId);

        if (cart) {
            return res.status(200).json({ cart, status: 'Success', message: 'Carrito obtenido correctamente' });
        } else {
            return res.status(404).send({ status: 'Error', error: 'Carrito no encontrado' });
        }
    }
    catch (error) {
        console.log(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const { products } = req.body;
        const cart = { products };

        const newCart = await cartManager.addCart(cart);

        if (newCart) {
            return res.status(201).json({id: newCart.id, status: 'Success', message: 'Carrito creado correctamente'});
        } else {
            return res.status(404).send({ status: 'Error', error: 'Carrito no creado' });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartId = cid;
        const productId = pid;

        const productExists = await productManager.getProductById(productId);
        
        if (!productExists) {
            return res.status(404).send({ status: 'Error', error: `Producto con id ${productId} no encontrado` });
        }

        const cartExists = await cartManager.getCartById(cartId);
        
        if (!cartExists) {
            return res.status(404).send({ status: 'Error', error: `Carrito con id ${cartId} no encontrado` });
        }

        const updatedCart = await cartManager.addProductToCart(cartId, productId);

        if (updatedCart) {
            return res.status(201).json({ message: 'Producto agregado al carrito.', cart: updatedCart });
        } else {
            return res.status(404).send({ status: 'Error', error: `Error al agregar el producto con id ${productId} al carrito con id ${cartId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(404).send({ status: 'error', error: error.message });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartId = cid;
        const productId = pid;

        const productExists = await productManager.getProductById(productId);
        
        if (!productExists) {
            return res.status(404).send({ status: 'Error', error: `Producto con id ${productId} no encontrado` });
        }

        const cartExists = await cartManager.getCartById(cartId);
        
        if (!cartExists) {
            return res.status(404).send({ status: 'Error', error: `Carrito con id ${cartId} no encontrado` });
        }

        const deleteProductFromCart = await cartManager.deleteProductFromCart(cartId, productId);

        if (deleteProductFromCart) {
            return res.status(200).json({ message: `Producto con id ${productId} eliminado del carrito.`, cart: deleteProductFromCart });
        } else {
            return res.status(404).send({ status: 'Error', error: `Error al eliminar el producto con id ${productId} en el carrito con id ${cartId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(404).send({ status: 'error', error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cartId = cid;
        const productsCart = products;

        if (!Array.isArray(productsCart)) {
            return res.status(400).send({ status: 'Error', error: 'El carrito debe ser un array de productos' });
        }

        const cartExists = await cartManager.getCartById(cartId);
        
        if (!cartExists) {
            return res.status(404).send({ status: 'Error', error: `Carrito con id ${cartId} no encontrado` });
        }

        const updatedCart = await cartManager.updateCart(cartId, productsCart);

        if (updatedCart) {
            return res.status(200).json({ message: 'Carrito actualizado.', cart: updatedCart });
        } else {
            return res.status(404).send({ status: 'Error', error: `Error al actualizar el carrito con id ${cartId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(404).send({ status: 'error', error: error.message });
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cartId = cid;
        const productId = pid;
        const quantityProduct = quantity;

        const productExists = await productManager.getProductById(productId);
        
        if (!productExists) {
            return res.status(404).send({ status: 'Error', error: `Producto con id ${productId} no encontrado` });
        }

        const cartExists = await cartManager.getCartById(cartId);
        
        if (!cartExists) {
            return res.status(404).send({ status: 'Error', error: `Carrito con id ${cartId} no encontrado` });
        }

        if (quantityProduct <= 0) {
            return res.status(400).send({ status: 'Error', error: 'La cantidad debe ser mayor a 0' });
        }

        if (!quantityProduct) {
            return res.status(400).send({ status: 'Error', error: 'La cantidad es obligatoria' });
        }

        const updatedCart = await cartManager.updateProductQuantityInCart(cartId, productId, quantityProduct);

        if (updatedCart) {
            return res.status(200).json({ message: 'Producto actualizado en el carrito.', cart: updatedCart });
        } else {
            return res.status(404).send({ status: 'Error', error: `Error al actualizar el producto con id ${productId} en el carrito con id ${cartId}` });
        }
    } catch (error) {
        console.error(error);
        res.status(404).send({ status: 'error', error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartId = cid;
        
        const cartExists = await cartManager.getCartById(cartId);
        
        if (!cartExists) {
            return res.status(404).send({ status: 'Error', error: `Carrito con id ${cartId} no encontrado` });
        }

        const deletedCart = await cartManager.deletedCart(cartId);

        if (deletedCart) {
            return res.status(200).json({ message: `Se eliminaron todos los productos del carrito con id ${cartId}.`, cart: deletedCart });  
        } else {
            return res.status(404).send({ status: 'Error', error: `Error al eliminar los productos del carrito con id ${cartId}` });              
        }
    } catch (error) {
        console.error(error);
        res.status(404).send({ status: 'error', error: error.message });
    }
})

export default router;