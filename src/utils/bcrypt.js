import bcrypt from "bcrypt";

// Encriptar contraseña
export const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Comparar contraseña ingresada con la almacenada
export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};