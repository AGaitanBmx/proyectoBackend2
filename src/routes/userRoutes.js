import { Router } from "express";
import { userRepository } from "../repositories.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
      const users = await userRepository.getAll();
      console.log("Usuarios obtenidos:", users); // 👈 VERIFICACIÓN
      res.json(users);
    } catch (error) {
      console.error("Error en GET /users:", error); // 👈 MÁS INFO
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  });

// Obtener un usuario por ID
router.get("/:uid", async (req, res) => {
  try {
    const user = await userRepository.findById(req.params.uid);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error("Error en GET /users/:uid:", error); // 👈 Para más detalles
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const newUser = await userRepository.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el usuario" });
  }
});

// Actualizar un usuario
router.put("/:uid", async (req, res) => {
  try {
    const updatedUser = await userRepository.update(req.params.uid, req.body);
    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el usuario" });
  }
});

// Eliminar un usuario
router.delete("/:uid", async (req, res) => {
  try {
    const deleted = await userRepository.delete(req.params.uid);
    if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

export default router;
