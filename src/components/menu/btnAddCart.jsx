import {FaCartPlus} from 'react-icons/fa';
import '../../styles/components/btnAddCart.css';

function BtnAddCart(){
    return(
        <button className='btnAddCart'>
            <div>
                <FaCartPlus/>
            </div>
            <p>Añadir</p>
        </button>
    );
}

export default BtnAddCart;