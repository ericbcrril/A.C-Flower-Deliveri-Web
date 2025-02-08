const Order = require('../models/orders');
const Stripe = require('stripe');
const STRIPE_SECRETE_KEY = process.env.STRIPE_SECRETE_KEY;
const stripe = Stripe(STRIPE_SECRETE_KEY); // Reemplaza con tu clave secreta de Stripe
const BASE_URL_FRONT = process.env.BASE_URL_FRONT;

exports.createCheckoutSession = async (req, res) => {
    try {
        const { items } = req.body; // Recibir los items del pedido desde el frontend

        //console.log(items);
  
        if (!items || items.length === 0) {
            return res.status(400).send('No hay productos.');
        }
  
        const lineItems = items.map(item => ({
            price: item.stripePriceId,
            quantity: 1,
        }));
  
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `${BASE_URL_FRONT}/handlePay?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL_FRONT}/handlePay?session_id={CHECKOUT_SESSION_ID}`,
        });
  
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error al crear la sesión de pago:', error.message);
        res.status(500).send('Error al crear la sesión de pago.');
    }
  };
  
  exports.paymentStatus = async (req, res) => {
    const { sendEmailOrder } = require('../../functions');

    try {

        const sessionId = req.params.session_id;
        const { orderData } = req.body || false;
        if (!sessionId) return res.status(400).json({ success: false });

        // 🔹 Consultar directamente a Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // 🔹 Si el pago está completado, devolver éxito
        const isPaid = session.payment_status === 'paid';        

        if(isPaid && orderData){
                // Crear el objeto de orden
                const orderDataEmail = {
                    userId: orderData.userId,
                    receiver: orderData.receiver,
                    date: orderData.date,
                    time: orderData.time,
                    letter: orderData.letter,
                    address: orderData?.address?.address || 'Visita la Web'
                };
            
                // Crear el nuevo item y guardarlo en la base de datos
                const newOrder = new Order({
                    userId: orderData.userId,
                    receiver: orderData.receiver,
                    date: orderData.date,
                    time: orderData.time,
                    letter: orderData.letter,
                    address: orderData.address,
                    bouquet: orderData.bouquet,
                    items: orderData.items, 
                    finalized: false, 
                    state: {state0: false, state1: false, state2: false,}
                });
                
                await newOrder.save();
            
                // Enviar el correo
                await sendEmailOrder(orderDataEmail);
        }

        res.json({ success: isPaid });
    } catch (error) {
        console.error('Error verificando el pago en Stripe:', error.message);
        return res.status(500).json({ success: false });
    }
};