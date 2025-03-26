import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";

// Configuración de variables de entorno
dotenv.config();

// Inicializa Express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());

//apis
app.use("/api/users", userRoutes);
app.use("/api/sessions", authRoutes);

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔥 Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }
};

app.get("/", (req, res) => {
    res.send("¡Servidor funcionando correctamente!");
});

// Levanta el servidor
const PORT = process.env.PORT || 9090;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});