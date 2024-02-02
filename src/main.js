let score = 0;

const init = () =>
{
 let scoreOutput = document.querySelector("#score");
 document.querySelector("#score-button").onclick = () =>{
    score ++;
    scoreOutput.innerHTML = score;
 };
};

export{init}