import User from "../models/user.model.js";
import { hashPassword } from "../utils/bcrypt.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error });
    }
};

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // Encripta la contraseña
        const hashedPassword = hashPassword(password);

        // Crea el usuario en la DB
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado con éxito" });

    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error });
    }
};
