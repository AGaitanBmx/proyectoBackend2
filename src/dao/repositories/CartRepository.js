export class CartRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    create = () => {
      return this.dao.create();
    };
  
    getById = (id) => {
      return this.dao.getById(id);
    };
  
    update = (cid, cart) => {
      return this.dao.update(cid, cart);
    };
  
    delete = (cid) => {
      return this.dao.delete(cid);
    };
  
    purchase = (cid) => {
      return this.dao.purchase(cid);
    };
  }
  