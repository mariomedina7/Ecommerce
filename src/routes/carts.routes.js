import e, { Router } from "express";
import CartManager from "../../service/CartManager.js";

const router = new Router();
const cartManager = new CartManager();

router.get('/:cid', async (req, res) => {

    try {
        const { cid } = req.params;
        const cartId = parseInt(cid);

        const cart = await cartManager.getCartById(cartId);

        if (cart) {
            return res.json(cart);
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

        if (!products) {
          return res.status(400).send({status: 'Error', error: 'Debe proporcionar un array de productos'});
        }

        const cart = { products };
        const newCartId = await cartManager.addCart(cart);
        res.status(201).json({id: newCartId, status: 'Success', message: 'Carrito creado correctamente'});
    } catch (error) {
        console.log(error);
    }

});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cartId = parseInt(cid);
        const productId = parseInt(pid);

        if (isNaN(cartId) || isNaN(productId)) {
            return res.status(400).send({ status: 'Error', error: 'El ID del carrito y del producto deben ser números válidos.' });
        }

        const updatedCart = await cartManager.addProductToCart(cartId, productId);

        if (!updatedCart) {
            return res.status(404).send({ status: 'Error', error: `Carrito con id ${cartId} no encontrado` });
        } else {
            return res.status(200).json({ message: 'Producto agregado al carrito.', cart: updatedCart });
        }
    } catch (error) {
        console.error(error);
        res.status(404).send({ status: 'error', error: error.message });
    }
});



export default router;