import '../../styles/components/nav.css';
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { GiFlowers } from "react-icons/gi";
import { TfiMenuAlt } from "react-icons/tfi";
import { IoClose } from "react-icons/io5";
import { useState } from 'react';
import NavMenu from './navMenu';
import ShoppingCart from './shoppingCart';
import AccountDetails from './accountDetails';
import LogginNavbar from './logginNavbar';



function NavBar({isLogged}){
    const [navM, setNM] = useState(false);
    const [flowC, setFlowC] = useState(false);
    const [shopC, setSC] = useState(false);
    const [acc, setAcc] = useState(false);
    const [logg, setLogg] = useState(false);

    function resetViews(){
        setNM(false);
        setAcc(false);
        setSC(false);
        setFlowC(false);
        setLogg(false);
    }
    function handleClickNav(click){
        if(isLogged.login){
            switch(click){
                case 'NavMenu':
                    resetViews(); 
                    setNM(!navM);
                break
                case 'FlowerColors':
                    resetViews(); 
                    setFlowC(!flowC);
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
            if(click==='FlowerColors'){setFlowC(!flowC);}
            if(click==='ShoppingCart'){resetViews(); setSC(!shopC);}
            if(click==='Account'){setLogg(!logg);}
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
                <div className='icons-container' onClick={ ()=> handleClickNav('FlowerColors') }>
                <GiFlowers className='icon'/>
                <IoMdArrowDropdown className='icon-arrow'/>
                </div>
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
            <img src='images/colores-disponibles.png' alt='img' 
            style={{display: flowC ? 'flex':'none', position: 'absolute', right: 10, top: '80px', 
                border: '.5px solid white', borderRadius: 20, animation: 'Apearup .5s forwards', width: '300px'}}></img>
        </nav>
    );
}

export default NavBar;