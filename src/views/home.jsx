import { Link } from 'react-router-dom';
import '../styles/views/home.css';

function Home(){
    return(
        <main>
            <Link to="/Menu">
                <img className="main-logo500" src="/images/logos/logo500.webp" alt="logo500" />
            </Link>
        </main>
    );
}

export default Home;