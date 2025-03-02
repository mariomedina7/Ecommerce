import { Router } from "express";
import ProductManager from "../../service/ProductManager.js";
import CartManager from "../../service/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;        
        let sort = req.query.sort ? req.query.sort : 'asc';
        let category = req.query.category ? req.query.category : '';
        let stock = req.query.stock ? req.query.stock : '';

        let products = await productManager.getAllProducts(page, limit, sort, category, stock);

        let baseUrl = `/products?limit=${limit}&sort=${sort}&category=${category}&stock=${stock}`;
        products.prevLink = products.hasPrevPage ? `${baseUrl}&page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `${baseUrl}&page=${products.nextPage}` : null;
    
        products.isValidPage = page > 0 && page <= products.totalPages;
        
        return res.render('products', {products});
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/realTimeProducts', async (req, res) => {
    try {
        const realTimeProducts = await productManager.getAllProducts();
        res.render('realTimeProducts', {realTimeProducts});
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).send('Error interno del servidor');
    }
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartId = cid;

        const cart = await cartManager.getCartById(cartId);
        res.render('cart', { cart });
    }
    catch (error) {
        console.error('Error al cargar el carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;