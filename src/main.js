
import * as canvas from "./canvas.js"
import { Button } from './button-class.js'

let score = 0;

const init = () => {
   let scoreOutput = document.querySelector("#score");
   
   const onclickScore = () => {
      score++;
      scoreOutput.innerHTML = score;
   };

   const loop = () =>{
      setTimeout(loop, 1000/60);
      button.update();
      button2.update();
   };

   const button = new Button(document.querySelector("#score-button"), .5, onclickScore);
   const button2 = new Button(document.querySelector("#score-button2"), 2, onclickScore)

   loop();

   canvas.init();
};

export { init }
