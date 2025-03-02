import fs from 'fs/promises';
import path from 'path';

import { cartModel } from '../src/models/cart.model.js';

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
        let cart = await cartModel.findById(id).populate('products.product').lean();
        return cart
    }

    async addCart(cart){
        let newCart = await cartModel.create(cart);
        return newCart
    }

    async addProductToCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);
        
        const existingProduct = cart.products.find(product => product.product.toString() === productId);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
    
        await cart.save();
        return cart;
    }
    
    async deleteProductFromCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);

        const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
    
        if (productIndex === -1) {
            return null;
        }

        cart.products.splice(productIndex, 1);
        await cart.save();
        return cart;
    }

    async updateCart (cartId, products) {
        const cart = await cartModel.findById(cartId);

        cart.products = products;
        
        await cart.save();
        return cart
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);

        const productToUpdate = cart.products.find(product => product.product.toString() === productId);

        if (productToUpdate) {
            productToUpdate.quantity = quantity;
        }

        await cart.save();
        return cart;
    }

    async deletedCart (cartId) {
        const cart = await cartModel.findById(cartId);

        cart.products = [];
        
        await cart.save();
        return cart
    }
}
