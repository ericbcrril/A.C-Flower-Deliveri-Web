import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../shared/styles/views/menu.css';
import '../styles/html-grandiant.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";
import { ToastContainer, toast } from 'react-toastify';
import { sendEmail } from '../../scripts/sendEmailNotification';

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

  return (
    <>
      <NavBar isLogged={isLogged} />
      <div className='h1-menu'>
        <h1>A.C Flowers Delivery</h1>
      </div>

      <main className='menu-main'>
        <section>
          <Link to="/Ramos" className='menu-opt'>
            <OptionRect w={200} img="images/menu-sections/bouquets.gif" title="Ramos" className={"trl10"} />
          </Link>
          <Link to="/ArmarRamo" className='menu-opt'>
            <OptionRect w={200} img="images/menu-sections/make-bouquet.gif" title="Armar Ramo" className={"trl-10"} />
          </Link>
          <Link to={isLogged.login ? "/ConsultarPedido" : "/Login"} className='menu-opt'>
            <OptionRect w={200} img="images/menu-sections/view-order.gif" title="Consultar pedido" className={"trl10"} />
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
