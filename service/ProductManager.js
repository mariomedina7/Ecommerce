import fs from 'fs/promises';
import path from 'path';

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

    async getAllProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    async getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    async addProduct(product) {
        const newProduct = { 
            id: this.products.length ? this.products[this.products.length - 1].id + 1 : 1, 
            ...product,
            status: true
        };
        this.products.push(newProduct);
        this.saveProductToFile();
        return newProduct.id;
    }

    async updateProduct(id, product) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            return null;
        }

        const updatedProduct = { 
            ...this.products[index], 
            ...product, 
            id: this.products[index].id 
        };

        this.products[index] = updatedProduct;
        this.saveProductToFile();
        return updatedProduct;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            return null;
        }
        this.products[index].status = false;
        const deletedProduct = this.products[index];
        this.products.splice(index, 1);
        this.saveProductToFile();
        return deletedProduct;
    }
}