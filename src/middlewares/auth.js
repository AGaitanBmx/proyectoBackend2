import passport from "passport";

export const authMiddleware = (req, res, next) => {
    console.log("Cookie recibida:", req.cookies); // Verificar la cookie
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            console.log("Error o usuario no encontrado:", err, user);
            return res.status(401).json({ message: "No autorizado" });
        }
        req.user = user;
        next();
    })(req, res, next);
};