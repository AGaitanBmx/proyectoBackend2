import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserManager } from "../dao/managers/UserManager.js";
import { comparePassword } from "../utils/bcrypt.js";
import { UserModel } from "../dao/models/User.js";
import { CartModel } from "../dao/models/Cart.js";
import { hashPassword } from "../utils/bcrypt.js";
import passport from "passport";

dotenv.config();
const router = express.Router();
const userManager = new UserManager();

//register
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const hashedPassword = hashPassword(password);

        const newCart = new CartModel({ products: [] });
        await newCart.save();

        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user",
            cart: newCart._id,
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado con carrito", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
});

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
