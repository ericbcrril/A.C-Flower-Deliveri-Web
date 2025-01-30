import { FcOk } from "react-icons/fc";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import '../styles/views/handlePay.css';
import { deleteCookie, getCookie } from "../../scripts/handleCookies";
import { createItems } from "../../scripts/apis";
import { useNavigate } from "react-router-dom";

function HandlePay() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state') === 'true';
    const userId = params.get('userId');
    const receiver = params.get('receiver');
    const date = params.get('date');
    const time = params.get('time');
    const letter = params.get('letter');
    const addressString = params.get('address');
    const address = JSON.parse(decodeURIComponent(addressString));
    const item0 = localStorage.getItem('bouquet');
    const bouquet = JSON.parse(item0);
    const item1 = localStorage.getItem('bouquetItems');
    const items = JSON.parse(item1);

    if (state && bouquet?.length > 0) {
        async function handleGenOrder() {
            try {
                // Verificar si el pedido ya fue creado
                if (sessionStorage.getItem('orderCreated')) {
                    console.log('El pedido ya fue creado, no se generará de nuevo.');
                    return;
                }

                let data = {
                    userId: userId,
                    receiver: receiver,
                    items: items,
                    bouquet: bouquet,
                    date: date,
                    time: time,
                    letter: letter,
                    address: address,
                };
                console.log('Generando pedido:', data);

                // Crear el pedido
                await Promise.all([
                    localStorage.removeItem('bouquet'),
                    await createItems('orders/bouquet/', data),
                    navigate('/handlePayBouquet?state=true'),
                    localStorage.removeItem('bouquetItems'),
                ])
            } catch (error) {
                console.error('Error al generar el pedido:', error);
                alert('Hubo un error al generar el pedido.');
            }
        }

        handleGenOrder();
        window.location.reload();
    }

    return (
        <main>
            <div className="handlePay-container-message">
                {state ? (
                    <>
                        <FcOk size={48} />
                        <p>Puedes ver el estado de tu pedido en <Link to='/ConsultarPedido'>Consultar Pedido</Link></p>
                        <Link to='/Menu'>
                            <button>OK</button>
                        </Link>
                    </>
                ) : (
                    <>
                        <VscError size={48} color='red' />
                        <p>Algo salió mal, inténtalo de nuevo más tarde</p>
                        <Link to='/Menu'>
                            <button>OK</button>
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}

export default HandlePay;
