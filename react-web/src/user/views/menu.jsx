import { Link } from 'react-router-dom';
import '../../shared/styles/views/menu.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";
import { BiSolidHelpCircle } from "react-icons/bi";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from 'react';
import React from 'react';


function Menu({isLogged}){
    const [visible, setVisible] = useState(false);

    const [winW, setWinW] = useState(window.innerWidth);
    const [winH, setWinH] = useState(window.innerHeight);

      useEffect(() => {
    const handleResizeW = () => setWinW(window.innerWidth);
    const handleResizeH = () => setWinH(window.innerHeight);
    window.addEventListener('resize', handleResizeW);
    window.addEventListener('resize', handleResizeH);
    return () => {
      window.removeEventListener('resize', handleResizeW);
      window.removeEventListener('resize', handleResizeH);
    };
  }, [winW, winH]);
    
        let widthForOpt = 200;
    
        if(winW > 450 && winW < 1024 && winH > 720){//Tablets Port
            widthForOpt = 200;
        }    
        if(winW < 450){//Movil Port
            widthForOpt = 150;
        }    
        if(winH < 450 && winW > 650 && winW < 950){//Movil Land
            widthForOpt = 200;
        }    

    return(
        <>

        <NavBar isLogged={isLogged}/>
        <div className='h1-menu'><h1>A.C Flowers Delivery</h1></div>

        <main className='menu-main'>
            <section className='opts-container-menu'>
                <Link to="/Ramos" className='menu-opt'>
                    <OptionRect w={widthForOpt} img="images/menu-sections/bouquets.gif" title="Ramos" className={"trl10 opt-rect"}/>                
                </Link>
                <Link to="/ArmarRamo" className='menu-opt'>
                    <OptionRect w={widthForOpt} img="images/menu-sections/make-bouquet.gif" title="Armar Ramo" className={"trl-10 opt-rect"}/>
                </Link>
                <Link to={isLogged.login ? "/ConsultarPedido":"/Login"} className='menu-opt'>
                    <OptionRect w={widthForOpt} img="images/menu-sections/view-order.gif" title="Consultar pedido" className={"trl10 opt-rect"}/>
                </Link>
            </section>
            <section style={{display: 'none'}}>
                <Link to="/">
                <button className='btn-subs'>Subscripciones</button>           
                </Link>
            </section>
        </main>

        <section className={`help-section ${visible ? 'visible' : 'hidden'}`}>
    <button className='close-help-sect' onClick={() => setVisible(false)} aria-label="Cerrar ayuda">
        <MdCancel />
    </button>
    <div>
        <h2>Información</h2>
        <a href="https://goodguyscomp.com">©Copyright 2025 Good Guys</a>
    </div>
    <div>
        <h2>Soporte Técnico</h2>
        <a href="mailto:acflowersdelivery@gmail.com">acflowersdelivery@gmail.com</a><br />
        <a href="tel:+523314099572">+52 33 1409 9572</a>
    </div>
    <div>
        <h2>Redes</h2>
        <div className='social-icons'>
            <a href="https://www.facebook.com/profile.php?id=61572579996738" aria-label="Facebook">
                <FaFacebook />
            </a>
            <a href="https://www.instagram.com/acflowersdelivery/" aria-label="Instagram">
                <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@acflowersdeliverygdl?lang=es" aria-label="TikTok">
                <FaTiktok />
            </a>
        </div>
    </div>
</section>


        <BiSolidHelpCircle className='btn-help' onClick={()=> setVisible(!visible)}/>
        </>
    );
}

export default Menu;