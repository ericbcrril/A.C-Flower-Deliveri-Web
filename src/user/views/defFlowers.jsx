import '../styles/views/defFlowers.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";
import BtnAddCart from "../components/menu/btnAddCart";
import { getItems } from '../../scripts/apis';
import { useState, useEffect } from 'react';

function DefFlowers({isLogged}) {
    const [bouquets, setBouquets] = useState([]);

    useEffect(() => {
        async function getBouquets(){
            try {
                let response = await getItems('bouquets');
                setBouquets(response);   
            } catch (error) {
                alert('Ocurrio un error');
                setBouquets();
            }
        }
        if(bouquets?.length === 0){
            getBouquets();
        }
    }, []);

    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className='h1-menu'>
                <h1>Ramos</h1>
            </div>
            <main className='main-defFlowers'>
                <section className='flowers-section-defFlowers'>
                    {bouquets?.length ?
                         ( bouquets?.map((bouquet) => (
                             <div key={bouquet.id} className="menu-item">
                             <OptionRect w={100} img={bouquet.image} title={bouquet.name} className={"trl10"} desc={bouquet.description}/>
                             <BtnAddCart isLogged={isLogged} bouquet={bouquet}/>
                            </div>
                        )))
                        :
                        <img src='gifs/loadingPage/loading.webp' alt='loading' style={{position: 'fixed',alignSelf: 'center', right: '40%', width: '20%'}}/>
                    }
                
                </section>
            </main>
        </>
    );
}

export default DefFlowers;
