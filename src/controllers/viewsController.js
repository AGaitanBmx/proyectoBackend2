import { ProductModel } from "../dao/models/Product.js";
import { CartModel}  from "../dao/models/Cart.js";
import { UserModel } from "../dao/models/User.js";
import { CartManager } from "../dao/managers/CartManager.js";
import { ProductManager } from "../dao/managers/ProductManager.js"; 

export const renderLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

export const renderRegister = (req, res) => {
  res.render("register", { title: "Registro" });
};

export const renderProducts = async (req, res) => {
  const user = req.user;

  if (!user) return res.redirect("/login");

  const products = await ProductModel.find().lean();
  const cart = await CartModel.findOne({ userId: user._id }).lean(); // Cambiado a userId

  if (!cart) {
    // Si no existe carrito, crea uno nuevo
    const newCart = await CartModel.create({ userId: user._id, products: [] });
    user.cart = newCart._id;
    await user.save();
  }

  res.render("products", {
    title: "Productos",
    products,
    user,
    cartId: cart?._id || user.cart, // Asegura que siempre haya un cartId
    isAdmin: user.role === "admin"
  });
};

export const renderAdminPanel = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user || user.role !== "admin") {
      return res.status(403).render('error', { 
        message: "Acceso denegado: Se requieren privilegios de administrador" 
      });
    }

    const products = await ProductModel.find().lean(); // Obtiene todos los productos
    
    res.render("adminPanel", { 
      title: "Panel Admin", 
      user,
      products // Pasa los productos a la vista
    });

  } catch (error) {
    console.error("Error al renderizar panel admin:", error);
    res.status(500).render('error', { 
      message: "Error al cargar el panel de administración" 
    });
  }
};

const cartManager = new CartManager();

export const renderCart = async (req, res) => {
  try {
    console.log('Usuario autenticado ID:', req.user._id);
    // 1. Obtener el usuario con su carrito poblado
    const user = await UserModel.findById(req.user._id).populate({
      path: 'cart',
      populate: {
        path: 'products.productId',
        model: 'Product'
      }
    }).lean();

     console.log('Usuario con carrito poblado:', JSON.stringify(user, null, 2));

    if (!user || !user.cart) {
      console.log('No se encontró usuario o carrito');
      return res.render('cart', {
        hasProducts: false,
        user: req.user
      });
    }
    //ultimo log de depuracion
    console.log('Productos en carrito:', user.cart.products);

    // 2. Procesar los productos del carrito
    const validProducts = user.cart.products
      .filter(item => item.productId) // Filtrar productos existentes
      .map(item => ({
        id: item.productId._id.toString(),
        title: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
        subtotal: (item.productId.price * item.quantity).toFixed(2),
        thumbnail: item.productId.thumbnail || 'https://via.placeholder.com/150'
      }));

    // 3. Calcular el total
    const total = validProducts
      .reduce((sum, p) => sum + parseFloat(p.subtotal), 0)
      .toFixed(2);

    // 4. Renderizar la vista con los datos correctos
    res.render('cart', {
      products: validProducts,
      total,
      user: {
        ...req.user.toObject(),
        cart: user.cart._id.toString()
      },
      hasProducts: validProducts.length > 0
    });

  } catch (error) {
    console.error('Error al renderizar el carrito:', error);
    res.status(500).render('cart', {
      hasProducts: false,
      user: req.user
    });
  }
};


