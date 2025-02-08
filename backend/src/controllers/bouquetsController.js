// backend/controllers/itemController.js
const Item = require('../models/bouquets');
const Order = require('../models/orders');
const Stripe = require('stripe');
const STRIPE_SECRETE_KEY = process.env.STRIPE_SECRETE_KEY;
const stripe = Stripe(STRIPE_SECRETE_KEY); // Reemplaza con tu clave secreta de Stripe
const BASE_URL_FRONT = process.env.BASE_URL_FRONT;
const BASE_URL_BACK = process.env.BASE_URL_BACK;
// Obtener todos los registros de una coleccion
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

// Obtener un registro por su ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    res.json(item);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

//Obtener registro por la clave, (Por un campo en este caso se uso el campo key)
exports.getItemByKey = async (req, res) => {
  try {
    const key = req.params.key; // Obtener la clave desde los parámetros de la solicitud
    //console.log('recibo la llave', key);
    const item = await Item.findOne({ key: key }); // Buscar una registro por su clave en la base de datos
    if (!item) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    res.json(item); // Devolver la registro encontrado como respuesta JSON
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};


exports.createItem = async (req, res) => {
  try {
    const { imageName, name, price, description, image } = req.body;

    // Validar que se reciban todos los campos necesarios
    if (!image || !name || !price || !description) {
      return res.status(400).send('Faltan datos necesarios para crear el item');
    }

    // Crear el producto en Stripe
    const product = await stripe.products.create({
      name,
      description,
    });

    // Crear el precio en Stripe
    const priceInStripe = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convertir a centavos (Stripe usa centavos)
      currency: 'mxn', // Cambia según tu moneda
      product: product.id, // Vincular al producto creado
    });

    // Guardar el producto en la base de datos
    const newItem = new Item({
      image,
      name,
      price,
      description,
      stripeProductId: product.id, // Guardar el ID del producto de Stripe
      stripePriceId: priceInStripe.id, // Guardar el ID del precio de Stripe
    });

    await newItem.save();

    res.json({
      message: 'Item creado exitosamente',
      item: newItem,
    });
  } catch (error) {
    console.error('Error al crear el item:', error.message);
    res.status(500).send('Error del servidor');
  }
};

// Actualizar un registro
exports.updateItem = async (req, res) => {
  try {
    const { image, name, price, description } = req.body;

    // Buscar el producto en la base de datos
    const existingItem = await Item.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }

    // Actualizar el producto en Stripe
    await stripe.products.update(existingItem.stripeProductId, {
      name,
      description,
    });

    // Actualizar el precio en Stripe (crear uno nuevo)
    const newPrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100),
      currency: 'mxn',
      product: existingItem.stripeProductId,
    });

    // Actualizar el producto en la base de datos
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        image,
        name,
        price,
        description,
        stripePriceId: newPrice.id, // Vincular el nuevo precio
      },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error('Error al actualizar el item:', error.message);
    res.status(500).send('Error del servidor');
  }
};

// Eliminar un registro
exports.deleteItem = async (req, res) => {
  try {
    // Buscar el producto en la base de datos
    const existingItem = await Item.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }

    // Eliminar el producto en Stripe
    await stripe.products.update(existingItem.stripeProductId, { active: false });

    // Eliminar el producto de la base de datos
    await Item.findByIdAndDelete(req.params.id);

    res.json({ mensaje: 'Registro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el item:', error.message);
    res.status(500).send('Error del servidor');
  }
};