import '../../styles/components/optionRect.css';

function OptionRect({w, h, img, title, p, desc, className}){
    return(
        <section className={'option-rec '+className} 
                 title={desc}
                 style={{width: w+"px", height: h ? h+"px": w+w/4+"px", 
                            margin: w/5+"px", padding: w/5+"px",
                            fontSize: w/10}}>
            <div>
                <img src={img} alt={img} height={w} width={w}/>                
            </div>
            <div>
                <h3>{title ? title:""}</h3>
                <p>{p}</p>
            </div>
        </section>
    );
}

export default OptionRect;