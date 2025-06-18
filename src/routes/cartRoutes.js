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
router.post("/:cid/products/:pid", authMiddleware, authorize(["user"]), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    // Asegura que la cantidad sea al menos 1 si no se especifica o es inválida
    quantity = parseInt(quantity) > 0 ? parseInt(quantity) : 1;

    // Verifica que el carrito exista
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "El carrito no existe" });
    }

    // Verifica que el producto exista
    const product = await cartManager.productModel.findById(pid);
    if (!product) {
      return res.status(404).json({ message: "El producto no existe" });
    }

    // Agrega el producto al carrito
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    
    res.json({ message: "Producto agregado al carrito", cart: updatedCart });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ message: "Error al agregar producto al carrito" });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", authMiddleware, authorize(["user"]), async (req, res) => {
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
router.delete("/:cid/products/:pid", authMiddleware, authorize(["user"]), async (req, res) => {
 try {
    const { cid, pid } = req.params;
    const cart = await cartManager.removeProductFromCart(cid, pid);
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Carrito no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado del carrito',
      cart // Opcional: enviar el carrito actualizado
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Vaciar el carrito
router.delete("/:cid", authMiddleware, authorize(["user"]), async (req, res) => {
  try {
    const { cid } = req.params;

    const clearedCart = await cartManager.clearCart(cid);
    res.json(clearedCart);
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res.status(500).json({ message: "Error al vaciar el carrito" });
  }
});

router.post("/:cid/purchase", authMiddleware, authorize(["user"]), async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email;

    const result = await cartManager.purchaseCart(cid, userEmail);

    res.json({
      message: "Compra procesada",
      ticket: result.ticket,
      productosNoProcesados: result.productsNotProcessed
    });
  } catch (error) {
    console.error("Error en compra:", error);
    res.status(500).json({ error: "Error al procesar la compra" });
  }
});

export default router;
