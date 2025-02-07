import { FaCartPlus } from 'react-icons/fa';
import '../../styles/components/btnAddCart.css';
import { useNavigate } from 'react-router-dom';
import { setCookie, getCookie } from '../../../scripts/handleCookies';
import { ToastContainer, toast } from 'react-toastify';

function BtnAddCart({ isLogged, bouquet }) {
    const navigate = useNavigate();
    const item = {
        name: bouquet.name,
        price: bouquet.price,
        stripeProductId: bouquet.stripeProductId,
        stripePriceId: bouquet.stripePriceId,
        quantity: 1,
    };

    function handleClick() {
        let gt = getCookie('cart');
        let cart = gt ? gt : '';
        let cookie = cart + JSON.stringify(item);
        setCookie('cart', cookie, 7, '/');
        showSuccessNotification();
    }

    const showSuccessNotification = () => {
        toast.success(`¡${bouquet.name} añadido al carrito!`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    return (
        <>
            <button className='btnAddCart' onClick={() => handleClick()}>
                <div>
                    <FaCartPlus />
                </div>
                <p>${bouquet.price} <strong>MXN</strong></p>
            </button>
            <ToastContainer />
        </>
    );
}

export default BtnAddCart;
