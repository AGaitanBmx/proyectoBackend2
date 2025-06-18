import express from 'express';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import passport from 'passport';
import initializePassport from './config/passport.js';
import productRoutes from "./routes/productRoutes.js";
import cookieParser from 'cookie-parser';
import {engine} from 'express-handlebars';
import handlebars from 'express-handlebars';
import session from 'express-session';
import viewRoutes from './routes/viewsRoutes.js';


const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/', viewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/tickets', ticketRoutes);


export default app;