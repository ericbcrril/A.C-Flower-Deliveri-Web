import '../../styles/components/accountDetails.css';
import {Link} from 'react-router-dom';
import { MdCancel } from "react-icons/md";


function AccountDetails({visible}){
    return(
        <section className='accountDetails' style={{display: visible?"flex":"none"}}>
            <p>Usuario 0</p>
            <button>Editar</button>
            <button>Salir</button>
        </section>
    );
}

export default AccountDetails;