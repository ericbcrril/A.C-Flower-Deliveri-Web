
function LoadLetters({size = 14, direction = 'row'}){

    return(
        <div class="animated-text" style={{fontSize: size, flexDirection: direction}}>
                <span>C</span>
                <span>A</span>
                <span>R</span>
                <span>G</span>
                <span>A</span>
                <span>N</span>
                <span>D</span>
                <span>O</span>
                <span>.</span>
                <span>.</span>
                <span>.</span>
        </div>
    );
}

export default LoadLetters;