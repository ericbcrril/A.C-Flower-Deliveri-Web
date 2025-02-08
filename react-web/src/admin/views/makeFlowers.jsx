import { useEffect, useState } from 'react';
import '../styles/views/defFlowers.css';
import '../styles/html-grandiant.css';
import NavBar from "../components/misc/navbar";
import { createItems, getItems, deleteItems, updateItems } from '../../scripts/apis';
import sanitizeString from '../../scripts/sanitizeStrings';
import { TiPlus } from 'react-icons/ti';
import { ToastContainer } from 'react-toastify';
import { infoNotification, errorNotification, successNotification } from '../../scripts/notifications';

function DefFlowers({isLogged}) {
    const [updateBox, setUpdateBox] = useState(false);
    const [createBox, setCreateBox] = useState(false);
    const [img0, setImg0] = useState();
    const [img1, setImg1] = useState();
    const [formUpdate, setFormUpdate] = useState({
        imageName: '',
        name: '',
        price: '',
        description: '',
        image: ''
    });

    const [flowers, setFlowers] = useState([]); 
    const [items, setItems] = useState([]); 
     const getData = async () => {
            let response = await getItems('items');
            let flowers = response.filter(response => response.type === 'flower' || response.type === 'foliage')
            let items = response.filter(response => response.type === 'accessory')
            setFlowers(flowers);
            setItems(items);
        } 
        
    useEffect(() => {
        getData();
    }, [])


    function handleChangeImg(e){
        let img = e.target.files[0];
        const imageURL = URL.createObjectURL(img); // Crea una URL temporal
        setImg1(imageURL);
    }
    
    function handleClickUpdate(data){
        setUpdateBox(true);
        setImg0(data.image);
        setFormUpdate(data);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormUpdate((prev) => ({ ...prev, [name]: value }));
      };

      function handleUpdate(event) {
        event.preventDefault();
    
        // Obtener la referencia del formulario
        //const form = document.getElementById('updateItemForm');
        const img = event.target.img?.files[0];
    
        // Crear un objeto con los datos actualizados
        const data = {
            name: sanitizeString(formUpdate.name, 2),
            price: formUpdate.price,
            image: formUpdate.image, // Por defecto, usa la imagen existente
        };
    
        // Si hay una nueva imagen, leerla como base64
        if (img) {
            const fileSizeMB = img.size / (1024 * 1024); // Convertir img a MB
            /* Comprobacion de imagen */
            if (fileSizeMB > 1) {
                infoNotification("La imagen no puede ser mayor a 1MB");
                return null;
            } 
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
            //console.log('Datos a enviar:', data);
            await updateItems('items', formUpdate._id, data); // Llama a tu API para actualizar
            setImg0(data.image);
            successNotification('Registro actualizado correctamente');
            getData(); // Actualiza la lista de ramos
        } catch (error) {
            errorNotification('¡Ups!, algo salio mal');
            console.error('Error al actualizar el ítem:', error);
        }
    }
    

    async function handleDelete(id){
        try {
            await deleteItems('items', id);
            getData();
        } catch (error) {
            console.error('Error al eliminar el ítem:', error);
        }
    }
    
    function handleSubmitNewItem(event) {
        event.preventDefault();
        let form = document.getElementById('newItemForm');
        let img = event.target.img.files[0];
        const fileSizeMB = img.size / (1024 * 1024); // Convertir img a MB

        /* Comprobacion de imagen */

        if (!img) {
            infoNotification("Por favor, seleccione una imagen.");
            return null;
          }

        if (fileSizeMB > 0.5) {
            infoNotification("La imagen no puede ser mayor a 500KB");
            return null;
        } 
        
        // Crear un FileReader para leer la imagen
        const reader = new FileReader();
      
        reader.onloadend = async () => {
          // Aquí tendrás la imagen como base64
          const imageBase64 = reader.result;
      
          let data = {
            name: sanitizeString(event.target.name.value, 2),
            price: sanitizeString(event.target.price.value, 2),
            image: imageBase64,
            type: event.target.type.value
          };
      
          try {
            await createItems('items', data);
            form.reset();
            setImg1(null);
            successNotification('Nuevo registro en base de datos');
            getData(); // Actualiza la lista de ramos
          } catch (error) {
            errorNotification('¡Ups!, algo salio mal');
            console.error("Error al crear el item:", error);
          }
        };
      
        reader.readAsDataURL(img); // Convierte la imagen a base64
      }
      
      
      

    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className='h1-menu'>
                <h1>Armar Ramo - Registros</h1>
            </div>
            <main className='main-defFlowers'>
                <div className='container-data'>
                <h2>Flores y Follajes</h2>
                    <div className="table-container0">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>

                            {Array.isArray(flowers) && flowers.map((flowers, index) => (
                                <tr key={flowers._id}>
                                    <td>{flowers.name}</td>
                                    <td>${flowers.price} <strong>MXN</strong></td>
                                    <td>
                                        <button onClick={() => handleClickUpdate(flowers)}>Editar</button>
                                        <button onClick={() => handleDelete(flowers._id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    <h2>Accesorios</h2>
                    <div className="table-container0">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>

                            {Array.isArray(items) && items.map((items, index) => (
                                <tr key={items._id}>
                                    <td>{items.name}</td>
                                    <td>${items.price} <strong>MXN</strong></td>
                                    <td>
                                        <button onClick={() => handleClickUpdate(items)}>Editar</button>
                                        <button onClick={() => handleDelete(items._id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    
                    
                </div>
                
                <div className='container-data createBox' style={{display: updateBox ? 'flex':'none'}}>
                    <h2>{formUpdate.name ? formUpdate.name:'Editar'}</h2>
                    <img src={img0} alt="" />
                    <form onSubmit={handleUpdate} id='updateItemForm'>
                        <input type="file" name="img" id="" accept=".png, .jpg, .jpeg, .webp"/>
                        <input type="text" name="name" id="" placeholder='Nombre' value={formUpdate.name} onChange={handleChange}/>
                        <input type="number" name="price" id="" placeholder='Precio MXN' min={0} value={formUpdate.price} onChange={handleChange}/>
                        <button type='submit'>Guardar</button>
                    </form>
                        <button onClick={() => setUpdateBox(false)}>Cancelar</button>
                </div>
                
                <div className='container-data createBox' style={{display: createBox ? 'flex':''}}>
                    <h2>Nuevo Registro</h2>
                    <img src={img1} alt="" />
                    <form onSubmit={handleSubmitNewItem} id='newItemForm'>
                        <input type="file" name="img" accept=".png, .jpg, .jpeg, .webp" onChange={handleChangeImg} required/>
                        <input type="text" name="name" placeholder='Nombre' required/>
                        <input type="number" name="price" placeholder='Precio MXN' min={0} required/>
                        <select name="type" defaultValue={'flower'}>
                          <option value='flower'>🌺 Flor</option>
                          <option value='foliage'>🌿 Follage</option>
                          <option value='accessory'>🍬 Accesorio</option>
                        </select>
                        <button type='submit'>Guardar</button>
                        <button type='reset' onClick={()=> setCreateBox(false)}>Cancelar</button>
                    </form>
                </div>
            </main>
            <TiPlus className='btn-add-register' onClick={()=> setCreateBox(!createBox)}/>
            <ToastContainer />
        </>
    );
}

export default DefFlowers;
