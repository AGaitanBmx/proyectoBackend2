import { Router } from "express";
import { TicketManager } from "../dao/managers/TicketManager.js";
import { authMiddleware } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = Router();
const ticketManager = new TicketManager();

// Crear un ticket
router.post("/", authMiddleware, authorize(["user", "admin"]), async (req, res) => {
    try {
        const { amount, purchaser } = req.body;

        // Validación mínima
        if (!amount || !purchaser) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        const ticketData = {
            amount,
            purchaser,
            purchase_datetime: new Date(),
        };

        const ticket = await ticketManager.createTicket(ticketData);
        res.status(201).json({ message: "Ticket creado", ticket });
    } catch (error) {
        console.error("Error al crear el ticket:", error);
        res.status(500).json({ message: "Error al crear el ticket" });
    }
});

// Obtener un ticket por ID
router.get("/:tid", async (req, res) => {
    const { tid } = req.params;

    try {
        const ticket = await ticketManager.getTicketById(tid);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        res.json({ message: "Ticket encontrado", ticket });
    } catch (error) {
        console.error("Error al obtener el ticket:", error);
        res.status(500).json({ message: "Error al obtener el ticket" });
    }
});

// Obtener todos los tickets de un usuario
router.get("/user/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        const tickets = await ticketManager.getTicketsByUser(uid);
        res.json({ message: "Tickets del usuario obtenidos", tickets });
    } catch (error) {
        console.error("Error al obtener los tickets del usuario:", error);
        res.status(500).json({ message: "Error al obtener los tickets del usuario" });
    }
});

// Obtener todos los tickets (solo admin)
router.get("/", authMiddleware, authorize(["admin"]), async (req, res) => {
    try {
        const tickets = await ticketManager.getAllTickets();
        res.json({ message: "Tickets obtenidos", tickets });
    } catch (error) {
        console.error("Error al obtener todos los tickets:", error);
        res.status(500).json({ message: "Error al obtener todos los tickets" });
    }
});


// Obtener tickets por usuario
router.get("/user/:uid", authMiddleware, async (req, res) => {
    try {
        const { uid } = req.params;
        const tickets = await ticketManager.getTicketsByUser(uid);
        res.json({ message: "Tickets del usuario", tickets });
    } catch (error) {
        console.error("Error al obtener tickets del usuario:", error);
        res.status(500).json({ message: "Error al obtener tickets del usuario" });
    }
});

// Cancelar un ticket
router.delete("/:tid", authMiddleware, authorize(["admin"]), async (req, res) => {
    try {
        const { tid } = req.params;
        const result = await ticketManager.deleteTicket(tid);
        if (!result) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }
        res.json({ message: "Ticket cancelado correctamente" });
    } catch (error) {
        console.error("Error al cancelar el ticket:", error);
        res.status(500).json({ message: "Error al cancelar el ticket" });
    }
});

export default router;
