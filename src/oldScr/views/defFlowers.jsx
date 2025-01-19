import '../styles/views/defFlowers.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";
import BtnAddCart from "../components/menu/btnAddCart";

function DefFlowers({isLogged}) {
    const bouquets = [
        { id: 1, title: "Romance Clásico", description: "Rosas rojas frescas con un toque elegante.", img: "width_150.jpeg" },
        { id: 2, title: "Delicia Tropical", description: "Colores vibrantes que evocan el trópico.", img: "width_150.jpeg" },
        { id: 3, title: "Blanco Puro", description: "Un ramo de flores blancas para momentos especiales.", img: "width_150.jpeg" },
        { id: 4, title: "Amor Pastel", description: "Tonos pastel perfectos para ocasiones tiernas.", img: "width_150.jpeg" },
        { id: 5, title: "Alegría Primaveral", description: "Flores multicolores que transmiten felicidad.", img: "width_150.jpeg" },
        { id: 6, title: "Elegancia Nocturna", description: "Un diseño sofisticado en tonos oscuros.", img: "width_150.jpeg" },
        { id: 7, title: "Otoño Dorado", description: "Hojas y flores cálidas como el otoño.", img: "width_150.jpeg" },
        { id: 8, title: "Fantasía Floral", description: "Una mezcla exótica que sorprende.", img: "width_150.jpeg" },
        { id: 9, title: "Rosado Encanto", description: "Rosas y flores en tonos rosados.", img: "width_150.jpeg" },
        { id: 10, title: "Amanecer Radiante", description: "Un ramo vibrante con toques amarillos.", img: "width_150.jpeg" },
        { id: 11, title: "Fragancia Dulce", description: "Flores aromáticas para cautivar los sentidos.", img: "width_150.jpeg" },
        { id: 12, title: "Mágico Atardecer", description: "Colores cálidos inspirados en el crepúsculo.", img: "width_150.jpeg" },
        { id: 13, title: "Jardín Encantado", description: "Un ramo floral como salido de un cuento.", img: "width_150.jpeg" },
        { id: 14, title: "Verano Brillante", description: "Colores vivos y frescura veraniega.", img: "width_150.jpeg" },
        { id: 15, title: "Sueño Blanco", description: "Elegancia en blanco puro.", img: "width_150.jpeg" },
        { id: 16, title: "Toque de Lavanda", description: "Lavandas y flores lilas para calmar el alma.", img: "width_150.jpeg" },
        { id: 17, title: "Vibras del Caribe", description: "Un estallido de colores tropicales.", img: "width_150.jpeg" },
        { id: 18, title: "Clásico Rojo", description: "Un ramo icónico de rosas rojas.", img: "width_150.jpeg" },
        { id: 19, title: "Primavera en Rosa", description: "Flores rosadas para alegrar cualquier día.", img: "width_150.jpeg" },
        { id: 20, title: "Euforia Amarilla", description: "Un ramo que ilumina con su energía amarilla.", img: "width_150.jpeg" }
    ];

    function DrawItems() {
        return (
            <>
                {bouquets.map((bouquet) => (
                    <div key={bouquet.id} className="menu-item">
                        <OptionRect w={100} img={bouquet.img} title={bouquet.title} className={"trl10"} desc={bouquet.description}/>
                        <BtnAddCart isLogged={isLogged}/>
                    </div>
                ))}
            </>
        );
    }

    return (
        <>
            <NavBar isLogged={isLogged}/>
            <div className='h1-menu'>
                <h1>Ramos Ramos</h1>
            </div>
            <main className='main-defFlowers'>
                <section className='flowers-section-defFlowers'>
                    <DrawItems />
                </section>
            </main>
        </>
    );
}

export default DefFlowers;
