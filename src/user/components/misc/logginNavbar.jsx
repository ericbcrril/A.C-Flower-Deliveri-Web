import { useNavigate } from 'react-router-dom';
import '../../styles/components/navMenus.css';
import { LuUser } from "react-icons/lu";
import { useState } from 'react';
//Scripts
import { userLogin } from '../../../scripts/apis';



function LogginNavbar({visible}){
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        let form = document.getElementById('loginForm');
        let action = await userLogin(event);
        setError(action.error);
        console.log(action);
        if(!action.error){
            form.reset();
            window.location.reload();
        }
      };

    return(
        <form className='shopping-cart' onSubmit={handleLoginSubmit} id='loginForm'
            style={{display: visible?"flex":"none"}}>
            <LuUser color='White' size={62} style={{alignSelf: "center"}}/>
            <input type="text" name="user" placeholder="Usuario" 
                    maxLength={12} pattern=".*\S.*" required/>
            <input type="password" name="password" placeholder="Contraseña" 
                    minLength={8} pattern=".*\S.*" required/>
                    <p style={{color: "red", fontSize: "x-small", margin: 0, alignSelf: 'center'}}>{error}</p>
            <button type='submit'>Iniciar Sesion</button>
            <button type='button' onClick={() => navigate('/Login')}>Registrarse</button>
        </form>
    );
}

export default LogginNavbar;