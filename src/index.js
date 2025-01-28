import express from 'express';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';

const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));