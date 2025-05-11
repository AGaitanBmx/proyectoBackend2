import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserManager } from "../dao/managers/UserManager.js";
import { comparePassword } from "../utils/bcrypt.js";
import passport from "passport";

dotenv.config();
const router = express.Router();
const userManager = new UserManager();

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userManager.findByEmail(email);
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        const isMatch = comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });

        res.json({ message: "Login exitoso", token });
    } catch (error) {
        console.error("ERROR EN LOGIN:", error);
        res.status(500).json({ message: "Error en el login", error });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada" });
});

// Current user
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export default router;
