import '../styles/views/defFlowers.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";
import BtnAddCart from "../components/menu/btnAddCart";
import { getItems } from '../../scripts/apis';
import { useState, useEffect, useRef } from 'react';

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

    const dialogBouquet = useRef(null);
    const [bouquetInfo, setBouquetInfo] = useState([]);

    function openDialog(data){
        setBouquetInfo(data);
        dialogBouquet.current.showModal();
    }

    function closeDialog(){
        dialogBouquet.current.close();
    }

    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className='h1-menu'>
                <h1>Ramos</h1>
            </div>
            <main className='main-defFlowers'>
                <section className='flowers-section-defFlowers'>
                    {bouquets?.length ?
                         ( bouquets?.map((bouquet, index) => (
                            <div key={index} className="menu-item">
                                <div onClick={()=>openDialog(bouquet)}>
                                    <OptionRect  w={100} img={bouquet.image} p={bouquet.name} className={"trl10"} desc={bouquet.name}/>
                                </div>
                                <BtnAddCart isLogged={isLogged} bouquet={bouquet}/>
                            </div>
                        )))
                        :
                        <img src='gifs/loadingPage/loading.webp' alt='loading' style={{position: 'fixed',alignSelf: 'center', right: '40%', width: '20%'}}/>
                    }
                
                </section>
            </main>

            <dialog ref={dialogBouquet}>
                <section>
                    <img src={bouquetInfo.image} alt="bouquet" style={{width: '150px'}}/>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <h4 style={{margin: '5px'}}>{bouquetInfo.name}</h4>
                    <p style={{margin: '10px', maxWidth: '320px', hyphens: 'auto', wordWrap: 'break-word', overflowWrap: 'break-word'}}>{bouquetInfo.description}</p>
                    <p style={{margin: '5px'}}>${bouquetInfo.price} <strong>MXN</strong></p>
                    </div>
                    <button onClick={()=>closeDialog()}>OK</button>
                </section>
            </dialog>
        </>
    );
}

export default DefFlowers;
