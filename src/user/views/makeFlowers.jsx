import React, { useState, useMemo, useEffect } from "react";
import NavBar from "../components/misc/navbar";
import "../styles/views/makeFlowers.css";
import BouquetPreview3D from "../components/misc/BouquetPreview3D";

function MakeFlowers({isLogged}) {

 const [winW, setWinW] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWinW(window.innerWidth);

    // Escuchar el evento de redimensionamiento
    window.addEventListener('resize', handleResize);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar

  // Precios de flores y accesorios
  const flowerPrices = {
    "🌹": 30,
    "🌻": 25,
    "🌸": 35,
    "🌼": 28,
    "🌷": 32,
    "🌺": 38,
    "🍀": 18,
    "🍁": 20,
  };

  const accessoryPrices = {
    "🍫": 15,
    "💌": 5,
    "🎀": 7,
    "🍬": 10,
  };

  // Estado para flores y accesorios
  const [flowers, setFlowers] = useState(Array(10).fill(null)); // Tamaño inicial del ramo: 10 flores
  const [accessories, setAccessories] = useState(Array(4).fill(null)); // Siempre 4 posiciones para accesorios
  const [bouquetSize, setBouquetSize] = useState(10); // Tamaño inicial del ramo

  const flowerOptions = [
    { id: "0", type: "🌹" },
    { id: "1", type: "🌻" },
    { id: "2", type: "🌸" },
    { id: "3", type: "🌼" },
    { id: "4", type: "🌷" },
    { id: "5", type: "🌺" }
  ];

  const accessoryOptions = [
    { id: "0", type: "🍫" },
    { id: "1", type: "💌" },
    { id: "2", type: "🎀" },
    { id: "3", type: "🍬" }
  ];


  const flowerPositions = useMemo(() => {
    const positions = [];
    const center = { x: 0, y: 0 }; // Flor central
    positions.push(center);
  
    if (bouquetSize === 10) {
      // Un círculo alrededor
      const radius = winW / 18;
      const angleIncrement = (2 * Math.PI) / 9;
      for (let i = 0; i < 9; i++) {
        const angle = i * angleIncrement;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        positions.push({ x, y });
      }
    } else if (bouquetSize === 23) {
      // Dos círculos alrededor
      const innerRadius = winW / 18; // Primer círculo
      const outerRadius = winW / 10; // Segundo círculo
  
      // Primer círculo (9 flores)
      const innerAngleIncrement = (2 * Math.PI) / 9;
      for (let i = 0; i < 9; i++) {
        const angle = i * innerAngleIncrement;
        const x = innerRadius * Math.cos(angle);
        const y = innerRadius * Math.sin(angle);
        positions.push({ x, y });
      }
  
      // Segundo círculo (13 flores)
      const outerAngleIncrement = (2 * Math.PI) / 13;
      for (let i = 0; i < 13; i++) {
        const angle = i * outerAngleIncrement;
        const x = outerRadius * Math.cos(angle);
        const y = outerRadius * Math.sin(angle);
        positions.push({ x, y });
      }
    } else if (bouquetSize === 33) {
      // Tres círculos alrededor
      const innerRadius = winW / 20; // Primer círculo
      const middleRadius = winW / 12; // Segundo círculo
      const outerRadius = winW / 8; // Tercer círculo
  
      // Primer círculo (9 flores)
      const innerAngleIncrement = (2 * Math.PI) / 9;
      for (let i = 0; i < 9; i++) {
        const angle = i * innerAngleIncrement;
        const x = innerRadius * Math.cos(angle);
        const y = innerRadius * Math.sin(angle);
        positions.push({ x, y });
      }
  
      // Segundo círculo (13 flores)
      const middleAngleIncrement = (2 * Math.PI) / 13;
      for (let i = 0; i < 13; i++) {
        const angle = i * middleAngleIncrement;
        const x = middleRadius * Math.cos(angle);
        const y = middleRadius * Math.sin(angle);
        positions.push({ x, y });
      }
  
      // Tercer círculo (20 flores)
      const outerAngleIncrement = (2 * Math.PI) / 20;
      for (let i = 0; i < 20; i++) {
        const angle = i * outerAngleIncrement;
        const x = outerRadius * Math.cos(angle);
        const y = outerRadius * Math.sin(angle);
        positions.push({ x, y });
      }
    }
  
    return positions;
  }, [bouquetSize, winW]); // Añadimos `winW` como dependencia
  
  
  
  

  // Manejar el evento de "drag" y "drop" para flores y accesorios
  const handleDrop = (e, type, index) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain"); // Obtén el ID del elemento
  
    if (type === "flowers" && flowers[index] === null) {
      const updatedFlowers = [...flowers];
      updatedFlowers[index] = { id: itemId }; // Asignar ID de flor
      setFlowers(updatedFlowers);
    } else if (type === "accessories" && accessories[index] === null) {
      const updatedAccessories = [...accessories];
      updatedAccessories[index] = { id: itemId }; // Asignar ID de accesorio
      setAccessories(updatedAccessories);
    }
  };
  

  const printFlowerPositions = () => {
    const flowerDetails = flowers.map((flower, index) =>
      flower
        ? {
            position: index,
            id: flower.id,
            type: flowerOptions[flower.id].type,
          }
        : { position: index, id: null, type: null }
    );
    console.log("Posiciones de las flores:", flowerDetails);
  };
  


  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item);
  };

  const removeItem = (type, index) => {
    if (type === "flowers") {
      const updatedFlowers = [...flowers];
      updatedFlowers[index] = null;
      setFlowers(updatedFlowers);
    } else if (type === "accessories") {
      const updatedAccessories = [...accessories];
      updatedAccessories[index] = null;
      setAccessories(updatedAccessories);
    }
  };

  const changeBouquetSize = (size) => {
    setBouquetSize(size);
    setFlowers(Array(size).fill(null)); // Reinicia el arreglo de flores según el nuevo tamaño
  };

  // Calcular el costo total
  const calculateTotalCost = () => {
    const addedFlowers = flowers.filter((flower) => flower !== null);
    const addedAccessories = accessories.filter((accessory) => accessory !== null);
  
    const flowerCost = addedFlowers.reduce(
      (total, flower) => total + flowerPrices[flowerOptions[flower.id].type],
      0
    );
    const accessoryCost = addedAccessories.reduce(
      (total, accessory) => total + accessoryPrices[accessoryOptions[accessory.id].type],
      0
    );
  
    return flowerCost + accessoryCost;
  };
  

  return (
    <>
      <NavBar isLogged={isLogged}/>
      <div>
        <h1 className="h1-menu">Arma tu Ramo</h1>
      </div>

      <main className="main-mkF">
        {/* Menú de Accesorios */}
        <div className="accs-section">
          <div className="accs-section-div0">
          {accessoryOptions.map((accessory, index) => (
            <div
              key={index}
              className="element-box"
              draggable
              onDragStart={(e) => handleDragStart(e, accessory.id)} // Usamos el ID como referencia
            >
              <img 
                src={`/iconsFlowerTool/accessories/${accessory.id}.webp`} // Ruta de la imagen
                alt={accessory.id}
                style={{ width: "50px", height: "50px" }} // Ajusta según tus necesidades
              />
            </div>
          ))}
        </div>
        </div>
        


        {/* Sección Inferior - Flores */}
        <section className="bottom-section">
          <div className="bottom-section-div0">
            <select onChange={(e) => changeBouquetSize(Number(e.target.value))} value={bouquetSize}>
              <option value={10}>Ramo de 10</option>
              <option value={23}>Ramo de 23</option>
              <option value={33}>Ramo de 33</option>
            </select>
            <p>Costo Total: ${calculateTotalCost()}</p>
            <button onClick={()=>printFlowerPositions()}>Añadir</button>
          </div>
          <hr />
          <div className="bottom-section-div1">
            {flowerOptions.map((flower, index) => (
              <div
                key={index}
                className="element-box"
                draggable
                onDragStart={(e) => handleDragStart(e, flower.id)} // Usamos el ID como referencia
              >
                <img 
                  src={`/iconsFlowerTool/flowers/${flower.id}.webp`} // Ruta de la imagen
                  alt={flower.id}
                  style={{ width: "50px", height: "50px" }} // Ajusta según tus necesidades
                />
              </div>
            ))}
          </div>
        </section>

        {/* Editor de Ramos */}
        <section className="editor-section">
          {/* Contenedor de Accesorios */}
          <div className="accs-container">
            <h3>Accesorios</h3>
            <hr />
            <div>
              {accessories.map((item, index) => (
                <div
                  key={index}
                  className="element-box"
                  style={{ border: ".5px dashed white" }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, "accessories", index)}
                  onClick={() => removeItem("accessories", index)}
                >
                  {item?.id && (
                    <img
                      src={`/iconsFlowerTool/accessories/${item.id}.webp`} // Ruta de la imagen
                      alt={item.id}
                      style={{ width: "50px", height: "50px" }} // Ajusta según tus necesidades
                    />
                  )}
                </div>
              ))}
            </div>
          </div>


          {/* Contenedor de Flores */}
          <div className="flowers-container">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {flowerPositions.map((position, index) => (
              <div
                key={index}
                className="flower-position"
                style={{
                  top: `calc(45% - ${position.y}px)`,
                  left: `calc(40% + ${position.x}px)`,
                  backgroundColor: flowers[index] ? "transparent" : "",
                  border: flowers[index] ? "none" : "",
                }}
                title="Eliminar"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, "flowers", index)}
                onClick={() => removeItem("flowers", index)}
              >
                {flowers[index]?.id && (
                    <img
                      src={`/iconsFlowerTool/flowers/${flowerOptions[flowers[index].id].id}.webp`}
                      alt={flowerOptions[flowers[index].id].type}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
              </div>
            ))}
          </div>
        </div>



          {/* Contenedor de Vista Previa */}
          <div className="preview-container">
            <h3>Preview</h3>
            <hr />
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Vista Previa del Ramo */}
              <BouquetPreview3D 
                  flowers={flowers.map((flower, index) => ({
                    type: flower ? flowerOptions[flower.id].type : null,
                    position: flowerPositions[index] || { x: 0, y: 0 },  // Default position if undefined
                  }))}
                />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default MakeFlowers;
