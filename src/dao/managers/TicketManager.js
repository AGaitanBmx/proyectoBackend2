import TicketModel from "../models/Ticket.js";

export class TicketManager {
  
  async createTicket(ticketData) {
    try {
      const ticket = await TicketModel.create(ticketData);
      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      throw new Error("Error al crear el ticket");
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await TicketModel.findById(ticketId);
      return ticket;
    } catch (error) {
      console.error("Error al obtener el ticket:", error);
      throw new Error("Error al obtener el ticket");
    }
  }
}
