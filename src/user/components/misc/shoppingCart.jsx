import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/navMenus.css';
import { MdCancel } from "react-icons/md";
import { getCookie, setCookie } from '../../../scripts/handleCookies';
import { loadStripe } from '@stripe/stripe-js';
import sanitizeString from '../../../scripts/sanitizeStrings';
import guadalajaraJSON from '../../../data/Guadalajara.json';
import zapopanJSON from '../../../data/Zapopan.json';

const stripePromise = loadStripe('pk_test_51Qh4RcJRYDnPPqdIgKGPqbpmZYspZ82Gt4UfkFTwwMNv6GgyjFWq0kRbBmZYYEhn5eHTtFo2i1OPXlqpCiNnhHVP00DYwHgPDE'); // Reemplaza con tu clave pública de Stripe

function ShoppingCart({ visible, isLogged }) {
  const [orderFromVisible, setOrderFormVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastCartValue, setLastCartValue] = useState('');
  const [minTime, setMinTime] = useState('08:00');
  const [localities, setLocalities] = useState([]); // Estado para las localidades
  const navigate = useNavigate();

  useEffect(() => {
    const updateCart = () => {
      let gt = getCookie('cart');
      if (gt !== lastCartValue) {
        setLastCartValue(gt);
        let data = gt ? gt : '';
        const formattedInput = `[${data.replace(/}{/g, '},{')}]`;
        const jsonArray = JSON.parse(formattedInput);
        setItems(jsonArray);
      }
      const initialTotal = items.reduce((sum, item) => sum + item.price, 0);
      setTotal(initialTotal);
    };

    const intervalId = setInterval(updateCart, 1000); // Verifica cada segundo
    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
  }, [lastCartValue, items]);

  const handleMunicipalityChange = (event) => {
    const municipality = event.target.value;
    if (municipality === 'guadalajara') {
      setLocalities(guadalajaraJSON);
    } else if (municipality === 'zapopan') {
      setLocalities(zapopanJSON);
    } else {
      setLocalities([]);
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today) {
      const now = new Date();
      now.setHours(now.getHours() + 2); // Sumar 2 horas
      let hours = now.getHours();
      let minutes = now.getMinutes();

      // Ajustar a las restricciones (8 AM - 10 PM)
      if (hours < 8) {
        hours = 8;
        minutes = 0;
      } else if (hours >= 22) {
        hours = 22;
        minutes = 0;
      }

      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      setMinTime(formattedTime);
    } else {
      setMinTime('08:00'); // Rango mínimo predeterminado
    }
  };

  const handleDelete = (indexToRemove) => {
    const updatedItems = items.filter((_, index) => index !== indexToRemove);
    setItems(updatedItems);

    const formatted = updatedItems.map(item => JSON.stringify(item)).join('');
    setCookie('cart', formatted);
  };

  async function handleClickPay(event) {
    event.preventDefault();
    let orderData = {
      userId: isLogged.id,
      receiver: sanitizeString(event.target.receiverName.value, 2),
      items: items,
      date: event.target.date.value,
      time: event.target.time.value,
      address: {
        address: sanitizeString(event.target.address.value, 2),
        cp: sanitizeString(event.target.cp.value, 2),
        municipality: event.target.municipality.value,
        locality: event.target.locality.value
      },
      letter: sanitizeString(event.target.letter.value, 1)
    }
    console.log(orderData);
    try {
      const stripe = await stripePromise;

      const response = await fetch('http://localhost:5000/api/bouquets/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, orderData }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      navigate('/handlePay?state=false');
      console.error('Error al iniciar el pago:', error);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className='shopping-cart' style={{ display: visible ? 'flex' : 'none' }}>
      <div className='orders-div'>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className='order-container'>
              <p>{item.name}</p>
              <p style={{ color: 'green' }}>${item.price}</p>
              <MdCancel color='White' style={{ cursor: 'pointer' }} size={32} onClick={() => handleDelete(index)} />
            </div>
          ))
        ) : (
          <p style={{ alignSelf: 'center' }}>Nada por aquí</p>
        )}
      </div>

      <div>
        <p>Total</p>
        <p style={{ color: 'green' }}>${total}</p>
      </div>

      <button style={{ display: items.length ? '' : 'none' }}
        onClick={() => isLogged.login ? setOrderFormVisible(true) : navigate('/Login')}>Continuar</button>

      <section className='order-details-section' style={{ display: orderFromVisible ? 'flex' : 'none' }}>
        <h4 style={{ color: 'white' }}>Detalles de entrega</h4>
        <form onSubmit={handleClickPay}>
          <input type="number" name='cp' placeholder='CP' />
          <div>
            <select name="municipality" onChange={handleMunicipalityChange} defaultValue={'guadalajara'}>
              <option value="guadalajara">Guadalajara</option>
              <option value="zapopan">Zapopan</option>
            </select>
            <select name="locality">
              <option value="" defaultValue={''}>Selecciona una localidad</option>
              {localities.map((locality, index) => (
                <option key={index} value={locality.cp}>
                  {locality.nombre}
                </option>
              ))}
            </select>
          </div>
          <input type="text" name="address" placeholder='Direccion' />
          <hr />
          <input type="text" name="receiverName" placeholder='Destinatario' required />
          <div>
            <input required
              type="date"
              name="date"
              id="dateInput"
              min={today}
              onChange={handleDateChange}
            />
            <input type="time" name="time" min={minTime} max="22:00" required />
          </div>
          <textarea name="letter" placeholder='Carta (Opcional)' rows={3}></textarea>
          <button type='submit' style={{ width: '100%' }}>Pagar</button>
          <button onClick={() => setOrderFormVisible(false)} style={{ width: '100%' }}>Cancelar</button>
        </form>
      </section>
    </section>
  );
}

export default ShoppingCart;
