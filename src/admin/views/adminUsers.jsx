import { useEffect, useState } from 'react';
import '../styles/views/defFlowers.css';
import NavBar from "../components/misc/navbar";
import { createItems, getItems, deleteItems, updateItems } from '../../scripts/apis';
import sanitizeString from '../../scripts/sanitizeStrings';
import { image, p } from 'framer-motion/client';
import axios from 'axios';
import { IoSearchCircleSharp } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";

function DefFlowers({isLogged}) {
    let arrayN = [];
    const [updateBox, setUpdateBox] = useState(false);
    const [img0, setImg0] = useState();
    const [img1, setImg1] = useState();
    const [formUpdate, setFormUpdate] = useState({
        user: '',
        name: '',
        lastName: '',
        email: '',
        cellPhone: ''
    });

    const [users, setUsers] = useState([]); 
    
     const getUsers = async () => {
            let response = await axios.get('http://localhost:5000/api/accounts/getAllUsers', { withCredentials: true });
            console.log(users);
            let data = response.data;
            setUsers(data.filter(user => user.user !== isLogged?.user));
        } 
        
    useEffect(() => {
        getUsers();
    }, [users === arrayN])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormUpdate((prev) => ({ ...prev, [name]: value }));
      };


    function handleSearch(e){
        e.preventDefault();
        let search = e.target.search.value;
        setUsers(users.filter(user => user.user === search))
    }

    function handleClickUpdate(data){
        setUpdateBox(true);
        setImg0(data.image);
        setFormUpdate(data);
    }

      function handleUpdate(event) {
        event.preventDefault();
    
        // Obtener la referencia del formulario
        const form = document.getElementById('updateItemForm');
        const img = event.target.img?.files[0];
    
        // Crear un objeto con los datos actualizados
        const data = {
            user: sanitizeString(event.target.user.value, 2),
            name: sanitizeString(event.target.name.value, 2),
            lastName: sanitizeString(event.target.lastName.value, 2),
            email: sanitizeString(event.target.email.value, 4),
            cellPhone: sanitizeString(event.target.cellPhone.value, 3),
        };
    
        // Si hay una nueva imagen, leerla como base64
        if (img) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                data.image = reader.result; // Actualizar la imagen con el base64
                await enviarDatosActualizados(data);
            };
            reader.readAsDataURL(img);
        } else {
            // Si no hay nueva imagen, proceder directamente
            enviarDatosActualizados(data);
        }
    }
    
    async function enviarDatosActualizados(data) {
        try {
            console.log('Datos a enviar:', data);
            await updateItems('accounts', formUpdate._id, data); // Llama a tu API para actualizar
            setImg0(data.image);
            getUsers(); // Actualiza la lista de usuarios
        } catch (error) {
            console.error('Error al actualizar el ítem:', error);
        }
    }
    

    function handleDelete(id){
        deleteItems('accounts', id);
        getUsers();
    }
    
    function handleSubmitNewItem(event) {
        event.preventDefault();
        let form = document.getElementById('newItemForm');
        let img = event.target.img.files[0];
      
        if (!img) {
          alert("Por favor, seleccione una imagen.");
          return;
        }
      
        // Crear un FileReader para leer la imagen
        const reader = new FileReader();
      
        reader.onloadend = async () => {
          // Aquí tendrás la imagen como base64
          const imageBase64 = reader.result;
      
          let data = {
            imageName: img.name,
            name: sanitizeString(event.target.name.value, 2),
            price: sanitizeString(event.target.price.value, 2),
            description: sanitizeString(event.target.desc.value, 1),
            image: imageBase64
          };
      
          try {
            await createItems('bouquets', data);
            form.reset();
            setImg1(null);
            getUsers(); // Actualiza la lista de ramos
          } catch (error) {
            console.error("Error al crear el item:", error);
          }
        };
      
        reader.readAsDataURL(img); // Convierte la imagen a base64
      }
      
      
      

    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className='h1-menu'>
                <h1>Usuarios Registrados</h1>
            </div>
            <main className='main-defFlowers'>
                <div className='container-data' style={{width: '44%'}}>
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
                                    <th>email</th>
                                    <th>Numero</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>

                                {users.map((users) => (
                                    <tr>
                                        <td>{users.user}</td>
                                        <td>{users.email}</td>
                                        <td>{users.cellPhone}</td>
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
                
                <div className='container-data' style={{display: updateBox ? '':'none'}}>
                    <h2>{formUpdate.name ? formUpdate.user:'Editar'}</h2>
                    <form onSubmit={handleUpdate} id='updateItemForm'>
                        <input type="text" name="user" id="" placeholder='Usuario' value={formUpdate.user} onChange={handleChange}/>
                        <input type="text" name="name" id="" placeholder='Nombre' value={formUpdate.name} onChange={handleChange}/>
                        <input type="text" name="lastName" id="" placeholder='Apellido' value={formUpdate.lastName} onChange={handleChange}/>
                        <input type="email" name="email" id="" placeholder='Email' value={formUpdate.email} onChange={handleChange}/>
                        <input type="text" name="cellPhone" id="" placeholder='Numero de celular' value={formUpdate.cellPhone} onChange={handleChange}/>
                        <button type='submit'>Guardar</button>
                    </form>
                        <button onClick={() => setUpdateBox(false)}>Cancelar</button>
                </div>
                
                {/*<div className='container-data'>
                    <h2>Nuevo Registro</h2>
                    <form onSubmit={handleSubmitNewItem} id='newItemForm'>
                    <input type="text" name="user" id="" placeholder='Usuario' required/>
                        <input type="text" name="name" id="" placeholder='Nombre' required/>
                        <input type="text" name="lastName" id="" placeholder='Apellido' required/>
                        <input type="email" name="email" id="" placeholder='Email' required/>
                        <input type="text" name="cellPhone" id="" placeholder='Numero de celular' required/>
                                                <button type='submit'>Guardar</button>
                        <button type='reset'>Cancelar</button>
                    </form>
                </div>*/}
            </main>
        </>
    );
}

export default DefFlowers;
