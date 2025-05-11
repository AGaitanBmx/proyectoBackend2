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
router.get("/:tid", authMiddleware, authorize(["user", "admin"]), async (req, res) => {
    try {
        const { tid } = req.params;
        const ticket = await ticketManager.getTicketById(tid);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        res.json({ ticket });
    } catch (error) {
        console.error("Error al obtener el ticket:", error);
        res.status(500).json({ message: "Error al obtener el ticket" });
    }
});

export default router;
