import { Link } from 'react-router-dom';
import '../../shared/styles/views/menu.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";
import { BiSolidHelpCircle } from "react-icons/bi";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useState } from 'react';


function Menu({isLogged}){
    const [visible, setVisible] = useState(false);

    return(
        <>

        <NavBar isLogged={isLogged}/>
        <div className='h1-menu'><h1>A.C Flowers Delivery</h1></div>

        <main className='menu-main'>
            <section>
                <Link to="/Ramos" className='menu-opt'>
                    <OptionRect w={200} img="images/menu-sections/bouquets.gif" title="Ramos" className={"trl10 opt-rect"}/>                
                </Link>
                <Link to="/ArmarRamo" className='menu-opt'>
                    <OptionRect w={200} img="images/menu-sections/make-bouquet.gif" title="Armar Ramo" className={"trl-10 opt-rect"}/>
                </Link>
                <Link to={isLogged.login ? "/ConsultarPedido":"/Login"} className='menu-opt'>
                    <OptionRect w={200} img="images/menu-sections/view-order.gif" title="Consultar pedido" className={"trl10 opt-rect"}/>
                </Link>
            </section>
            <section style={{display: 'none'}}>
                <Link to="/">
                <button className='btn-subs'>Subscripciones</button>           
                </Link>
            </section>
        </main>

        <section className='help-section' style={{display: visible ? 'flex':'none'}}>
            <MdCancel className='close-help-sect' onClick={()=> setVisible(false)}/>
            <div>
                <h2>Informacion</h2>
                <a href="https://goodguyscomp.com">©Copyright 2025 Good Guys</a>
            </div>

            <div>
                <h2>Soporte Tecnico</h2>
                <a href="mailto:goodguysmanangment@gmail.com">goodguysmanangment@gmail.com</a>
                <a href="tel:+523317680320">+523317680320</a>
            </div>

            <div>
                <h2>Redes</h2>
                <div className='social-icons'>
                    <a href="https://www.facebook.com/profile.php?id=61564172147714&mibextid=ZbWKwL">
                        <FaFacebook style={{margin: 5}} color='black'/>
                    </a>
                    <a href="https://www.instagram.com/goodguyscomp?igsh=ZHludTA4cmc1aXMw">
                        <FaInstagram style={{margin: 5}} color='black'/>
                    </a>
                </div>
            </div>
        </section>

        <BiSolidHelpCircle className='btn-help' onClick={()=> setVisible(!visible)}/>
        </>
    );
}

export default Menu;