import React, { useState, useMemo, useEffect } from "react";
import NavBar from "../components/misc/navbar";
import "../styles/views/makeFlowers.css";
import { getItems } from "../../scripts/apis";
import sanitizeString from '../../scripts/sanitizeStrings';
import guadalajaraJSON from '../../data/Guadalajara.json';
import zapopanJSON from '../../data/Zapopan.json';
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe('pk_test_51Qh4RcJRYDnPPqdIgKGPqbpmZYspZ82Gt4UfkFTwwMNv6GgyjFWq0kRbBmZYYEhn5eHTtFo2i1OPXlqpCiNnhHVP00DYwHgPDE'); // Reemplaza con tu clave pública de Stripe
//const imgFlower = require('/iconsFlowerTool/flowers/0.webp');

function MakeFlowers({ isLogged }) {

// Modelo de datos
const [items, setItems] = useState([
  { image: '/iconsFlowerTool/flowers/0.webp',
    _id: '0', name: 'flor0', price: 12, type: 'flower' },
  { image: '/iconsFlowerTool/flowers/4.webp',
    _id: '0', name: 'flor0', price: 12, type: 'flower' },
  { image: '/iconsFlowerTool/flowers/1.webp',
    _id: '0', name: 'flor0', price: 12, type: 'flower' },
 { image: '/iconsFlowerTool/flowers/2.webp',
    _id: '1', name: 'flor1', price: 15, type: 'flower' },
 { image: '/iconsFlowerTool/flowers/3.webp',
    _id: '2', name: 'flor2', price: 20, type: 'flower' },
 { image: '/iconsFlowerTool/accessories/2.webp',
    _id: '3', name: 'accessory1', price: 5, type: 'accessory' },
 { image: '/iconsFlowerTool/accessories/0.webp', 
    _id: '4', name: 'accessory2', price: 7, type: 'accessory' },
 { image: '/iconsFlowerTool/accessories/3.webp', 
    _id: '4', name: 'accessory2', price: 7, type: 'accessory' },
 { image: '/iconsFlowerTool/accessories/1.webp', 
    _id: '4', name: 'accessory2', price: 7, type: 'accessory' },
 { image: '/iconsFlowerTool/flowers/0.webp',
    _id: '5', name: 'foliage1', price: 10, type: 'foliage' },
]);


  // Manejar el evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => setWinW(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    const getItemsBd = async () => {
      try {
        let data = await getItems('items');
        //setItems(data);
      } catch (error) {
        console.log(error);
      }
    }
    getItemsBd();
  }, []);

  // Separar items en categorías
  const flowerOptions = items?.filter(item => item.type === 'flower');
  const accessoryOptions = items?.filter(item => item.type === 'accessory');
  const foliageOptions = items?.filter(item => item.type === 'foliage');

  // Estado
  const [flowers, setFlowers] = useState(Array(10).fill(null));
  const [accessories, setAccessories] = useState(Array(4).fill(null));
  const [foliage, setFoliage] = useState(Array(4).fill(null)); // Contenedor inicial para 4 follajes
  const [bouquetSize, setBouquetSize] = useState(10);

  // Calcular posiciones de flores en función del tamaño del ramo

  const [winW, setWinW] = useState(window.innerWidth);

  const flowerPositions = useMemo(() => {
    const positions = [];
    const center = { x: 0, y: 0 };
    positions.push(center);

    const createCircle = (count, radius) => {
      const angleIncrement = (2 * Math.PI) / count;
      for (let i = 0; i < count; i++) {
        const angle = i * angleIncrement;
        positions.push({
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
        });
      }
    };

    let value0 = 18;
    let value1 = 11;
    let value2 = 8;

    if(winW < 450){
       value0 = 6.5;
       value1 = 4;
       value2 = 2.8;
    }    

    if (bouquetSize === 10) createCircle(9, winW / value0);
    else if (bouquetSize === 23) {
      createCircle(9, winW / value0);
      createCircle(13, winW / value1);
    } else if (bouquetSize === 33) {
      createCircle(9, winW / value0);
      createCircle(13, winW / value1);
      createCircle(20, winW / value2);
    }

    return positions;
  }, [bouquetSize, winW]);

  // #region Drag and Drop
  const handleDrop = (e, type, index) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del navegador
  
    const itemId = e.dataTransfer.getData("text/plain");
    const droppedItem = items.find(item => item._id === itemId);
  
    if (!droppedItem) {
      console.error("El elemento arrastrado no es válido.");
      return;
    }
  
    // Validar que el tipo del elemento coincida con el tipo esperado del contenedor
    if (droppedItem.type !== type) {
      alert(`No se puede colocar un ${droppedItem.type} en un contenedor ${type}.`);
      return;
    }
  
    if (type === "flower" && flowers[index] === null) {
      const updatedFlowers = [...flowers];
      updatedFlowers[index] = droppedItem;
      setFlowers(updatedFlowers);
    } else if (type === "accessory" && accessories[index] === null) {
      const updatedAccessories = [...accessories];
      updatedAccessories[index] = droppedItem;
      setAccessories(updatedAccessories);
    } else if (type === "foliage" && foliage[index] === null) {
      const updatedFoliage = [...foliage];
      updatedFoliage[index] = droppedItem;
      setFoliage(updatedFoliage);
    }
  };
  
const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item._id);
  };

  const calculateTotalCost = () => {
    const flowerCost = flowers.filter(Boolean).reduce((sum, flower) => {
      const item = items.find(el => el._id === flower._id);
      return sum + (item?.price || 0);
    }, 0);
    const accessoryCost = accessories.filter(Boolean).reduce((sum, accessory) => {
      const item = items.find(el => el._id === accessory._id);
      return sum + (item?.price || 0);
    }, 0);
    const foliageCost = foliage.filter(Boolean).reduce((sum, foliage) => {
      const item = items.find(el => el._id === foliage._id);
      return sum + (item?.price || 0);
    }, 0);
    return flowerCost + accessoryCost + foliageCost;
  };

  const removeItem = (type, index) => {
    if (type === "flower") {
      const updatedFlowers = [...flowers];
      updatedFlowers[index] = null;
      setFlowers(updatedFlowers);
    } else if (type === "accessory") {
      const updatedAccessories = [...accessories];
      updatedAccessories[index] = null;
      setAccessories(updatedAccessories);
    } else if (type === "foliage") {
      const updatedFoliage = [...foliage];
      updatedFoliage[index] = null;
      setFoliage(updatedFoliage);
    }
  };
  
  //Touch display

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSelect = (item) => {
    if(item === selectedItem){
      setSelectedItem(null);
    }else{
      setSelectedItem(item);
    }
  };

  const handleContainerTap = (type, index) => {
    if (!selectedItem) return; // Si no hay ítem seleccionado, no hacer nada
    if (selectedItem.type !== type) {
      alert(`No se puede colocar un ${selectedItem.type} en un contenedor de ${type}.`);
      return;
    }
  
    if (type === "flower") {
      const updatedFlowers = [...flowers];
      updatedFlowers[index] = selectedItem;
      setFlowers(updatedFlowers);
    } else if (type === "accessory") {
      const updatedAccessories = [...accessories];
      updatedAccessories[index] = selectedItem;
      setAccessories(updatedAccessories);
    } else if (type === "foliage") {
      const updatedFoliage = [...foliage];
      updatedFoliage[index] = selectedItem;
      setFoliage(updatedFoliage);
    }
  
    //setSelectedItem(null); // 🔥 Se deselecciona después de colocarlo
  };
  
  
  let [bouquet, setBouquet] = useState([]);
  function genBouquet(){
      let data = [...flowers, ...accessories, ...foliage].filter(item => item !== null);
      let items = [...accessories, ...foliage].filter(item => item !== null);
      // Guardar
      localStorage.setItem('bouquet', JSON.stringify(flowers));
      localStorage.setItem('bouquetItems', JSON.stringify(items));
      setBouquet(data);
      console.log(data);
      return data;
  }

  // #region Formulario de orden

  const [minTime, setMinTime] = useState('08:00');
  const [orderFromVisible, setOrderFormVisible] = useState(false);
  const [localities, setLocalities] = useState([]); // Estado para las localidades
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  async function handleClickPay(event) {
    event.preventDefault();
    let bouquet = await genBouquet();
    let orderData = {
      userId: isLogged.id,
      receiver: sanitizeString(event.target.receiverName.value, 2),
      date: event.target.date.value,
      time: event.target.time.value,
      bouquet: bouquet,
      address: {
        address: sanitizeString(event.target.address.value, 2),
        cp: sanitizeString(event.target.cp.value, 2),
        municipality: event.target.municipality.value,
        locality: event.target.locality.value
      },
      letter: sanitizeString(event.target.letter.value, 1)
    }
    console.log('Enviando...', orderData);
    try {
      const stripe = await stripePromise;

      const response = await fetch('http://localhost:5000/api/items/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      navigate('/handlePay?state=false');
      console.error('Error al iniciar el pago:', error);
    }
  }


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
  

  return (
    <>
      <NavBar isLogged={isLogged} />
      <div className="h1-menu">
        <h1>Arma tu Ramo</h1>
      </div>

      <main className="main-mkF">
        {/* Accesorios */}
        <div className="accs-section">
          {accessoryOptions?.map(accessory => (
            <div
              key={accessory.id}
              className={`element-box ${selectedItem === accessory ? "selected" : ""}`}
              draggable
              onDragStart={e => handleDragStart(e, accessory)}
              onClick={() => handleItemSelect(accessory)} // 🔥 Ahora se selecciona con click
            >
              <img
                src={accessory.image}
                alt={accessory.name}
                title={`${accessory.name} $${accessory.price}`}
                style={{ width: "50px", height: "50px" }}
              />
            </div>
          ))}
        </div>
        {/* Follages */}
        <div className="foliage-section">
          {foliageOptions?.map(foliage => (
            <div
              key={foliage.id}
              className={`element-box ${selectedItem === foliage ? "selected" : ""}`}
              draggable
              onDragStart={e => handleDragStart(e, foliage)}
              onClick={() => handleItemSelect(foliage)} // 🔥 Ahora se selecciona con click
            >
              <img
                src={foliage.image}
                alt={foliage.name}
                title={`${foliage.name} $${foliage.price}`}
                style={{ width: "50px", height: "50px" }}
              />
            </div>
          ))}
        </div>

        {/* Flores */}
        <section className="bottom-section">
          <div className="bottom-section-div0">
            <select onChange={(e) => setBouquetSize(Number(e.target.value))} value={bouquetSize}>
                <option value={10}>Ramo de 10</option>
                <option value={23}>Ramo de 23</option>
                <option value={33}>Ramo de 33</option>
              </select>
              <p>Costo Total: ${calculateTotalCost()}</p>
              <button onClick={() => setOrderFormVisible(true)}>Continuar</button>
          </div>
          <div className="bottom-section-div1">
            {flowerOptions?.map(flower => (
              <div
                key={flower._id}
                className={`element-box ${selectedItem === flower ? "selected" : ""}`}
                draggable
                onDragStart={e => handleDragStart(e, flower)}
                onClick={() => handleItemSelect(flower)} // 🔥 Ahora se selecciona con click
                >
                <img
                  src={flower.image}
                  alt={flower.name}
                  title={`${flower.name} $${flower.price}`}
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Editor */}
        <section className="editor-section">
          {/* Contenedor de Accesorios */}
          <div className="accs-container accs-section-position">
            <h3>Accesorios</h3>
            <hr />
            <div>
              {accessories?.map((item, index) => (
                <div
                  key={index}
                  className="element-box element-box-mobile droppable"
                  data-index={index} // 🔥 Ahora tiene un índice
                  style={{ border: ".5px dashed white" }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, "accessory", index)}
                  onDoubleClick={() => removeItem("accessory", index)}
                  onClick={() => handleContainerTap("accessory", index)} 
                >
                  {accessories[index]?.image && (
                    <img
                      src={accessories[index]?.image}
                      alt={accessories[index]?.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Flores */}
          <div className="flowers-container">
            {flowerPositions?.map((position, index) => (
              <div
                key={index}
                className="flower-position droppable"
                data-index={index} // 🔥 Ahora tiene un índice
                style={{
                  top: `calc(45% - ${position.y}px)`,
                  left: `calc(40% + ${position.x}px)`,
                }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, "flower", index)}
                onDoubleClick={() => removeItem("flower", index)}
                onClick={() => handleContainerTap("flower", index)}
              >
                {flowers[index]?.image && (
                    <img
                      src={flowers[index]?.image}
                      alt={flowers[index]?.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
              </div>
            ))}
          </div>

          {/* Contenedor de Follajes */}
          <div className="accs-container foliage-section-position">
            <h3>Follajes</h3>
            <hr />
            <div>
              {foliage?.map((item, index) => (
                <div
                  key={index}
                  className="element-box element-box-mobile droppable"
                  data-index={index} // 🔥 Ahora tiene un índice
                  style={{ border: ".5px dashed white" }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, "foliage", index)}
                  onDoubleClick={() => removeItem("foliage", index)}
                  onClick={() => handleContainerTap("foliage", index)}
                >
                  {foliage[index]?.image && (
                    <img
                      src={foliage[index]?.image}
                      alt={foliage[index]?.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <section className='order-details-section' style={{ display: orderFromVisible ? 'flex' : 'none' }}>
        <h4 style={{ color: 'white' }}>Detalles de entrega</h4>
        <form onSubmit={handleClickPay}>
          <input type="number" name='cp' placeholder='CP' />
          <div>
            <select name="municipality" onChange={handleMunicipalityChange}>
              <option value="" defaultValue={''}>Selecciona una localidad</option>
              <option value="guadalajara">Guadalajara</option>
              <option value="zapopan">Zapopan</option>
            </select>
            <select name="locality">
              <option value="" defaultValue={''}>Selecciona una localidad</option>
              {localities?.map((locality, index) => (
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
      </main>
    </>
  );
}

export default MakeFlowers;
