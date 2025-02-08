import { useState } from 'react';
import '../styles/views/login.css';
import { LuUser } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { userRegistered, userLogin, userLoginByGoogle } from '../../scripts/apis';
import { ToastContainer, toast } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login({ isLogged }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(true);

  if (isLogged.login) {
    navigate('/Menu');
  }

  const triggerNotification = () => {
    toast.success('Usuario registrado, ¡Bienvenido!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  };

  function handleChangeView(){
        setIsRegistered(!isRegistered);
        setError('');
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    let form = document.getElementById('loginForm');
    let action = await userLogin(event);
    setError(action.error);
    if(!action.error){
        form.reset();
        navigate('/');
        window.location.reload();
    }
  };
  
  const handleLoginByGoogle = async (clientId, credential) => {
    await userLoginByGoogle(clientId, credential);
        navigate('/');
        window.location.reload();
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    let form = document.getElementById("registerForm");
    let action = await userRegistered("accounts", event);
    setError(action)
    if(!action){
      triggerNotification();
      form.reset();
      setIsRegistered(true);
    }
};

  if (isRegistered) {
    return (
      <GoogleOAuthProvider clientId="157504509393-9p8p1kbd05eiica6p2f89c4agg4pidb6.apps.googleusercontent.com">
      <main className="login-main">
        <form className="login-form" onSubmit={handleLoginSubmit} id='loginForm'>
          <LuUser color="white" size={102} />
          <div style={{ display: "flex", flexDirection: "column" }}>
          <input type="text" name="user" placeholder="Usuario" 
                    pattern=".*\S.*" autoComplete='username' required 
                    title="Debe contener un nombre o correo valido"/>
            <input type="password" name="password" placeholder="Contraseña" 
                    minLength={8} pattern=".*\S.*" autoComplete='current-password' required 
                    title="Debe tener mínimo 8 caracteres"/>
                    <p style={{color: "red", fontSize: "x-small", margin: 0, alignSelf: 'center'}}>{error}</p>
            <hr />
            <button type="submit">Iniciar Sesión</button>
            <button type="button" onClick={() => handleChangeView()}>Registrate</button>
            <hr />
            <GoogleLogin
              onSuccess={credentialResponse => {handleLoginByGoogle(credentialResponse.clientId, credentialResponse.credential)}}
              onError={() => {
                console.log('Login Failed');
              }}
            />;
          </div>
        </form>
        <ToastContainer />
      </main>
      </GoogleOAuthProvider>
    );
  } else {
    return (
      <main className="login-main">
        <form className="login-form" onSubmit={handleRegisterSubmit} id='registerForm'>
          <LuUser color="white" size={102} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input type="text" name="name" placeholder="Nombre" 
                    minLength={1} maxLength={20} pattern=".*\S.*" autoComplete='name' required 
                    title="Máximo 20 caracteres"/>
            <input type="text" name="lastName" placeholder="Apellido" 
                    minLength={1} maxLength={30} pattern=".*\S.*" autoComplete='name' required 
                    title="Máximo 30 caracteres"/>
            <input type="text" name="user" placeholder="Usuario" 
                    minLength={3} maxLength={12} pattern="^\S+$" autoComplete='username' required 
                    title="Máximo 12 caracteres, sin espacios vacíos"/>
            <input type="password" name="password" placeholder="Contraseña" 
                    minLength={8} pattern="^\S+$*" autoComplete='current-password' required 
                    title="Debe tener mínimo 8 caracteres, sin espacios vacíos"/>
            <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" 
                    minLength={8} pattern="^\S+$*" autoComplete='current-password' required 
                    title="Debe coincidir con la contraseña ingresada"/>
                    <p style={{color: "red", fontSize: "x-small", margin: 0, alignSelf: 'center'}}>{error}</p>
            <hr />
            <input type="email" name="email" placeholder="Email" autoComplete='email' 
                    title="Ingrese un correo electrónico válido" required/>
            <div>
              <select name="codigo" defaultValue="+52" title="Selecciona tu código de país" required>
                <option value="+52">🇲🇽 +52</option>
                <option value="+01">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+55">🇧🇷 +55</option>
                <option value="+54">🇦🇷 +54</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+61">🇦🇺 +61</option>
              </select>
              <input
                type="number"
                name="cellPhone"
                placeholder="Número Celular"
                pattern="[0-9]{10}"
                title="Debe ser un número de 10 dígitos"
                maxLength="10"
                minLength={10}
                required
                autoComplete="mobile tel"
                style={{ width: "60%" }}
              />
            </div>
            <button type="submit">Finalizar</button>
            <button type="button" onClick={() => handleChangeView()}>Cancelar</button>
          </div>
        </form>        
        <ToastContainer />
      </main>
    );
  }
}

export default Login;
