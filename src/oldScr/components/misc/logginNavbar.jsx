import { useNavigate } from 'react-router-dom';
import '../../styles/components/navMenus.css';
import { LuUser } from "react-icons/lu";


function LogginNavbar({visible}){
    const navigate = useNavigate();

    return(
        <form className='shopping-cart' style={{display: visible?"flex":"none"}}>
            <LuUser color='White' size={62} style={{alignSelf: "center"}}/>
            <input type="text" name="" id="user" placeholder='Usuario'/>
            <input type="password" name="" id="password" placeholder='Contraseña'/>
            <button type='submit'>Iniciar Sesion</button>
            <button type='button' onClick={() => navigate('/Login')}>Registrarse</button>
        </form>
    );
}

export default LogginNavbar;