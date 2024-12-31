import '../../styles/components/navMenu.css';
import {Link} from 'react-router-dom';

function NavMenu({visible}){
    return(
        <section className='navMenu' style={{display: visible?"flex":"none"}}>
            <Link to="/">Inicio</Link>
            <Link to="/Menu">Menu</Link>
            <Link to="/Predeterminados">Predeterminados</Link>
            <Link to="/ArmarRamo">Armar Ramo</Link>
            <Link to="/ConsultarPedido">Consultar Pedido</Link>
        </section>
    );
}

export default NavMenu;