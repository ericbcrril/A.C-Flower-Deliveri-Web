import {FaCartPlus} from 'react-icons/fa';
import '../../styles/components/btnAddCart.css';
import { useNavigate } from 'react-router-dom';

function BtnAddCart({isLogged}){
    const navigate = useNavigate();

    function handleClick(){
        if(isLogged.login){

        }
        else{
            navigate('/Login');
        }
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