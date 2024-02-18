
import * as canvas from "./canvas.js"
import { Button } from './button.js'
import * as resources from "./resources.js"
import * as buildings from "./buildings.js"

let score = 0;

let faith = new resources.Faith("Faith", 0, score);
let money=new resources.Money("Money",3000,1);
let food =new resources.Food("Food",3000,1);
let cultistManager = new resources.CultistManager("Culstists", faith);


//last as it takes in faith and cultist and other resources in the future
const buildingManager = new buildings.BuildingManager(cultistManager, faith,money,food);

const init = () => {
   let scoreOutput = document.querySelector("#score");
   let faithOutput = document.querySelector("#faith");
   let foodOutput = document.querySelector("#food");
   let moneyOutput = document.querySelector("#money");
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
   }
   const onclickPray =()=>{
      //increase pray by 1
      cultistManager.AddFaith();
   }

   const loop = () => {
      setTimeout(loop, 1000 / 60);
      button.update();
      faithButton.update();
      buildingManager.Update();
      prayButton.update();
      faithOutput.innerHTML = Math.round(faith.amount);
      scoreOutput.innerHTML=cultistManager.amount;
      foodOutput.innerHTML=Math.round(food.amount);
      moneyOutput.innerHTML=Math.round(money.amount);
      if(cultistManager.amount==0){
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
   const prayButton=new Button(document.querySelector("#pray-button"),5,onclickPray)
   culttab.addEventListener("click", onclickCult);
   shopTab.addEventListener("click",onclickTest);
   loop();

   canvas.init();
};

export { init }
