import { Link } from 'react-router-dom';
import '../../shared/styles/views/home.css';
import '../styles/html-grandiant.css';

function Home({isLogged}){
    //alert("Bienvenido ", isLogged?.user);
    return(
        <main className='main-home'>
            <Link to="/Menu">
                <img className="main-logo500" src="GG (3).webp" alt="logo500" />
            </Link>
        </main>
    );
}

export default Home;