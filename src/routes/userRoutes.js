import express from "express";
import { getUsers, getUserById, registerUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Rutas del CRUD de usuarios
router.get("/", getUsers); // Obtener todos los usuarios
router.get("/:id", getUserById); // Obtener usuario por ID
router.post("/", registerUser); // Registrar usuario
router.put("/:id", updateUser); // Actualizar usuario
router.delete("/:id", deleteUser); // Eliminar usuario

export default router;