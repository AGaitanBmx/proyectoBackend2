import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authMiddleware.js";
import { ProductManager } from "../dao/managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

//vista de productos
router.get('/view', async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render('products', { title: 'Productos', products });
  } catch (error) {
    res.status(500).send('Error al cargar productos');
  }
});

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", authMiddleware, authorize(["admin"]), createProduct);
router.put("/:pid", authMiddleware, authorize(["admin"]), updateProduct);
router.delete("/:pid", authMiddleware, authorize(["admin"]), deleteProduct);

export default router;