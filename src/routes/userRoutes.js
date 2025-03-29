import express from "express";
import { getUsers, getUserById, registerUser, updateUser, deleteUser } from "../controllers/userController.js";
import { authorize } from "../middlewares/authMiddleware.js";
import passport from "passport";


const router = express.Router();

// Rutas del CRUD de usuarios
router.get("/", getUsers); // Obtener todos los usuarios
router.get("/:id", getUserById); // Obtener usuario por ID
router.post("/", registerUser); // Registrar usuario
router.put("/:id", updateUser); // Actualizar usuario
router.delete("/:id", deleteUser); // Eliminar usuario
// Solo los admins pueden acceder
router.get("/", passport.authenticate("jwt", { session: false }), authorize(["admin"]), async (req, res) => {
    const users = await User.find();
    res.json(users);
});

export default router;