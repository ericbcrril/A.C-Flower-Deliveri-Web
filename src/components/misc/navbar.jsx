import '../../styles/components/nav.css';
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuSquareMenu } from "react-icons/lu";
import { useState } from 'react';
import NavMenu from './navMenu';
import ShoppingCart from './shoppingCart';
import AccountDetails from './accountDetails';



function NavBar(){
    const [navM, setNM] = useState(false);
    const [shopC, setSC] = useState(false);
    const [acc, setAcc] = useState(false);
    function handlesetM(){
        setNM(!navM);
        setAcc(false);
        setSC(false);
    }
    function handlesetSC(){
        setNM(false);
        setAcc(false);
        setSC(!shopC);
    }
    function handlesetAcc(){
        setNM(false);
        setAcc(!acc);
        setSC(false);
    }

    return(
        <nav>
            <div className='sec0'>
                <LuSquareMenu className='icon' onClick={ ()=> handlesetM() }/>
            </div>
            <div className='sec1'>
                <div className='icons-container' onClick={ ()=> handlesetSC() }>
                <FaShoppingCart className='icon'/>
                <IoMdArrowDropdown className='icon-arrow'/>
                </div>

                <div className='icons-container' onClick={ ()=> handlesetAcc() }>
                <FaUserCircle className='icon' />
                <IoMdArrowDropdown className='icon-arrow'/>
                </div>
            </div>
            <NavMenu visible={navM}/>
            <ShoppingCart visible={shopC}/>
            <AccountDetails visible={acc}/>
        </nav>
    );
}

export default NavBar;