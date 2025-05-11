import { UserManager } from "./dao/managers/UserManager.js";
import { UserRepository } from "./dao/repositories/UserRepository.js";

import { CartManager } from "./dao/managers/CartManager.js";
import { CartRepository } from "./dao/repositories/CartRepository.js";

import { ProductManager } from "./dao/managers/ProductManager.js";
import { ProductRepository} from "./dao/repositories/ProductRepository.js";

import { TicketManager } from "./dao/managers/TicketManager.js";
import { TicketRepository } from "./dao/repositories/TicketRepository.js";

// Instanciar managers
const userManager = new UserManager();
const cartManager = new CartManager();
const productManager = new ProductManager();
const ticketManager = new TicketManager();

// Instanciar repositories
export const userRepository = new UserRepository(userManager);
export const cartRepository = new CartRepository(cartManager);
export const productRepository = new ProductRepository(productManager);
export const ticketRepository = new TicketRepository(ticketManager);
