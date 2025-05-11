export class UserRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getAll = () => {
      return this.dao.getAll();
    };
  
    findById = (id) => {
      return this.dao.findById(id); // ✅ Ahora coincide con UserManager
    };
  
    findByEmail = (email) => { // También corrige esto si usas `findByEmail` en UserManager
      return this.dao.findByEmail(email);
    };
    
    update = (id, user) => {
      return this.dao.update(id, user); // ✅ Ahora sí retorna el resultado
    };

    delete = (id) => {
      return this.dao.delete(id); // ✅
    };

    create = (user) => {
      return this.dao.create(user);
    };
  }