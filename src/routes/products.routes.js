import { Router } from "express";
import ProductManager from "../../service/ProductManager.js";

const router = new Router();
const productManager = new ProductManager();

export default (io) => {
router.get('/', async (req, res) => {
    
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getAllProducts(limit);
        return res.status(200).json({status: 'Success', payload: products});
    } catch (error) {
        console.log(error);
    }
});

router.get('/:pid', async (req, res) => {

    try {
        const { pid } = req.params;
        const productId = parseInt(pid);

        const product = await productManager.getProductById(productId);

        if (product) {
            return res.status(200).json({status: 'Success', payload: product});
        } else {
            return res.status(404).send({ status: 'Error', error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error);
    } 
});

router.post('/', async (req, res) => {

    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || price === null || stock ==  null || !category || !thumbnails) {
          return res.status(400).send({status: 'Error', error: 'Todos los campos son obligatorios'});
        }

        const product = { title, description, code, price, stock, category, thumbnails };
        const newProduct = await productManager.addProduct(product);

        io.emit('productoCreado', newProduct);

        res.status(201).json({id: newProduct.id, status: 'Success', message: 'Producto creado correctamente'});
    } catch (error) {
        console.log(error);
    }

});

router.put('/:pid', async (req, res) => {

    try {
        const { pid } = req.params;
        const productId = parseInt(pid);
        const updateProduct = await productManager.updateProduct(productId, req.body);

        if (!updateProduct) {
            return res.status(404).send({ status: 'Error', error: `Producto con id ${productId} no encontrado` });
        } else {
            return res.status(200).json({status: 'Success', payload: updateProduct});
        }
    } catch (error) {
        console.log(error);
    }

});

router.delete('/:pid', async (req, res) => {    

    try {
        const { pid } = req.params;
        const productId = parseInt(pid);
            
        const deletedProduct = await productManager.deleteProduct(productId);
    
        if (!deletedProduct) {
            return res.status(404).send({ status: 'Error', error: `Producto con id ${productId} no encontrado` });
        } else {
            io.emit('productoEliminado', productId);

            return res.status(200).json({status: 'Success', id: productId, message: 'Producto eliminado correctamente'});
        }
    } catch (error) {
        console.log(error);
    }

});

    return router;
}