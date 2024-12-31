import '../../styles/components/shoppingCart.css';
import {Link} from 'react-router-dom';
import { MdCancel } from "react-icons/md";


function ShoppingCart({visible}){
    return(
        <section className='shopping-cart' style={{display: visible?"flex":"none"}}>
            <div className='order-container'>
                <p>Pedido 1</p>
                <MdCancel color='White' style={{cursor: 'pointer'}}/>
            </div>
            <div>
                <p>Pedido 1</p>
                <MdCancel color='White' style={{cursor: 'pointer'}}/>
            </div>
            <div>
                <p>Pedido 1</p>
                <MdCancel color='White' style={{cursor: 'pointer'}}/>
            </div>
            <button>Pagar</button>
        </section>
    );
}

export default ShoppingCart;