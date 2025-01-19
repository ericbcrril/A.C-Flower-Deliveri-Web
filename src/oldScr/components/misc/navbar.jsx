import '../../styles/components/nav.css';
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuSquareMenu } from "react-icons/lu";
import { useState } from 'react';
import NavMenu from './navMenu';
import ShoppingCart from './shoppingCart';
import AccountDetails from './accountDetails';
import LogginNavbar from './logginNavbar';



function NavBar({isLogged}){
    const [navM, setNM] = useState(false);
    const [shopC, setSC] = useState(false);
    const [acc, setAcc] = useState(false);
    const [logg, setLogg] = useState(false);

    function resetViews(){
        setNM(false);
        setAcc(false);
        setSC(false);
        setLogg(false);
    }
    function handleClickNav(click){
        if(isLogged.login){
            switch(click){
                case 'NavMenu':
                    resetViews(); 
                    setNM(!navM);
                break
                case 'ShoppingCart':
                    resetViews(); 
                    setSC(!shopC);
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
                <LuSquareMenu className='icon' onClick={ ()=> handleClickNav('NavMenu') }/>
            </div>
            <div className='sec1'>
                <div className='icons-container' onClick={ ()=> handleClickNav('ShoppingCart') }>
                <FaShoppingCart className='icon'/>
                <IoMdArrowDropdown className='icon-arrow'/>
                </div>
                <div className='icons-container' onClick={ ()=> handleClickNav('Account') }>
                <FaUserCircle className='icon' />
                <IoMdArrowDropdown className='icon-arrow'/>
                </div>
            </div>
            <NavMenu visible={navM} isLogged={isLogged}/>
            <ShoppingCart visible={shopC} isLogged={isLogged}/>
            <AccountDetails visible={acc} isLogged={isLogged}/>
            <LogginNavbar visible={logg}/>
        </nav>
    );
}

export default NavBar;