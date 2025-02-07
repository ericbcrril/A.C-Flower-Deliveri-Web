import { FcOk, FcInfo } from "react-icons/fc";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import '../styles/views/handlePay.css';
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../scripts/response";

function HandlePay(){
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    const [paymentFail, setPaymentFail] = useState(true);
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const orderData = JSON.parse(localStorage.getItem('orderData'));

    // Evitar llamadas duplicadas con un flag
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!sessionId || hasFetched.current) {
            setPaymentSuccess(false);
            return;
        }

        hasFetched.current = true; // Marcar como ejecutado

        const verifyPayment = async () => {
            try {
                const response = await fetch(`${BASE_URL}/stripe/paymentStatus/${sessionId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: orderData ? JSON.stringify({ orderData }) : null,
                });

                const data = await response.json();
                
                setPaymentSuccess(data.success);
                setPaymentFail(data.success);
                localStorage.removeItem('orderData');
            } catch (error) {
                setPaymentSuccess(false);
            }
        };

        verifyPayment();
    }, [sessionId]); // Dependencia explícita

    return (
        <main style={{display: 'flex', justifyContent: "center", alignItems: "center", height: '100dvh'}}>
                {paymentSuccess ? (
                    <div style={{display: !paymentFail ? 'none':'' }} className="handlePay-container-message">
                        <FcOk size={48}/>
                        <p>Puedes ver el estado de tu pedido en <Link to='/ConsultarPedido'>Consultar Pedido</Link></p>
                        <Link to='/Menu'>
                            <button>OK</button>
                        </Link>
                    </div>
                ) : (
                    <div style={{display: !paymentFail ? 'none':'' }} className="handlePay-container-message">
                        <FcInfo size={48} color='red'/>
                        <p>Verificando tu pago...</p>
                    </div>
                )}
                {!paymentFail && (
                    <div className="handlePay-container-message">
                        <VscError size={48} color='red'/>
                        <p>Algo salió mal, inténtalo de nuevo más tarde</p>
                        <Link to='/Menu'>
                            <button>OK</button>
                        </Link>
                    </div>
                )}
        </main>
    );
}

export default HandlePay;
