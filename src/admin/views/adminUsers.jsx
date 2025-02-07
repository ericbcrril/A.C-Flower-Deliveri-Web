import { useEffect, useState } from 'react';
import '../styles/views/defFlowers.css';
import '../styles/html-grandiant.css';
import NavBar from "../components/misc/navbar";
import { deleteItems, updateItems } from '../../scripts/apis';
import sanitizeString from '../../scripts/sanitizeStrings';
import axios from 'axios';
import { IoSearchCircleSharp } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";
import { BASE_URL } from '../../scripts/response';
import { ToastContainer } from 'react-toastify';
import { errorNotification, successNotification } from '../../scripts/notifications';

function DefFlowers({isLogged}) {
    let arrayN = [];
    const [updateBox, setUpdateBox] = useState(false);
    const [formUpdate, setFormUpdate] = useState({
        user: '',
        name: '',
        lastName: '',
        email: '',
        cellPhone: ''
    });

    const [users, setUsers] = useState([]); 
    
     const getUsers = async () => {
            let response = await axios.get(`${BASE_URL}/accounts/getAllUsers`, { withCredentials: true });
            //console.log(users);
            let data = response.data;
            setUsers(data.filter(user => user.user !== isLogged?.user));
        } 
        
        useEffect(() => {
            getUsers();
        }, []); // Solo se ejecuta una vez al montar el componente
        
        const handleSearch = (e) => {
            e.preventDefault();
            const search = e.target.search.value.toLowerCase(); // Convertimos la búsqueda a minúsculas
        
            // Filtra los usuarios buscando en cualquier campo
            const filteredUsers = users.filter(user => {
                const lowercasedUser = {
                    user: user.user.toLowerCase(),
                    name: user.name.toLowerCase(),
                    lastName: user.lastName.toLowerCase(),
                    email: user.email.toLowerCase(),
                    cellPhone: user.cellPhone.toLowerCase(),
                };
        
                return Object.values(lowercasedUser).some(field =>
                    field.includes(search)
                );
            });
        
            setUsers(filteredUsers);
        };
        
        
        

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormUpdate((prev) => ({ ...prev, [name]: value }));
      };

    function handleClickUpdate(data){
        setUpdateBox(true);
        setFormUpdate(data);
    }

    function handleUpdate(event) {
        event.preventDefault();
    
        // Obtener la referencia del formulario
        const form = document.getElementById('updateItemForm');
    
        // Crear un objeto con los datos actualizados
        const data = {
            user: sanitizeString(event.target.user.value, 2),
            name: sanitizeString(event.target.name.value, 2),
            lastName: sanitizeString(event.target.lastName.value, 2),
            email: sanitizeString(event.target.email.value, 4),
            cellPhone: sanitizeString(event.target.cellPhone.value, 3),
        };
    
        enviarDatosActualizados(data);
    }
    
    async function enviarDatosActualizados(data) {
        try {
            //console.log('Datos a enviar:', data);
            await updateItems('accounts', formUpdate._id, data); // Llama a tu API para actualizar
            successNotification('Registro actualizado correctamente');
            getUsers(); // Actualiza la lista de usuarios
        } catch (error) {
            errorNotification('¡Ups!, algo salio mal');
            console.error('Error al actualizar el ítem:', error);
        }
    }
    

    function handleDelete(id){
        try {
            deleteItems('accounts', id);
            getUsers();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
        
    }
    
    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className='h1-menu'>
                <h1>Usuarios Registrados</h1>
            </div>
            <main className='main-defFlowers'>
                <div className='container-data' >
                    <h2>Usuarios Registrados</h2>

                    <form onSubmit={handleSearch} style={{display: 'flex', flexDirection: 'row'}}>
                        <input name='search' style={{margin: 0}} type="text" placeholder='Nombre de usuario' required/>
                        <button type='submit' style={{all: 'unset'}}>
                            <IoSearchCircleSharp size={38} style={{cursor: 'pointer'}}/>
                        </button>
                        <button type='button' style={{all: 'unset'}} onClick={() => getUsers()}>
                            <GrPowerReset size={32} style={{cursor: 'pointer'}}/>
                        </button>
                    </form>

                    <div className="table-container">
                    
                    {
                        users?.length > 0 ?
                            <table>
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th className='d-none'>email</th>
                                    <th className='d-none'>Numero</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>

                                {users.map((users) => (
                                    <tr>
                                        <td>{users.user}</td>
                                        <td className='d-none'>{users.email}</td>
                                        <td className='d-none'>{users.cellPhone}</td>
                                        <td>
                                            <button onClick={() => handleClickUpdate(users)}>Editar</button>
                                            <button onClick={() => handleDelete(users._id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        :
                        <p>Cargando...</p> 
                    }
        
                    </div>
                </div>
                
                <div className='container-data createBox' style={{display: updateBox ? 'flex':'none'}}>
                    <h2>{formUpdate.name ? formUpdate.user:'Editar'}</h2>
                    <form onSubmit={handleUpdate} id='updateItemForm'>
                        <input type="text" name="user" id="" placeholder='Usuario' 
                                maxLength={12} pattern="^\S+$" title="Máximo 12 caracteres, sin espacios vacíos"
                                value={formUpdate.user} onChange={handleChange}/>
                        <input type="text" name="name" id="" placeholder='Nombre' 
                                maxLength={20} pattern=".*\S.*" title="Máximo 20 caracteres"
                                value={formUpdate.name} onChange={handleChange}/>
                        <input type="text" name="lastName" id="" placeholder='Apellido' 
                                maxLength={30} pattern=".*\S.*" title="Máximo 30 caracteres"
                                value={formUpdate.lastName} onChange={handleChange}/>
                        <input type="email" name="email" id="" placeholder='Email' 
                                title="Ingrese un correo electrónico válido"
                                value={formUpdate.email} onChange={handleChange}/>
                        <input type="text" name="cellPhone" id="" placeholder='Numero de celular' 
                                value={formUpdate.cellPhone} onChange={handleChange}/>
                        <button type='submit'>Guardar</button>
                    </form>
                        <button onClick={() => setUpdateBox(false)}>Cancelar</button>
                </div>
            
            </main>
            <ToastContainer />
        </>
    );
}

export default DefFlowers;
