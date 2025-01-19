import {FaCartPlus} from 'react-icons/fa';
import '../../styles/components/btnAddCart.css';
import { useNavigate } from 'react-router-dom';
import { setCookie, getCookie } from '../../../scripts/handleCookies';

function BtnAddCart({isLogged, bouquet}){
    const navigate = useNavigate();
    const item = {
        name: bouquet.name,
        price: bouquet.price,
        priceID: bouquet.stripePriceId,
        quantity: 1,
    };

    function handleClick(){
            let gt = getCookie('cart');
            let cart = gt ? gt : '';
            let cookie = cart+JSON.stringify(item);
            setCookie('cart', cookie, 7, '/');
            console.log(getCookie('cart'));
            alert('Añadido');
    }

    return(
        <button className='btnAddCart' onClick={() => handleClick()}>
            <div>
                <FaCartPlus/>
            </div>
            <p>Añadir</p>
        </button>
    );
}

export default BtnAddCart;