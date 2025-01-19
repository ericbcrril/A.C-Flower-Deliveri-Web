import '../styles/views/viewOrder.css';
import NavBar from "../components/misc/navbar";

function ViewOrder({isLogged}) {
    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className=''><h1 className='h1-menu'>A.C Flowers Delivery</h1></div>

            <main className="main-content">
                <section className='order-section'>
                    <h2>Pedidos</h2>
                    <div className="table-container">
                        <table className='table-orders'>
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(10)].map((_, index) => (
                                    <tr key={index}>
                                        <td>{16328 + index}</td>
                                        <td>
                                            <button>Consultar</button>
                                            <button>Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                

                <section className='progress-section'>
                    <h2>Progreso del Pedido</h2>
                    <table className='table-progress'>
                        <tbody>
                            <tr>
                                <th>ID Pedido</th>
                                <td>16328</td>
                            </tr>
                            {[...Array(4)].map((_, phase) => (
                                <tr key={phase}>
                                    <td>Fase {phase + 1}</td>
                                    <td>{phase < 3 ? 'Terminado' : 'En Proceso...'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                    <section className='details-section'>
                    <h2>Detalles de Entrega</h2>
                    <table className='table-details'>
                        <tbody>
                            <tr>
                                <th>Recibe</th>
                                <td>Nadia</td>
                            </tr>
                            <tr>
                                <th>Fecha</th>
                                <td>02-03-2025</td>
                            </tr>
                            <tr>
                                <th>Hora</th>
                                <td>12:00 a 04:00</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    );
}

export default ViewOrder;
