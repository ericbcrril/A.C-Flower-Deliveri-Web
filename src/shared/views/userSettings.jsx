import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sanitizeStrings from '../../scripts/sanitizeStrings';
import { updateItems, getItemsById } from '../../scripts/apis';
import { errorNotification, successNotification } from '../../scripts/notifications';
import '../styles/views/login.css';
import { ToastContainer } from 'react-toastify';

function UserSettings({ isLogged }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    lastName: '',
    email: '',
    code: '',
    cellPhone: '',
    user: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getItemsById('accounts', isLogged?.id);
      setUser(data);
      let code = data?.cellPhone?.slice(0, 3);
      setUser((prev) => ({ ...prev, cellPhone: data?.cellPhone?.slice(3) }));
      setUser((prev) => ({ ...prev, code: code }));
    };
    if (user.name === '') { fetchUser(); }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: sanitizeStrings(value, 2) }));
  };

  if (!isLogged.login) {
    navigate('/Menu');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const phone = e.target.codigo.value + e.target.cellPhone.value;
  
    // Validaciones manuales
    if (!/^\S.{0,19}$/.test(e.target.name.value)) {
      errorNotification('El nombre es obligatorio y debe tener máximo 20 caracteres.');
      return;
    }
    if (!/^\S.{0,29}$/.test(e.target.lastName.value)) {
      errorNotification('El apellido es obligatorio y debe tener máximo 30 caracteres.');
      return;
    }
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(e.target.email.value)) {
      errorNotification('Debes ingresar un email válido.');
      return;
    }
    if (!/^\d{10}$/.test(e.target.cellPhone.value)) {
      errorNotification('El número de celular debe tener exactamente 10 dígitos.');
      return;
    }
    if (!/^\S{3,12}$/.test(e.target.user.value)) {
      errorNotification('El usuario debe tener entre 3 y 12 caracteres, sin espacios.');
      return;
    }
  
    const data = {
      name: sanitizeStrings(e.target.name.value, 2),
      lastName: sanitizeStrings(e.target.lastName.value, 2),
      user: sanitizeStrings(e.target.user.value, 2),
      email: sanitizeStrings(e.target.email.value, 4),
      cellPhone: sanitizeStrings(phone, 3),
      type: true,
    };
  
    try {
      await updateItems('accounts', isLogged.id, data);
      successNotification('Datos actualizados');
    } catch (error) {
      errorNotification('Ups, ¡Algo salió mal!');
    }
  };
  
  
  return (
    <main className="login-main">
      <form className="login-form" id="loginForm" autoComplete="off" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'white', margin: 0 }}>Datos Personales</h3>
          <hr style={{ margin: 0 }} />
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            title="Ingresa tu nombre (máximo 20 caracteres, no puede estar vacío)"
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
            title="Ingresa tu apellido (máximo 30 caracteres, no puede estar vacío)"
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
            title="Ingresa un correo electrónico válido"
            value={user.email}
            required
            onChange={handleChange}
          />
          <div>
            <select name="codigo" defaultValue={user.code} title="Selecciona tu código de país" required>
              <option value={user.code}>{user.code}</option>
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
              type="text"
              name="cellPhone"
              placeholder="Número Celular"
              pattern="\d{10}"
              maxLength="10"
              required
              value={user.cellPhone}
              onChange={handleChange}
              style={{ width: "60%" }}
            />
            <h3 style={{ color: 'white', margin: 0 }}>Cuenta</h3>
            <hr />
            <input
              type="text"
              name="user"
              placeholder="Usuario"
              title="Ingresa tu nombre de usuario (máximo 12 caracteres, no puede estar vacío)"
              maxLength={12}
              min={3}
              pattern="^\S+$*"
              required
              value={user.user ? user.user : ''}
              onChange={handleChange}
            />
            {/*<h5 style={{ color: 'white', margin: 0 }}>Cambiar Contraseña</h5>
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
            />*/}
          </div>
          <br />
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
      <ToastContainer/>
    </main>
  );
}

export default UserSettings;
