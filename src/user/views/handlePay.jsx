import { FcOk } from "react-icons/fc";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import '../styles/views/handlePay.css';
import { deleteCookie, getCookie } from "../../scripts/handleCookies";
import { createItems } from "../../scripts/apis";
import { useNavigate } from "react-router-dom";


function HandlePay(){

    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const state =   params.get('state') === 'true';
    let cart = getCookie('cart');

    if(state && cart !== null){
        const userId =  params.get('userId');
        const receiver= params.get('receiver');
        const date =    params.get('date');
        const time =    params.get('time');
        const letter =  params.get('letter');
        const addressString = params.get('address');
        const address = JSON.parse(decodeURIComponent(addressString));
        console.log(address);
        
        
        let formattedInput = `[${cart.replace(/}{/g, '},{')}]`;
        let items = JSON.parse(formattedInput);
        
    
        async function handleGenOrder(){
            try {
                let data = {
                    userId: userId,
                    receiver: receiver,
                    items: items,
                    date: date,
                    time: time,
                    letter: letter,
                    address: address,
                };
                console.log(data);
                
                await Promise.all([
                    createItems('orders', data),
                    deleteCookie('cart', '/')
                ]) 
                navigate('/handlePay?state=true');
            } catch (error) {
                console.error('Error al generar el pedido:', error);
                alert('Hubo un error al generar el pedido.');
            }
        }
        handleGenOrder();
    }    

    return(
        <main>
                <div className="handlePay-container-message">
                    {state ?
                        <>
                            <FcOk size={48}/>
                            <p>Puedes ver el estado de tu pedido en <Link to='/ConsultarPedido'>Consultar Pedido</Link></p>
                            <Link to='/Menu'>
                            <button>OK</button>
                            </Link>
                        </>
                        :
                        <>
                            <VscError size={48} color='red'/>
                            <p>Algo salio mal, intentalo de nuevo mas tarde</p>
                            <Link to='/Menu'>
                            <button>OK</button>
                            </Link>
                        </>
                    }
                </div>
        </main>
    );
}

export default HandlePay;