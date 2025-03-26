import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { comparePassword } from "../utils/bcrypt.js";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();
const router = express.Router();

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        const isMatch = comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

        // Generar token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Guardar token en cookie
        res.cookie("token", token, { httpOnly: true });

        res.json({ message: "Login exitoso", token });

    } catch (error) {
        res.status(500).json({ message: "Error en el login", error });
    }
});

// Logout (elimina la cookie)
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada" });
});

// Ruta "current" para obtener datos del usuario autenticado
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export default router;
