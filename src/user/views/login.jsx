import { useState } from 'react';
import '../styles/views/login.css';
import { LuUser } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { userRegistered, userLogin } from '../../scripts/apis';

function Login({ isLogged }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(true);

  if (isLogged.login) {
    navigate('/Menu');
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    let form = document.getElementById('loginForm');
    let action = await userLogin(event);
    setError(action.error);
    console.log(action);
    if(!action.error){
        form.reset();
        navigate('/');
        window.location.reload();
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    let form = document.getElementById("registerForm");
    let action = await userRegistered("accounts", event);
    setError(action)
    if(!action){
      form.reset();
      setIsRegistered(true);
    }
};

  if (isRegistered) {
    return (
      <main className="login-main">
        <form className="login-form" onSubmit={handleLoginSubmit} id='loginForm'>
          <LuUser color="white" size={102} />
          <div style={{ display: "flex", flexDirection: "column" }}>
          <input type="text" name="user" placeholder="Usuario" 
                    maxLength={12} pattern=".*\S.*" required/>
            <input type="password" name="password" placeholder="Contraseña" 
                    minLength={8} pattern=".*\S.*" required/>
                    <p style={{color: "red", fontSize: "x-small", margin: 0, alignSelf: 'center'}}>{error}</p>
            <hr />
            <button type="submit">Iniciar Sesión</button>
            <button type="button" onClick={() => setIsRegistered(false)}>Registrate</button>
          </div>
        </form>
      </main>
    );
  } else {
    return (
      <main className="login-main">
        <form className="login-form" onSubmit={handleRegisterSubmit} id='registerForm'>
          <LuUser color="white" size={102} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input type="text" name="name" placeholder="Nombre" 
                    maxLength={20} pattern=".*\S.*" required/>
            <input type="text" name="lastName" placeholder="Apellido" 
                    maxLength={30} pattern=".*\S.*" required/>
            <input type="text" name="user" placeholder="Usuario" 
                    maxLength={12} pattern=".*\S.*" required/>
            <input type="password" name="password" placeholder="Contraseña" 
                    minLength={8} pattern=".*\S.*" required/>
            <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" 
                    minLength={8} pattern=".*\S.*" required/>
                    <p style={{color: "red", fontSize: "x-small", margin: 0, alignSelf: 'center'}}>{error}</p>
            <hr />
            <input type="email" name="email" placeholder="Email" />
            <div>
              <select name="codigo" defaultValue="+52">
                <option value="+52">🇲🇽 +52</option>
                <option value="+1">🇺🇸 +1</option>
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
                type="tel"
                name="cellPhone"
                placeholder="Número Celular"
                pattern=".*\S*[0-9]{10}"
                style={{ width: "60%" }}
              />
            </div>
            <button type="submit">Crear Usuario</button>
            <button type="button" onClick={() => setIsRegistered(true)}>Iniciar Sesión</button>
          </div>
        </form>
      </main>
    );
  }
}

export default Login;