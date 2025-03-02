import { Router } from "express";
import ProductManager from "../../service/ProductManager.js";

const router = new Router();
const productManager = new ProductManager();

export default (io) => {
router.get('/', async (req, res) => {   
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let sort = req.query.sort ? req.query.sort : 'asc';
        let category = req.query.category ? req.query.category : '';
        let stock = req.query.stock ? req.query.stock : '';
        
        let products = await productManager.getAllProducts(page, limit, sort, category, stock);

        products.prevLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `/api/products?page=${products.nextPage}` : null;

        products.isValidPage = page > 0 && page <= products.totalPages;

        return res.status(200).json({status: 'Success', payload: products});
    } catch (error) {
        console.log(error);
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productId = pid;

        const product = await productManager.getProductById(productId);

        if (product) {
            return res.status(200).json({status: 'Success', payload: product});
        } else {
            return res.status(404).send({ status: 'Error', error: `Producto con id ${productId} no encontrado` });
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
        const productId = pid;

        const productExists = await productManager.getProductById(productId);
        
        if (!productExists) {
            return res.status(404).send({ status: 'Error', error: `Producto con id ${productId} no encontrado` });
        }

        if (!req.body.title || !req.body.description || !req.body.code || req.body.price === null || req.body.stock ==  null || !req.body.category || !req.body.thumbnails) {
            return res.status(400).send({status: 'Error', error: 'Todos los campos son obligatorios'});
        }

        const updateProduct = await productManager.updateProduct(productId, req.body);

        if (updateProduct) {
            return res.status(200).json({status: 'Success', payload: updateProduct});
        } else {
            return res.status(404).send({ status: 'Error', error: `Error al actualizar el producto con id ${productId}` });
        }
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:pid', async (req, res) => {    
    try {
        const { pid } = req.params;
        const productId = pid;

        const productExists = await productManager.getProductById(productId);
        
        if (!productExists) {
            return res.status(404).send({ status: 'Error', error: `Producto con id ${productId} no encontrado` });
        }
            
        const deletedProduct = await productManager.deleteProduct(productId);
    
        if (deletedProduct) {
            io.emit('productoEliminado', productId);

            return res.status(200).json({status: 'Success', id: productId, message: 'Producto eliminado correctamente'});
        } else {
            return res.status(404).send({ status: 'Error', error: `Error al eliminar el producto con id ${productId}` });
        }
    } catch (error) {
        console.log(error);
    }
});

return router;
}