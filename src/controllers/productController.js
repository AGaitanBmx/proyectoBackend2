import { ProductRepository } from "../dao/repositories/ProductRepository.js";

const productRepo = new ProductRepository();


export const getProducts = async (req, res) => {
    const products = await productRepo.getAll();
    res.json(products);
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    const product = await productRepo.getById(pid);
    res.json(product);
};

export const createProduct = async (req, res) => {
    const product = await productRepo.create(req.body);
    console.log("Usuario autenticado:", req.user); // Verificar el usuario autenticado
    res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    const updated = await productRepo.update(pid, req.body);
    res.json(updated);
};

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    await productRepo.delete(pid);
    res.json({ message: "Producto eliminado" });
};
