export class TicketRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    create = (ticketData) => {
      return this.dao.create(ticketData);
    };
  }
  