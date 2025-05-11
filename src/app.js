import express from 'express';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import passport from 'passport';
import initializePassport from './config/passport.js';
import productRoutes from "./routes/productRoutes.js";
import cookieParser from 'cookie-parser';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/tickets', ticketRoutes);

export default app;