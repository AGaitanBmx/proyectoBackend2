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

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", authMiddleware, authorize(["admin"]), createProduct);
router.put("/:pid", authMiddleware, authorize(["admin"]), updateProduct);
router.delete("/:pid", authMiddleware, authorize(["admin"]), deleteProduct);

export default router;