import '../styles/views/login.css';
import { LuUser } from "react-icons/lu";



function Login({isLogged}){
    return(
        <>
            <main className='login-main'>
                <form className='login-form'>
                        <LuUser color='white' size={102}/>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <input type="text" placeholder='Usuario'/>
                            <input type="password" name="" id="" placeholder='Contraseña'/>
                             <hr />
                            <button type='submit'>Iniciar Sesion</button>
                            <button type='button'>Registrate</button>
                        </div>
                       
                </form>
            </main>
        </>
    );
}

export default Login;