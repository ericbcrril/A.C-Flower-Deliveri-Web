import React from 'react';
import '../styles/views/viewOrder.css';
import '../styles/html-grandiant.css';
import NavBar from "../components/misc/navbar";
import { useState, useEffect, useMemo } from 'react';
import { getItems, updateItems } from '../../scripts/apis';
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoReturnUpBackSharp } from "react-icons/io5";

function ViewOrder({isLogged}) {
    const [orders, setOrders] = useState([]);
    const [ordersF, setOrdersF] = useState([]);
    const [ordersFVisible, setOrdersFVisible] = useState(false);
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

    //Ver Ramo 
        // Calcular posiciones de flores en función del tamaño del ramo
          const [winW, setWinW] = useState(window.innerWidth);
          const [bouquetVisible, setBouquetVisible] = useState(false);
        
      // Manejar el evento de redimensionamiento de la ventana
        useEffect(() => {
          const handleResize = () => setWinW(window.innerWidth);
          window.addEventListener('resize', handleResize);
          return () => {
            window.removeEventListener('resize', handleResize);
          };
        }, []);
    
      const flowerPositions = useMemo(() => {
        const positions = [];
        const center = { x: 0, y: 0 };
        positions.push(center);
    
        const createCircle = (count, radius) => {
          const angleIncrement = (2 * Math.PI) / count;
          for (let i = 0; i < count; i++) {
            const angle = i * angleIncrement;
            positions.push({
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle),
            });
          }
        };
    
        let value0 = 18;
        let value1 = 11;
        let value2 = 8;
    
        if(winW < 1024){
           value0 = 10;
           value1 = 6;
           value2 = 4;
        }   
        if(winW < 450){
           value0 = 6.5;
           value1 = 4;
           value2 = 2.8;
        }   
    
          createCircle(9, winW / value0);
          createCircle(13, winW / value1);
          createCircle(20, winW / value2);
    
        return positions;
      }, [winW]);
    

    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className='h1-menu'><h1>A.C Flowers Delivery</h1></div>

            <main className="main-viewOrder">
                
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
                                                bouquet: order.bouquet,
                                                receiver: order.receiver,
                                                letter: order.letter,
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
                        <button onClick={()=>setOrdersFVisible(!ordersFVisible)}>Pedidos finalizados</button>
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
            <button onClick={()=>setDetailsvisible(true)}>Detalles</button>
            <button onClick={()=>setProgressVisible(false)}><IoReturnUpBackSharp /></button>
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
                            <tr>
                                <th>Carta</th>
                                <td>{orderDetails?.letter}</td>
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
                            <>
                            {orderDetails?.items.map((item) => (
                                <tr >
                                    <td>{item?.name}</td>
                                    <td>${item?.price} <strong>MXN</strong></td>
                                </tr>
                            ))}
                            {orderDetails?.bouquet && Array.isArray(orderDetails?.bouquet) && orderDetails.bouquet.length > 0 ? (
                                <>
                                    <tr>
                                        <td>Ramo Personalizado</td>
                                        <td>
                                            ${orderDetails?.bouquet?.reduce((sum, item) => sum + (item.price || 0), 0)} <strong>MXN</strong>
                                        </td>
                                    </tr>
                                    <button style={{translate: '120px'}} onClick={()=>setBouquetVisible(true)}>Ver Ramo</button>
                                </>
                            ) : <p>No hay ramo personalizado</p>}

                                </>
                            :
                            <p>Nada por aqui</p>
                            }
                        </tbody>
                    </table>
                    <button onClick={()=>setDetailsvisible(false)}><IoReturnUpBackSharp /></button>
                </section>

                <section className='order-section' style={{display: ordersFVisible ? '':'none'}}>
                    <h2>Pedidos Finalizados</h2>
                    <div className="table-container">
                        <table className='table-orders'>
                            <thead>
                                <tr>
                                    <th>Pedidos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                ordersF.length > 0 ? 
                                ordersF.map((order, index) => (
                                    <tr key={index} style={{display: 'flex', flexDirection: 'row'}}>
                                        <td style={{ resize: 'horizontal', overflow: 'hidden', display: 'flex', minWidth: '20px', width: '50px' }}>{order.userId}</td>
                                        <td style={{ resize: 'horizontal', overflow: 'hidden', display: 'flex', minWidth: '20px', width: 'fit-content' }}>{order.receiver}</td>
                                        <td style={{ resize: 'horizontal', overflow: 'hidden', display: 'flex', minWidth: '20px', width: 'fit-content' }}>{order.date}</td>
                                        <td style={{ resize: 'horizontal', overflow: 'hidden', display: 'flex', minWidth: '20px', width: 'fit-content' }}>{order.address.address}</td>
                                    </tr>
                                ))
                                :
                                <p>Nada por aqui</p>
                                }
                            </tbody>
                        </table>
                        <button onClick={()=>setOrdersFVisible(!ordersFVisible)}><IoReturnUpBackSharp /></button>
                    </div>
                </section>

                <section style={{display: bouquetVisible ? '':'none'}} className=''>
                         {/* Flores */}
                        <div className="flowers-container-order">
                            {flowerPositions?.map((position, index) => (
                            <div
                                key={index}
                                className="flower-position-order"
                                style={{
                                top: `calc(45% - ${position.y}px)`,
                                left: `calc(40% + ${position.x}px)`,
                                }}
                            >
                                {orderDetails?.bouquet && Array.isArray(orderDetails?.bouquet) && orderDetails?.bouquet[index]?.image && (
                                    <img
                                    src={orderDetails?.bouquet[index]?.image}
                                    alt={orderDetails?.bouquet[index]?.name}
                                    title={orderDetails?.bouquet[index]?.name}
                                    style={{ width: "50px", height: "50px" }}
                                    />
                                )}
                            </div>
                            ))}
                            <button onClick={() => setBouquetVisible(false)}>X</button>
                        </div>
                </section>

            </main>
        </>
    );
}

export default ViewOrder;
