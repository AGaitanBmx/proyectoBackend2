import { UserModel } from "../dao/models/User.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { CartModel } from "../dao/models/Cart.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error });
    }
};

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const hashedPassword = hashPassword(password);

        // Crear carrito vacío
        const newCart = new CartModel({ products: [] });
        await newCart.save();

        // Crear usuario con referencia al carrito
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user",
            cart: newCart._id
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado con carrito", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const isMatch = comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Opcional: si usás JWT, podés generar un token acá

        return res.status(200).json({ message: "Login exitoso", user });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
};


// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error });
    }
};
