export const authorize = (roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        error: "Acceso denegado. Se requiere rol: " + roles.join(" o ")
      });
    }
    next();
  };
};