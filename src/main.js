
import * as canvas from "./canvas.js"
import { Button } from './button.js'
import * as resources from "./resources.js"

let score = 0;

let faith = new resources.Faith("Faith", 0, score);
let cultistManager = new resources.CultistManager("Culstists", faith);

const init = () => {
   let scoreOutput = document.querySelector("#score");
   let faithOutput = document.querySelector("#faith");
   let cultdisplay=document.querySelector("#mainroom");
   let Shopdisplay=document.querySelector('#testroom');
   let shopTab=document.querySelector('#test-tab');
   let culttab=document.querySelector("#cult-tab");
   let GifRunning=false;
   let imgheart=document.querySelector('.hvr-pulse-grow');
   //for now buttons update here
   const onclickScore = () => {
      // score++;
      // scoreOutput.innerHTML = score;
      cultistManager.AddCultist();
      scoreOutput.innerHTML = cultistManager.amount;
   };

   const onclickFaith = () => {
      //sacrifices a cultist
      cultistManager.SacrificeRandomCultist();

      //increase faith by one, but decrease score by one
      // faith.amount++;
      // score--;
      // //update HTML
      scoreOutput.innerHTML = cultistManager.amount;
      faithOutput.innerHTML = faith.amount;
   }

   const loop = () => {
      setTimeout(loop, 1000 / 60);
      button.update();
      faithButton.update();
      if(score=='0'){
         imgheart.src="./assets/heart_static.png";
         GifRunning=false;
      }else{
         
         if(GifRunning==false){
      
         
            imgheart.src="./assets/heartgif.gif";
            GifRunning=true;
         }else{
            
         }
         
      }
   };
   const onclickCult=()=>{
      cultdisplay.style.display="block";
      Shopdisplay.style.display="none";

   }
   const onclickTest=()=>{
      cultdisplay.style.display="none";
      Shopdisplay.style.display="block";
   }

   const button = new Button(document.querySelector("#score-button"), 5, onclickScore);
   const faithButton = new Button(document.querySelector("#faith-button"), 5, onclickFaith);
   
   culttab.addEventListener("click", onclickCult);
   shopTab.addEventListener("click",onclickTest);
   loop();

   canvas.init();
};

export { init }
