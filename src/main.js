
import * as canvas from "./canvas.js"
import { Button } from './button-class.js'
import * as resources from "./resources.js"

let score = 0;

let faith = new resources.Faith("Faith", 0, score);

const init = () => {
   let scoreOutput = document.querySelector("#score");
   let faithOutput = document.querySelector("#faith");
   let cultdisplay=document.querySelector("#mainroom");
   let GifRunning=false;
   //for now buttons update here
   const onclickScore = () => {
      score++;
      scoreOutput.innerHTML = score;
   };
   const onclickFaith = () => {
      //only update faith if score is more than 1
      if (score > 0) {
         //increase faith by one, but decrease score by one
         faith.amount++;
         score--;
         //update HTML
         scoreOutput.innerHTML = score;
         faithOutput.innerHTML = faith.amount;
      }
   }

   const loop = () => {
      setTimeout(loop, 1000 / 60);
      button.update();
      faithButton.update();
      if(score=='0'){
         document.getElementById("faith-button").src="../assets/heart_static.png";
         GifRunning=false;
      }else{
         
         if(GifRunning==false){
      
         
            document.getElementById("faith-button").src="../assets/heartgif.gif";
            GifRunning=true;
         }else{
            
         }
         
      }
   };
   const onclickCult=()=>{
      document.getElementById("mainroom").style.display="block";
      document.getElementById("testroom").style.display="none";

   }
   const onclickTest=()=>{
      document.getElementById("mainroom").style.display="none";
      document.getElementById("testroom").style.display="block";
   }

   const button = new Button(document.querySelector("#score-button"), 5, onclickScore);
   const faithButton = new Button(document.querySelector("#faith-button"), 5, onclickFaith);
   const culttab=document.querySelector("#cult-tab");
   document.getElementById("cult-tab").addEventListener("click", onclickCult);
   document.getElementById("test").addEventListener("click",onclickTest);
   loop();

   canvas.init();
};

export { init }
