import '../../styles/components/navMenus.css';
import { userLogout } from '../../../scripts/apis';
import { LuUser } from 'react-icons/lu';
import { IoSettings } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { useNavigate } from 'react-router-dom';


function AccountDetails({visible, isLogged}){
    //let userInfo = getUserAndTokenFromCookie();
    const navigate = useNavigate();
    return(
        <section className='accountDetails' style={{display: visible?"flex":"none"}}>
            <LuUser color='White' size={62} style={{alignSelf: "center"}}/>
            <p style={{alignSelf: "center", fontWeight: "bold"}}>{isLogged?.user}</p>
            <div>
                <button onClick={() => navigate('/Ajustes')} style={{width: 'fit-content', alignSelf: 'center'}}>
                    <IoSettings color='white'/>
                </button>
                <button onClick={ () => userLogout() }>
                    <ImExit color='white'/>
                </button>
            </div>
            
        </section>
    );
}

export default AccountDetails;