import '../styles/views/viewOrder.css';
import NavBar from "../components/misc/navbar";
import { useNavigate } from 'react-router-dom';
import { getItems } from '../../scripts/apis';
import { useState, useEffect } from 'react';
import { section } from 'framer-motion/client';

function ViewOrder({ isLogged }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [visible, setVisible] = useState(false);

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
        setVisible(true);
    }

    return (
        <>
            <NavBar isLogged={isLogged} />
            <div className=''><h1 className='h1-menu'>A.C Flowers Delivery</h1></div>

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
                     </section>
                

                <section className='details-section' style={{display: visible ? 'flex' : 'none'}}>
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
            </main>
        </>
    );
}

export default ViewOrder;
