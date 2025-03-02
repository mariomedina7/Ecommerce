import fs from 'fs/promises';
import path from 'path';

import { productModel } from '../src/models/product.model.js';

const pathProducts = path.resolve('db', 'products.json');

export default class ProductManager {
    constructor() {
        this.products = []
        this.init()
    }

    async init() {
        try {
            const data = await fs.readFile(pathProducts, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = []
        }
    }
    
     saveProductToFile() {
        fs.writeFile(pathProducts, JSON.stringify(this.products, null, 2));
    }

    async getAllProducts(page, limit, sort, category, stock) {
        let filter = {};

        if (category) {
            filter.category = category;
        }
        
        if (stock) {
            let stockValue = parseInt(stock);
            if (!isNaN(stockValue)) {
                filter.stock = { $gte: stockValue };
            }
        }
    
        let sortOptions = sort === 'asc' ? { price: 1 } : { price: -1 };
    
        let products = await productModel.paginate(filter, { limit, page, lean: true, sort: sortOptions });
    
        return products;
    }

    async getProductById(id) {
        return await productModel.findById(id)
    }

    async addProduct(product) {
        let newProduct = await productModel.create(product);
        return newProduct;
    }

    async updateProduct(id, product) {
        let updatedProduct = await productModel.updateOne({ _id: id }, product);
        return updatedProduct
    }

    async deleteProduct(id) {
        let deletedProduct = await productModel.deleteOne({ _id: id });
        return deletedProduct;
    }
}