import '../styles/views/defFlowers.css';
import NavBar from "../components/misc/navbar";
import OptionRect from "../components/menu/optionRect";
import BtnAddCart from "../components/menu/btnAddCart";

function Menu() {
    function DrawItems() {
        const items = [];
        for (let i = 0; i < 22; i++) {
            items.push(
                <div key={i} className="menu-item">
                    <OptionRect w={100} img="width_150.jpeg" title={`Item ${i + 1}`} className={"trl10"} />
                    <BtnAddCart />
                </div>
            );
        }
        return <>{items}</>;
    }

    return (
        <>
            <NavBar />
            <div className='h1-menu'>
                <h1>Ramos Predeterminados</h1>
            </div>
            <main className='main-defFlowers'>
                <section className='flowers-section-defFlowers'>
                    <DrawItems />
                </section>
            </main>
        </>
    );
}

export default Menu;
