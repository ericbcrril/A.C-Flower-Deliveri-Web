import '../styles/views/viewOrder.css';
import NavBar from "../components/misc/navbar";
import { useNavigate } from 'react-router-dom';
import { getItems } from '../../scripts/apis';
import { useState, useEffect, useMemo } from 'react';
import { section, td } from 'framer-motion/client';
import { IoReturnUpBackSharp } from "react-icons/io5";
import React from 'react';

function ViewOrder({ isLogged }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    const [visible, setVisible] = useState(false);
    const [visible0, setVisible0] = useState(false);

    useEffect(() => {

        const getOrders = async () => {
            try {
                let response = await getItems('orders');
                let data = response.filter(data => data.userId === isLogged.id && data.finalized === false);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        getOrders();
    }, [isLogged, navigate]);

    function handleClickView(data){
        setOrderDetails(data);
        console.log(data);
        
        setVisible(true);
    }

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

    //const [flowers, setFlowers] = useState(Array(10).fill(null));
    const [flowers, setFlowers] = useState([]);
  

    return (
        <>
            <NavBar isLogged={isLogged} />
            <div className='h1-menu'><h1>A.C Flowers Delivery</h1></div>

            <main className="main-content">
                <section className='order-section'>
                    <h2>Pedidos</h2>
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

    
                    <section className='progress-section' style={{display: visible ? 'flex' : 'none'}}>
                        <h2>id : {orderDetails.id}</h2>
                        <h2>Aun no hemos tomado tu orden</h2>
                        <h2 style={{display: orderDetails?.state?.state0 ? 'flex' : 'none'}}>Tu Flower delivery se está preparando</h2>
                        <h2 style={{display: orderDetails?.state?.state1 ? 'flex' : 'none'}}>Tu Flower delivery va en camino</h2>
                        <h2 style={{display: orderDetails?.state?.state2 ? 'flex' : 'none'}}>Entregado</h2>
                        <button onClick={()=>setVisible0(true)}>Detalles de entrega</button>
                        <button onClick={()=>setVisible(false)}><IoReturnUpBackSharp /></button>
                     </section>
                

                <section className='details-section' style={{display: visible0 ? 'flex' : 'none'}}>
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
                            <>
                            {orderDetails?.items.map((item) => (
                                <tr >
                                    <td>{item?.name}</td>
                                    <td>{item?.price}$ MXN</td>
                                </tr>
                            ))}
                            {orderDetails?.bouquet && Array.isArray(orderDetails?.bouquet) && orderDetails.bouquet.length > 0 ? (
                                <>
                                    <tr>
                                        <td>Ramo Personalizado</td>
                                        <td>
                                            {orderDetails?.bouquet?.reduce((sum, item) => sum + (item.price || 0), 0)}$ MXN
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
                        <button onClick={()=>setVisible0(false)}><IoReturnUpBackSharp /></button>
                    </table>
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
