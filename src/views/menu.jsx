import { Link } from 'react-router-dom';
import '../styles/views/menu.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";

function Menu(){
    return(
        <>

        <NavBar/>
        <div className='h1-menu'><h1>A.C Flowers Delivery</h1></div>

        <main>
            <section>
                <Link to="/Predeterminados" className='menu-opt'>
                    <OptionRect w={200} img="width_150.jpeg" title="Predeterminados" className={"trl10"}/>                
                </Link>
                <Link to="/ArmarRamo" className='menu-opt'>
                    <OptionRect w={200} img="logo512.png" title="Armar Ramo" className={"trl-10"}/>
                </Link>
                <Link to="/ConsultarPedido" className='menu-opt'>
                    <OptionRect w={200} img="logo512.png" title="Consultar pedido" className={"trl10"}/>
                </Link>
            </section>
        </main>
        </>
    );
}

export default Menu;