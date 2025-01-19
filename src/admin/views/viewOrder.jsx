import '../styles/views/viewOrder.css';
import NavBar from "../components/misc/navbar";
import { useState, useEffect } from 'react';
import { getItems, updateItems } from '../../scripts/apis';
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


function ViewOrder({isLogged}) {
    const [orders, setOrders] = useState([]);
    const [ordersF, setOrdersF] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [progressVisible, setProgressVisible] = useState(false);
    const [detailsVisible, setDetailsvisible] = useState(false);

    useEffect(() => {

        const getOrders = async () => {
            try {
                let response = await getItems('orders');
                let data = response.filter(data => data.finalized === false);
                let finalizedOrders = response.filter(data => data.finalized === true);
                setOrders(data);
                setOrdersF(finalizedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        getOrders();
    }, []);

    useEffect(() => {
        if (!orderDetails?.state?.state0) {
            setOrderDetails((prev) => ({
                ...prev,
                state: {
                    state1: false,
                    state2: false
                }
            }));
        }
    
        if (orderDetails?.state?.state1 === false && orderDetails?.state?.state2) {
            setOrderDetails((prev) => ({
                ...prev,
                state: {
                    state0: true,
                    state1: false,
                    state2: false
                }
            }));
        }
    
        const debounceTimer = setTimeout(async () => {
            if (orderDetails.id) {
                try {
                    await updateItems('orders', orderDetails.id, {state: orderDetails.state});
                } catch (error) {
                    console.error('Error updating order state:', error);
                }
            }
        }, 300); // Espera 300ms antes de hacer la llamada al API
    
        // Cleanup para cancelar el temporizador si el efecto vuelve a ejecutarse
        return () => clearTimeout(debounceTimer);
    }, [orderDetails?.id, JSON.stringify(orderDetails?.state)]); // Evita bucles comparando estados como strings
    

    function handleClickView(data){
        setOrderDetails(data);
        setDetailsvisible(true);
        data?.state ? 
            setProgressVisible(true)
        :
            setProgressVisible(false)
    }

    const updateOrderState = (newState) => {
        setOrderDetails((prev) => ({ ...prev, state: { ...prev.state, ...newState } }));
    };
    const updateOrderFinalized = async () => {
        try {
            await updateItems('orders', orderDetails.id, {finalized: true});
            window.location.reload();
        } catch (error) {
            console.error('Error updating order state:', error);
        }
    };
        

    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className=''><h1 className='h1-menu'>A.C Flowers Delivery</h1></div>

            <main className="main-content">
                <section className='order-section'>
                    <h2>Pedidos Pendientes</h2>
                    <div className="table-container">
                        <table className='table-orders'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                orders.length > 0 ? 
                                orders.map((order, index) => (
                                    <tr key={index}>
                                        <td>Para: {order.receiver}</td>
                                        <td>
                                            <button onClick={() => handleClickView({
                                                id: order._id,
                                                items: order.items,
                                                receiver: order.receiver,
                                                date: order.date,
                                                time: order.time,
                                                state: order.state,
                                                address: order.address
                                            })}>Consultar</button>
                                        </td>
                                    </tr>
                                ))
                                :
                                <p>Nada por aqui</p>
                                }
                            </tbody>
                        </table>
                    </div>
                </section>

                

                <section className="progress-section" style={{ display: progressVisible ? 'flex' : 'none' }}>
            <h2>Progreso del Pedido</h2>
            <table className="table-progress">
                <thead>
                    <tr>
                        <th>{orderDetails.id}</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tomar orden</td>
                        <td>
                            <button
                                onClick={() => updateOrderState({ state0: true })}
                            >
                                {orderDetails?.state?.state0 ? 'Procesando' : 'Tomar'}
                            </button>
                        </td>
                    </tr>
                    {orderDetails?.state?.state0 && (
                        <>
                            <tr>
                                <td>Flower delivery en camino</td>
                                <td>
                                    <button
                                        
                                        style={{background: orderDetails?.state?.state1 ? 'green' : ''}}
                                        onClick={() => updateOrderState({ state1: true })}
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        style={{background: orderDetails?.state?.state1 ? '' : 'red'}}
                                        onClick={() => updateOrderState({ state1: false })}
                                    >
                                        <IoClose />
                                    </button>
                                </td>
                            </tr>
                            {orderDetails?.state?.state1 && (
                                <tr>
                                    <td>Entregado</td>
                                    <td>
                                        <button
                                            style={{background: orderDetails?.state?.state2 ? 'green' : ''}}
                                            onClick={() => updateOrderState({ state2: true })}
                                        >
                                            <FaCheck />
                                        </button>
                                        <button
                                            style={{background: orderDetails?.state?.state2 ? '' : 'red'}}
                                            onClick={() => updateOrderState({ state2: false })}
                                        >
                                            <IoClose />
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
            {orderDetails?.state?.state2 && (
                <button className="btn-finalizar"
                onClick={() => updateOrderFinalized()}
                >Finalizar</button>
            )}
        </section>
                
                <section className='details-section' style={{display: detailsVisible ? 'flex' : 'none'}}>
                    <h2>Detalles de Entrega</h2>
                    <table className='table-details'>
                        <tbody>
                            <tr>
                                <th>Recibe</th>
                                <td>{orderDetails?.receiver}</td>
                            </tr>
                            <tr>
                                <th>Fecha</th>
                                <td>{orderDetails?.date}</td>
                            </tr>
                            <tr>
                                <th>Hora</th>
                                <td>{orderDetails?.time}</td>
                            </tr>
                            <tr>
                                <th>Direccion</th>
                                <td>{orderDetails?.address?.address}</td>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                    <table className='table-details'>
                        <tbody>
                            <tr>
                                <th>Pedido</th>
                                <th>Costo</th>
                            </tr>
                            {
                            orderDetails?.items ?
                            orderDetails?.items.map((item) => (
                                <tr >
                                    <td>{item?.name}</td>
                                    <td>{item?.price}$ MXN</td>
                                </tr>
                            ))
                            :
                            <p>Nada por aqui</p>
                            }
                        </tbody>
                    </table>
                </section>

                <section className='order-section'>
                    <h2>Pedidos Entregados</h2>
                    <div className="table-container">
                        <table className='table-orders'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                ordersF.length > 0 ? 
                                ordersF.map((order, index) => (
                                    <tr key={index}>
                                        <td>Para: {order.receiver}</td>
                                        <td>
                                            <button onClick={() => handleClickView({
                                                id: order._id,
                                                items: order.items,
                                                receiver: order.receiver,
                                                date: order.date,
                                                time: order.time,
                                                state: false,
                                                address: order.address
                                            })}>Consultar</button>
                                        </td>
                                    </tr>
                                ))
                                :
                                <p>Nada por aqui</p>
                                }
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>
        </>
    );
}

export default ViewOrder;
