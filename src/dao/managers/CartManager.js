import { CartModel } from "../models/Cart.js";
import { v4 as uuidv4 } from "uuid";
import { TicketModel } from "../models/Ticket.js";
import { ProductModel } from "../models/Product.js"; // 👈 AGREGA ESTA LÍNEA
export class CartManager {
  constructor() {
    this.productModel = ProductModel; // 👈 AGREGA ESTA LÍNEA
  }
  
  async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw new Error("Error al crear el carrito");
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate("products.productId");
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw new Error("Error al agregar producto al carrito");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex >= 0) {
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      throw new Error("Error al actualizar la cantidad del producto");
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId
      );

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw new Error("Error al eliminar producto del carrito");
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      throw new Error("Error al vaciar el carrito");
    }
  }

  async deleteCart(cartId) {
    try {
      const result = await CartModel.findByIdAndDelete(cartId);
      return result;
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
      throw new Error("Error al eliminar el carrito");
    }
  }

  //purchase de tikcets
  async purchaseCart(cartId, userEmail) {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productsToPurchase = [];
    const productsWithoutStock = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await this.productModel.findById(item.productId);

      if (!product) {
        console.log("Producto no encontrado en BD:", item.product);
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity;
        productsToPurchase.push(item);
      } else {
        productsWithoutStock.push(item);
      }
    }

    const ticket = await TicketModel.create({
      code: uuidv4(),
      amount: totalAmount,
      purchaser: userEmail,
    });

    cart.products = productsWithoutStock;
    await cart.save();

    return {
      ticket,
      productsNotProcessed: productsWithoutStock,
    };
}   
}
