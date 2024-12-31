import '../../styles/components/optionRect.css';

function OptionRect({w, h, img, title, desc, className}){
    return(
        <section className={'option-rec '+className} 
            style={{width: w+"px", height: h ? h+"px": w+w/4+"px", 
                    margin: w/5+"px", padding: w/5+"px",
                    fontSize: w/10}}>
            <div>
                <img src={img} alt={img} height={w} width={w}/>                
            </div>
            <div>
                <h3>{title ? title:"Title"}</h3>
                <p style={{display: desc?"auto":"none"}}>{desc}</p>
            </div>
        </section>
    );
}

export default OptionRect;