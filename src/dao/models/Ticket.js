import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

export default TicketModel;
