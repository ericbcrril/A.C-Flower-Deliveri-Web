import '../../styles/components/nav.css';
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuSquareMenu } from "react-icons/lu";
import { TfiMenuAlt } from "react-icons/tfi";
import { useState } from 'react';
import NavMenu from './navMenu';
import AccountDetails from './accountDetails';
import { IoClose } from 'react-icons/io5';



function NavBar({isLogged}){
    const [navM, setNM] = useState(false);
    const [acc, setAcc] = useState(false);
    const [logg, setLogg] = useState(false);

    function resetViews(){
        setNM(false);
        setAcc(false);
        setLogg(false);
    }
    function handleClickNav(click){
        if(isLogged.login){
            switch(click){
                case 'NavMenu':
                    resetViews(); 
                    setNM(!navM);
                break
                case 'Account':
                    resetViews(); 
                    setAcc(!acc);
                break
                default: 
                    resetViews();
                    console.err("Error con el manejo de menus desplegables");
            }
        }else{
            resetViews();
            if(click==='NavMenu'){setNM(!navM);}
            else{setLogg(!logg);}
        }
    }

    return(
        <nav>
            <div className='sec0'>
                <div className='back-menu-icon'>
                    {!navM ?
                        <TfiMenuAlt className='menu-icon' onClick={ ()=> handleClickNav('NavMenu') }/>
                        :
                        <IoClose className='menu-icon' onClick={ ()=> setNM(false) }/>
                    }
                </div>
            </div>
            <div className='sec1'>
                <div className='icons-container' onClick={ ()=> handleClickNav('Account') }>
                <FaUserCircle className='icon' />
                <IoMdArrowDropdown className='icon-arrow'/>
                </div>
            </div>
            <NavMenu visible={navM} isLogged={isLogged}/>
            <AccountDetails visible={acc} isLogged={isLogged}/>
        </nav>
    );
}

export default NavBar;