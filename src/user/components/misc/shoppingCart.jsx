import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/navMenus.css';
import { MdCancel } from "react-icons/md";
import { getCookie, setCookie } from '../../../scripts/handleCookies';
import { loadStripe } from '@stripe/stripe-js';
import sanitizeString from '../../../scripts/sanitizeStrings';
import zapopanJSON from '../../../data/Zapopan.json';
import { BASE_URL, STRIPE_PUBLIC_KEY } from '../../../scripts/response';
import React from 'react';


const stripePromise = loadStripe(STRIPE_PUBLIC_KEY); // Reemplaza con tu clave pública de Stripe

function ShoppingCart({ visible, isLogged }) {
  const dialogOrderForm = useRef(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastCartValue, setLastCartValue] = useState('');
  const [minTime, setMinTime] = useState('11:00');
  const [localities, setLocalities] = useState(zapopanJSON); // Estado para las localidades
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

  function openDialog() {
      dialogOrderForm.current.showModal();
  }
  
  function closeDialog() {
      dialogOrderForm.current.close();
  }

  const handleMunicipalityChange = (event) => {
    const municipality = event.target.value;
    if (municipality === 'zapopan') {
      setLocalities(zapopanJSON);
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
      setMinTime('11:00'); // Rango mínimo predeterminado
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
    //console.log(orderData);
    try {
      localStorage.setItem('orderData', JSON.stringify(orderData));
      const response = await fetch(`${BASE_URL}/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: items }),
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
        onClick={() => isLogged.login ? openDialog() : navigate('/Login')}>Continuar</button>

          <dialog className="order-details-section" ref={dialogOrderForm}>
            <h4 style={{ color: "white", textAlign: "center" }}>Detalles de entrega</h4>

            <form onSubmit={handleClickPay} className="order-form">
              {/* Sección de dirección */}
              <div className="form-section">
                <input type="number" name="cp" placeholder="CP" maxLength={5} minLength={5} title='Ingresa un CP valido' required />
              </div>

              <div className="form-section" style={{display: "flex", flexDirection: "row", maxWidth: '95%'}}>
                <select name="municipality" onChange={handleMunicipalityChange} required>
                  <option value="zapopan">Zapopan</option>
                </select>

                <select name="locality" required>
                  <option value="">Selecciona una localidad</option>
                  {localities.map((locality, index) => (
                    <option key={index} value={locality.cp}>
                      {locality.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <input type="text" name="address" placeholder="Dirección" maxLength={60} title='Limite de 60 caracteres' required />
              </div>

              <hr />

              {/* Sección de destinatario */}
              <div className="form-section">
                <label>Nombre del destinatario</label>
                <input type="text" name="receiverName" placeholder="Destinatario" maxLength={20} title='Limite de 20 caracteres' required />
              </div>

              {/* Sección de fecha y hora */}
              <div className="form-section">
                <label>Fecha de entrega</label>
                  <div style={{display: "flex", flexDirection: "row", maxWidth: '95%'}}>
                    <input
                    type="date"
                    name="date"
                    min={today}
                    onChange={handleDateChange}
                    title='¿Que dia necesitas el pedido?'
                    required
                    style={{ color: "black" }}
                    />
                    <input
                      type="time"
                      name="time"
                      min={minTime}
                      max="23:00"
                      title='Horario de 11:00 am - 11:00 pm'
                      required
                      style={{ color: "black" }}
                    />
                </div>
              </div>

              {/* Sección de carta opcional */}
              <div className="form-section">
                <label>Mensaje (Opcional)</label>
                <textarea name="letter" placeholder="Carta (Opcional)" rows={3} maxLength={250} title='Limite de 250 caracteres'></textarea>
              </div>

              {/* Botones */}
              <div className="form-buttons">
                <button type="submit" className="btn-pay">Pagar</button>
                <button type="button" onClick={closeDialog} className="btn-cancel">Cancelar</button>
              </div>
            </form>
          </dialog>

    </section>
  );
}

export default ShoppingCart;
