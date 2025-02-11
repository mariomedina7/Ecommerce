import { Router } from "express";
import ProductManager from "../../service/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('home', { products });
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

export default router;