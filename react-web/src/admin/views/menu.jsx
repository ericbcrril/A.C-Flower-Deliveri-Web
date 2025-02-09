import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../shared/styles/views/menu.css';
import '../styles/html-grandiant.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";
import { ToastContainer, toast } from 'react-toastify';
import { sendEmail } from '../../scripts/sendEmailNotification';
import React from 'react';

function Menu({ isLogged }) {

  // Array de nombres
  const names = [
    'Luis', 'Ana', 'Carlos', 'Sofia', 'Pedro', 
    'Juan', 'José', 'Marta', 'David', 'Carmen', 
    'Raúl', 'Teresa', 'Javier', 'Sandra', 'Julia', 
    'Rafael', 'Manuel', 'Elena', 'Cristina', 'Víctor', 
    'Sergio', 'Lucía', 'Pablo', 'Ángela', 'Ricardo', 
    'Nuria', 'Eduardo', 'Santiago', 'Daniel', 'Fátima', 
    'Álvaro', 'César', 'Paula', 'Tomás', 'Raquel', 
    'Felipe', 'Andrea', 'Óscar', 'Violeta', 'Julio', 
    'Gabriel', 'Mercedes', 'Esther', 'Nicolás', 'Ximena', 
    'Esteban', 'Pilar', 'Salvador', 'Begoña', 'Oscar', 
    'Iván', 'Leo', 'Noé', 'Lía', 'Elis', 
    'Vera', 'Álex', 'Irene', 'Luis', 'Mona', 
    'Tina', 'Fabi', 'Emma', 'Lola', 'Dani', 
    'Rosa', 'Beto', 'Sara', 'Gabi', 'Nora', 
    'Lina', 'Rita', 'Gustavo', 'Julián', 'Estela', 
    'Milo', 'Zara', 'Nico', 'Enzo', 'Ciro', 
    'Axel', 'Toni', 'Alicia', 'Maru', 'Álba', 
    'Tere', 'Mari', 'Alan', 'Joan', 'Nina', 
    'Cata', 'Áurea', 'Adri', 'Juanjo', 'Tomi', 
    'Lily', 'Mimi', 'Eva', 'Noémi', 'Ceci', 
    'Cris', 'Vale', 'Dora', 'Fabiola', 'Andy'
  ];
  

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'n' || event.key === 'N') {
        // Elegir un nombre aleatorio del array
        const randomName = names[Math.floor(Math.random() * names.length)];

        // Mostrar la notificación
        toast(`💌 ${randomName} ha realizado un nuevo pedido`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        sendEmail({
          userId: '226dha92g28',
          receiver: randomName,
          date: '',
          time: '',
          address: 'Mas info en Web...',
        });
      }
    };

    // Añadir el event listener
    window.addEventListener('keydown', handleKeyPress);

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

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
    
        let widthForOpt = 200;
    
        if(winW > 450 && winW < 1024 && winH > 720){//Tablets Port
            widthForOpt = 200;
        }    
        if(winW < 450){//Movil Port
            widthForOpt = 150;
        }    
        if(winH < 450 && winW > 650 && winW < 950){//Movil Land
            widthForOpt = 200;
        }    

  return (
    <>
      <NavBar isLogged={isLogged} />
      <div className='h1-menu'>
        <h1>A.C Flowers Delivery</h1>
      </div>

      <main className='menu-main'>
        <section className='opts-container-menu'>
          <Link to="/Ramos" className='menu-opt'>
            <OptionRect w={widthForOpt} img="images/menu-sections/bouquets.gif" title="Ramos" className={"trl10"} />
          </Link>
          <Link to="/ArmarRamo" className='menu-opt'>
            <OptionRect w={widthForOpt} img="images/menu-sections/make-bouquet.gif" title="Armar Ramo" className={"trl-10"} />
          </Link>
          <Link to={isLogged.login ? "/ConsultarPedido" : "/Login"} className='menu-opt'>
            <OptionRect w={widthForOpt} img="images/menu-sections/view-order.gif" title="Consultar pedido" className={"trl10"} />
          </Link>
        </section>
        <section>
          <Link to="/AdminUsuarios">
            <button className='btn-subs'>Administrar Usuarios</button>
          </Link>
        </section>
      </main>
      <ToastContainer />
    </>
  );
}

export default Menu;
