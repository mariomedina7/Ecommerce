import fs from 'fs/promises';
import path from 'path';

const pathCart = path.resolve('db', 'cart.json');

export default class CartManager {
    
    constructor() {
        this.carts = []
        this.init()
    }

    async init() {
        try {
            const data = await fs.readFile(pathCart, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }

    saveToCartFile() {
        fs.writeFile(pathCart, JSON.stringify(this.carts, null, 2));
    }

    async getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    async addCart(cart){
        const newCart = { 
            id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1, 
            ...cart
        };
        this.carts.push(newCart);
        this.saveToCartFile();
        return newCart.id;
    }

    async addProductToCart(cartId, productId) {
        const cart = this.carts.find(cart => cart.id === cartId);
    
        if (!cart) {
            return null;
        }
    
        const existingProduct = cart.products.find(product => product.id === productId);
    
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }
    
        this.saveToCartFile();
        return cart;
    }    
}
