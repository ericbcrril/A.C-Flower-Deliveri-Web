import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sanitizeStrings from '../../scripts/sanitizeStrings';
import { getUser, updateItems } from '../../scripts/apis';
import { getUserAndTokenFromCookie, setCookie } from '../../scripts/handleCookies';
import '../styles/views/login.css';

function UserSettings({ isLogged }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    lastName: '',
    email: '',
    cellPhone: '',
    user: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser('accounts', isLogged?.user ? isLogged?.user:user.user);
      setUser(data);
    };
    if(user.name === ''){fetchUser();}
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: sanitizeStrings(value, 2) }));
  };

  if (!isLogged.login) {
    navigate('/Menu');
    return null; // Evitar renderizado adicional
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateItems('accounts', user._id, user);
    window.location.reload();
  };

  return (
    <main className="login-main">
      <form
        className="login-form"
        id="loginForm"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'white', margin: 0 }}>Datos Personales</h3>
          <hr style={{ margin: 0 }} />
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            maxLength={20}
            pattern=".*\S.*"
            required
            value={user.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            maxLength={30}
            pattern=".*\S.*"
            required
            value={user.lastName}
            onChange={handleChange}
          />
          <h3 style={{ color: 'white', margin: 0 }}>Contacto</h3>
          <hr />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
          />
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
              style={{ width: '60%' }}
              value={user.cellPhone}
              onChange={handleChange}
            />
            <h3 style={{ color: 'white', margin: 0 }}>Cuenta</h3>
            <hr />
            <input
              type="text"
              name="user"
              placeholder="Usuario"
              maxLength={12}
              pattern=".*\S.*"
              required
              value={user.user ? user.user:''}
              onChange={handleChange}
            />
            <h5 style={{ color: 'white', margin: 0 }}>Cambiar Contraseña</h5>
            <hr />
            <input
              type="password"
              name="currentPassword"
              placeholder="Contraseña Actual"
              minLength={8}
              pattern=".*\S.*"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="Nueva Contraseña"
              minLength={8}
              pattern=".*\S.*"
            />
          </div>
          <br />
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}

export default UserSettings;
