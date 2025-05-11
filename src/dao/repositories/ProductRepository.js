import {ProductManager} from '../managers/ProductManager.js';

export class ProductRepository {
  constructor() {
    this.dao = new ProductManager();
  }

  async getAll(filter = {}, options = {}) {
    return this.dao.getAll(filter, options);
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async create(productData) {
    return this.dao.create(productData);
  }

  async update(id, data) {
    return this.dao.update(id, data);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}
