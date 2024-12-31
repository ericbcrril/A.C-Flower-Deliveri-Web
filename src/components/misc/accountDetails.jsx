import '../../styles/components/accountDetails.css';


function AccountDetails({visible}){
    return(
        <section className='accountDetails' style={{display: visible?"flex":"none"}}>
            <p>Usuario 0</p>
            <button>Editar</button>
            <button>Salir</button>
        </section>
    );
}

export default AccountDetails;