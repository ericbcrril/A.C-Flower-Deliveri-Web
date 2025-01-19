import '../styles/views/loadPage.css';

function LoadPage(){
    return(
        <main className='main-loadPage'>
            <div className='load-div0'>
                <img src="gifs/loadingPage/loading.webp" alt="" />
            </div>
            <div className='load-div1'>
                <img src="gifs/loadingPage/flower0.gif" alt="" style={{bottom: '-20%'}}/>
                <img src="gifs/loadingPage/flower1.gif" alt="" style={{bottom: '-15%'}}/>
                <img src="gifs/loadingPage/flower2.gif" alt="" />
            </div>
            
        </main>
    );
}

export default LoadPage;