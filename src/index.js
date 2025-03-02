import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();
const PORT = 8080;

//Server
const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
const io = new Server(httpServer);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Routes
const products = productRouter(io);
app.use('/api/products', products);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

//Socket.io
io.on('connection', (socket) => {
    socket.on('mensajeCliente', (data) => {
        console.log(data);
    })

    socket.emit('mensajeServidor', 'Servidor conectado');
});

//Mongoose
const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ecommerce_backend?retryWrites=true&w=majority');
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit();
    }
}

connectMongoDB();