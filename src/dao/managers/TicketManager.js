import {TicketModel} from "../models/Ticket.js";
import { v4 as uuidv4 } from "uuid";

export class TicketManager {

  constructor(){
    this.model = TicketModel;
  }
    async createTicket(ticketData) {
        try {
            const code = uuidv4();
            const newTicket = { ...ticketData, code };
            const ticket = await TicketModel.create(newTicket);
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

    async getTicketsByUser(userId) {
      try {
          const tickets = await TicketModel.find({ purchaser: userId });
          return tickets;
      } catch (error) {
          console.error("Error al obtener los tickets del usuario:", error);
          throw new Error("Error al obtener los tickets del usuario");
      }
  }

  async getAllTickets() {
    try {
        const tickets = await TicketModel.find();
        return tickets;
    } catch (error) {
        console.error("Error al obtener todos los tickets:", error);
        throw new Error("Error al obtener todos los tickets");
    }
}

async getTicketsByUser(userId) {
  try {
      const tickets = await TicketModel.find({ purchaser: userId });
      return tickets;
  } catch (error) {
      console.error("Error al obtener los tickets del usuario:", error);
      throw new Error("Error al obtener los tickets del usuario");
  }
}

async deleteTicket(ticketId) {
  try {
    const result = await this.model.findByIdAndDelete(ticketId);
    return result;  // Si no encuentra, devuelve null, si elimina devuelve el documento eliminado
  } catch (error) {
    console.error("Error al eliminar el ticket:", error);
    throw new Error("Error al eliminar el ticket");
  }
}
}