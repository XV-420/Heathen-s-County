let ctx;

const init = () =>{  

    let canvas = document.querySelector("canvas");

    ctx = canvas.getContext("2d");

    // C - all fill operations are now in red
    ctx.fillStyle = "green";

    // D - fill a rectangle with the current fill color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}


export {ctx, init}
