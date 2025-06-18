import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js"; // este autentica con Passport y pone req.user
import { authorize } from "../middlewares/authMiddleware.js"; // este valida el rol
import passport from "passport";
import {
  renderLogin,
  renderRegister,
  renderProducts,
  renderAdminPanel,
  renderCart
} from "../controllers/viewsController.js";

const router = Router();

router.get("/", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) {
      req.user = user;
      return renderProducts(req, res);
    } else {
      // No está logueado → render con modal
      return renderProducts(req, res, true);
    }
  })(req, res, next);
});
router.get("/login", renderLogin);
router.get("/register", renderRegister);
router.get("/cart", authMiddleware, renderCart);
// requiere autenticación + rol admin
router.get("/admin", authMiddleware, authorize(["admin"]), renderAdminPanel);

export default router;