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
        //console.log(data);
        
        setVisible(true);
    }

    //Ver Ramo 
    // Calcular posiciones de flores en función del tamaño del ramo
      const [bouquetVisible, setBouquetVisible] = useState(false);
    
  // Manejar el evento de redimensionamiento de la ventana
    const [winW, setWinW] = useState(window.innerWidth);
    const [winH, setWinH] = useState(window.innerHeight);
    useEffect(() => {
      const handleResizeW = () => setWinW(window.innerWidth);
      const handleResizeH = () => setWinH(window.innerHeight);
      window.addEventListener('resize', handleResizeW);
      window.addEventListener('resize', handleResizeH);
      return () => {
        window.removeEventListener('resize', handleResizeW);
        window.removeEventListener('resize', handleResizeH);
      };
    }, [winW, winH]);

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

    if(winW > 449 && winW < 1025 && winH > 719){//Tablets Port
       value0 = 9.5; 
       value1 = 5.8;
       value2 = 4;
    }    
    if(winW < 451){//Movil Port
       value0 = 6.5;
       value1 = 4;
       value2 = 2.8;
    }    
    if(winH < 451 && winW > 649 && winW < 951){//Movil Land
       
    } 

      createCircle(9, winW / value0);
      createCircle(13, winW / value1);
      createCircle(20, winW / value2);

    return positions;
  }, [winW]);
  
    return (
        <>
            <NavBar isLogged={isLogged} />
            <div className='h1-menu'><h1>A.C Flowers Delivery</h1></div>

            <main className="main-viewOrder">
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
                                            <div className='div-button' onClick={() => handleClickView({
                                                id: order._id,
                                                items: order.items,
                                                bouquet: order.bouquet,
                                                receiver: order.receiver,
                                                letter: order.letter,
                                                date: order.date,
                                                time: order.time,
                                                state: order.state,
                                                address: order.address
                                            })}>Consultar</div>
                                        </td>
                                    </tr>
                                ))
                                :
                                <tr>
                                    <td>Nada por aqui</td>    
                                </tr>
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
                                    <div className='div-button' style={{translate: '120px'}} onClick={()=>setBouquetVisible(true)}>Ver Ramo</div>
                                </>
                            ) : 
                                <tr>
                                    <td>Nada por aqui</td>    
                                </tr>
                            }
                                </>
                            :
                                <tr>
                                    <td>Nada por aqui</td>    
                                </tr>
                            }
                        </tbody>
                    </table>
                    <button onClick={()=>setVisible0(false)}><IoReturnUpBackSharp /></button>
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
