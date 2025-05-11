import { ProductModel } from "../models/Product.js";

export class ProductManager {
  async getAll() {
    return await ProductModel.find(); // acá podés agregar filtros más adelante
  }

  async getById(pid) {
    return await ProductModel.findById(pid);
  }

  async create(product) {
    return await ProductModel.create(product);
  }

  async update(pid, updatedProduct) {
    return await ProductModel.findByIdAndUpdate(pid, updatedProduct, { new: true });
  }

  async delete(pid) {
    return await ProductModel.findByIdAndDelete(pid);
  }
}
