import React, { useState, useMemo, useEffect, useRef } from "react";
import NavBar from "../components/misc/navbar";
import LoadLetters from "../../shared/components/misc/loadLetters";
import "../styles/views/makeFlowers.css";
import { getItems } from "../../scripts/apis";
import sanitizeString from '../../scripts/sanitizeStrings';
import zapopanJSON from '../../data/Zapopan.json';
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { BASE_URL, STRIPE_PUBLIC_KEY } from '../../scripts/response';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY); // Reemplaza con tu clave pública de Stripe
//const imgFlower = require('/iconsFlowerTool/flowers/0.webp');

function MakeFlowers({ isLogged }) {

// Modelo de datos
const [items, setItems] = useState([]);


  // Manejar el evento de redimensionamiento de la ventana
  const [winW, setWinW] = useState(window.innerWidth);
  const [winH, setWinH] = useState(window.innerHeight);
  useEffect(() => {
    const handleResizeW = () => setWinW(window.innerWidth);
    const handleResizeH = () => setWinH(window.innerHeight);
    window.addEventListener('resize', handleResizeW);
    window.addEventListener('resize', handleResizeH);
    return () => {
      window.removeEventListener('resize', handleResizeW);
      window.removeEventListener('resize', handleResizeH);
    };
  }, [winW, winH]);
  useEffect(() => {
    const getItemsBd = async () => {
      try {
        openDialogTutorial();
        let data = await getItems('items');
        setItems(data);
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

    if(winW > 449 && winW < 1025 && winH > 719){//Tablets Port
       value0 = 9.5; 
       value1 = 5.8;
       value2 = 4;
    }    
    if(winW < 451){//Movil Port
       value0 = 6.5;
       value1 = 4;
       value2 = 2.8;
    }    
    if(winH < 451 && winW > 649 && winW < 95){//Movil Land
       
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
  }, [bouquetSize, winW, winH]);

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
      openDialogEditor();
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
      openDialogEditor('❌ No puedes colocar ese elemento aqui ❌');
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
  
  
  function genBouquet(){
      let bouquet = [...flowers].filter(item => item !== null);
      let items = [...accessories, ...foliage].filter(item => item !== null);
      let data = [...flowers, ...accessories, ...foliage].filter(item => item !== null);
      return { bouquet: bouquet, items: items, data: data};
  }

  // #region Formulario de orden

  const [minTime, setMinTime] = useState('11:00');
  const dialogOrderForm = useRef(null);
  const dialogEditor = useRef(null);
  const dialogTutorial = useRef(null);
  const [numImg, setNumImg] = useState(0);
  const [dialogMessage, setDialogMessage] = useState('');
  const [localities, setLocalities] = useState(zapopanJSON); // Estado para las localidades
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  async function handleClickPay(event) {
    event.preventDefault();
    let data = await genBouquet();
    let totalBouquet = data.data;
    let bouquet = data.bouquet;
    let items = data.items;
    let orderData = {
      userId: isLogged.id,
      receiver: sanitizeString(event.target.receiverName.value, 2),
      date: event.target.date.value,
      time: event.target.time.value,
      bouquet: bouquet,
      items: items,
      address: {
        address: sanitizeString(event.target.address.value, 2),
        cp: sanitizeString(event.target.cp.value, 2),
        municipality: event.target.municipality.value,
        locality: event.target.locality.value
      },
      letter: sanitizeString(event.target.letter.value, 1)
    }
    //console.log('Enviando...', orderData);
    try {
      localStorage.setItem('orderData', JSON.stringify(orderData));
      const response = await fetch(`${BASE_URL}/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: totalBouquet }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      navigate('/handlePay');
      console.error('Error al iniciar el pago:', error);
    }
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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Obtener la fecha de mañana
  
    // Convertir fechas a formato YYYY-MM-DD en zona horaria local
    const todayStr = today.toLocaleDateString('fr-CA'); // Formato YYYY-MM-DD
    const tomorrowStr = tomorrow.toLocaleDateString('fr-CA');
    const selectedDay = new Date(selectedDate).getDay(); // 0 = Domingo, 6 = Sábado
    const isTomorrow = selectedDate === tomorrowStr; // Verificar si la fecha es mañana
  
    let minHour = 11;
    let maxHour = 23;
  
    if (selectedDay === 6) { // Si es sábado
      minHour = 10; // Horario de sábado: 10 AM - 6 PM
      maxHour = 18;
    }
  
    if (selectedDate === todayStr) {
      // Si la fecha es hoy
      const now = new Date();
      now.setHours(now.getHours() + 2); // Sumar 2 horas
  
      let hours = now.getHours();
      let minutes = now.getMinutes();
  
      if (hours < minHour) {
        hours = minHour;
        minutes = 0;
      } else if (hours >= maxHour) {
        hours = maxHour;
        minutes = 0;
      }
  
      setMinTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    } else if (isTomorrow) {
      // Si la fecha es mañana, establecer la hora mínima según el día
      setMinTime(`${String(minHour).padStart(2, '0')}:00`);
    } else {
      // Si es otro día, usar la hora mínima predeterminada para ese día
      setMinTime(`${String(minHour).padStart(2, '0')}:00`);
    }
  };

  function selectImg() {
        switch (numImg) {
          case 0:
            return(
              <div>
                <h3>Seleccionar elementos</h3>
                <img src="images/tutorial-makeBouquet/0.webp" alt="tut"/>
                <li>Haz click en el elemento que deseas agregar.</li>
              </div>
            );
          case 1:
            return(
              <div>
                <h3>Colocar elementos</h3>
                <img src="images/tutorial-makeBouquet/1.webp" alt="tut"/>
                <li>Luego, haz click en la casilla donde quieres colocarlo.</li>
              </div>
            );
          case 2:
            return(
              <div>
                <h3>Eliminar elementos</h3>
                <img src="images/tutorial-makeBouquet/2.webp" alt="tut"/>
                <li>Haz doble click sobre el elemento para eliminarlo.</li>
                <li>Al finalizar el ramo, click en continuar.</li>
              </div>
            );
          default:
            return(
              <div>
                <img src="images/tutorial-makeBouquet/0.webp" alt="tut"/>
                <li>Haz click en el elemento que deseas agregar.</li>
              </div>
            );
            break;
        }
  }

  async function openDialog() {
    let res = await genBouquet();
    let bouquet = res.bouquet;
    if(bouquet.length === bouquetSize){
      dialogOrderForm.current.showModal();
    }else{
      openDialogEditor('Completa el ramo antes de continuar');
    }
}

function closeDialog() {
    dialogOrderForm.current.close();
}

function openDialogEditor(message) {
    setDialogMessage(message);
    dialogEditor.current.showModal();
}

function closeDialogEditor() {
    dialogEditor.current.close();
}

function openDialogTutorial() {
    dialogTutorial.current.showModal();
}

function closeDialogTutorial() {
  dialogTutorial.current.close();
}
  

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
            <div className="flower-and-name-container">
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
                title={`${accessory.name} $${accessory.price} MXN`}
                style={{ width: "50px", height: "50px" }}
              />
            </div>
            <p>{accessory.name}</p>
            </div>
          ))}
        </div>
        {/* Follages */}
        <div className="foliage-section">
          {foliageOptions?.map(foliage => (
            <div className="flower-and-name-container">
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
                title={`${foliage.name} $${foliage.price} MXN`}
                style={{ width: "50px", height: "50px" }}
              />
            </div>
            <p>{foliage.name}</p>
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
              <button onClick={() => isLogged.login ? openDialog() : navigate('/Login')}>Continuar</button>
          </div>
          <div className="bottom-section-div1">
            {items.length > 0 ?
            flowerOptions?.map(flower => (
              <div className="flower-and-name-container">
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
                  title={`${flower.name} $${flower.price} MXN`}
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
              <p>{flower.name}</p>
              </div>
            ))
            :
            <div style={{width: '100%', display: "flex", alignItems: "center", justifyContent: "center"}}>
              <LoadLetters size={20}/>
            </div>
            }
          </div>
        </section>

        {/* Editor */}
        <section className="editor-section">
          {/* Contenedor de Accesorios */}
          <div className="accs-container">
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
          <div className="foliage-container">
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
      </main>


      <dialog ref={dialogEditor}>
        <section>
          <p>{dialogMessage}</p>
          <button onClick={closeDialogEditor}>Ok</button>
        </section>
      </dialog>
      
      <dialog ref={dialogTutorial}>
        <section className="makeBouquet-tutorial">
          {selectImg()}
          <div style={{flexDirection: "row"}}>
          <button onClick={closeDialogTutorial}>Ok</button>
          {numImg < 2 &&
            <button onClick={() => setNumImg(numImg + 1)}>{'Siguiente >'}</button>
          }
          </div>
        </section>
      </dialog>


    </>
  );
}

export default MakeFlowers;
