let score = 0;

window.onload = () =>
{
 let scoreOutput = document.querySelector("#score");
 document.querySelector("#score-button").onclick = () =>{
    score ++;
    scoreOutput.innerHTML = score;
 };
};

