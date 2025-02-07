import { useNavigate } from 'react-router-dom';
import '../../styles/components/navMenus.css';
import { LuUser } from "react-icons/lu";
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
//Scripts
import { userLogin, userLoginByGoogle } from '../../../scripts/apis';



function LogginNavbar({visible}){
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        let form = document.getElementById('loginForm');
        let action = await userLogin(event);
        setError(action.error);
        //console.log(action);
        if(!action.error){
            form.reset();
            window.location.reload();
        }
      };

      const handleLoginByGoogle = async (clientId, credential) => {
        await userLoginByGoogle(clientId, credential);
        window.location.reload();
        };

    return(
        <GoogleOAuthProvider clientId="157504509393-9p8p1kbd05eiica6p2f89c4agg4pidb6.apps.googleusercontent.com">
            <form className='shopping-cart' onSubmit={handleLoginSubmit} id='loginForm'
            style={{display: visible?"flex":"none"}}>
            <LuUser color='White' size={62} style={{alignSelf: "center"}}/>
            <input type="text" name="user" placeholder="Email o Usuario" 
                   autoComplete='username' pattern='^\S+$' title="No debe tener espacios vacíos" required/>
            <input type="password" name="password" placeholder="Contraseña" 
                    minLength={8} pattern="^\S+$" autoComplete='current-password' title="Debe tener mínimo 8 caracteres, sin espacios vacíos" required/>
                    <p style={{color: "red", fontSize: "small", margin: 0, border: 'none'}}>{error}</p>
            <button type='submit'>Iniciar Sesion</button>
            <button type='button' onClick={() => navigate('/Login')}>Registrarse</button>
            <hr style={{width: '100%'}}/>
            <GoogleLogin
              onSuccess={credentialResponse => {handleLoginByGoogle(credentialResponse.clientId, credentialResponse.credential)}}
              onError={() => {
                console.log('Login Failed');
              }}
            />;
        </form>
        </GoogleOAuthProvider>
    );
}

export default LogginNavbar;