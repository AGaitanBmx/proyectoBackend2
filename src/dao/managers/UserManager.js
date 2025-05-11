import { UserModel } from "../models/User.js";
import "../models/Cart.js";

export class UserManager {
  async create(user) {
    return await UserModel.create(user);
  }

  async findById(uid) {
    return await UserModel.findById(uid).populate('cart');
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email }).populate('cart');
  }

  async getAll() {
    return await UserModel.find().populate('cart');
  }

  async update(uid, updatedUser) {
    return await UserModel.findByIdAndUpdate(uid, updatedUser, { new: true });
  }

  async delete(uid) {
    return await UserModel.findByIdAndDelete(uid);
  }
}
