import { Router } from "express";
import { CartManager } from "../dao/managers/CartManager.js";
import { authMiddleware } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ message: "Error al crear el carrito" });
  }
});

// Obtener un carrito por ID
router.get("/:cid", authMiddleware, async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.json(cart);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", authMiddleware, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ message: "Error al agregar producto al carrito" });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", authMiddleware, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al actualizar cantidad del producto:", error);
    res.status(500).json({ message: "Error al actualizar la cantidad del producto" });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", authMiddleware, async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ message: "Error al eliminar producto del carrito" });
  }
});

// Vaciar el carrito
router.delete("/:cid", authMiddleware, async (req, res) => {
  try {
    const { cid } = req.params;

    const clearedCart = await cartManager.clearCart(cid);
    res.json(clearedCart);
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res.status(500).json({ message: "Error al vaciar el carrito" });
  }
});

export default router;
