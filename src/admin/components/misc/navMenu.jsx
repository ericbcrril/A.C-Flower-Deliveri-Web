import '../../styles/components/navMenus.css';
import {Link} from 'react-router-dom';

function NavMenu({visible, isLogged}){
    return(
        <section className='navMenu' style={{display: visible?"flex":"none"}}>
            <Link to="/">Inicio</Link>
            <Link to="/Menu">Menu</Link>
            <Link to="/Ramos">Ramos</Link>
            <Link to="/ArmarRamo">Armar Ramo</Link>
            <Link to={isLogged.login ? "/ConsultarPedido":"/Login"}>Consultar Pedido</Link>
            <Link to="/AdminUsuarios">Administrar Usuarios</Link>
        </section>
    );
}

export default NavMenu;