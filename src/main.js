import { Button } from './button-class.js'
let score = 0;

window.onload = () => {

   const onclickScore = () => {
      score++;
      scoreOutput.innerHTML = score;
   };

   const loop = () =>{
      setTimeout(loop, 1000/60);
      button.update();
      button2.update();
   };

   let scoreOutput = document.querySelector("#score");
   const button = new Button(document.querySelector("#score-button"), .5, onclickScore);
   const button2 = new Button(document.querySelector("#score-button2"), 2, onclickScore)

   loop();

};






