
import * as canvas from "./canvas.js"
import { Button } from './button.js'
import * as resources from "./resources.js"
import * as buildings from "./buildings.js"

let faith = new resources.Faith("Faith", 0, 1);
let money=new resources.Money("Money",3000,1);
let food =new resources.Food("Food",3000,1);
let cultistManager = new resources.CultistManager("Cultists", faith, food);


//last as it takes in faith and cultist and other resources in the future
const buildingManager = new buildings.BuildingManager(cultistManager, faith,money,food);

const init = () => {
   let scoreOutput = document.querySelector("#cultists");
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

   const onclickPray = () => {
      faith.amount++;
   }

   const loop = () => {
      setTimeout(loop, 1000 / 60);

      //TODO: move this out of main when refactoring
      //Unlock Recruit when church is level 1 or higher
      if (buildingManager.CheckChurchLevel() >= 1) {
         //TODO: Do Enable and Update do the same thing?
         //recruitButton.Enable();
         recruitButton.update();
      }
      else {
         recruitButton.Disable();
      }
      //TODO: Reconsider unlock levels
      //unlock sacrifice when church is level 3 or higher
      if (buildingManager.CheckChurchLevel() >= 3) {
         sacrificeButton.update();
      }
      else {
         sacrificeButton.Disable();
      }

      prayButton.update();
      buildingManager.Update();

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
   const onclickCult = () => {
      cultdisplay.style.display = "block";
      Shopdisplay.style.display = "none";

   }
   const onclickTest = () => {
      cultdisplay.style.display = "none";
      Shopdisplay.style.display = "block";
   }

   const recruitButton = new Button(document.querySelector("#recruit-button"), 1, onclickScore);
   const sacrificeButton = new Button(document.querySelector("#faith-button"), 5, onclickFaith);
   const prayButton = new Button(document.querySelector("#pray-button"), 5, onclickPray);

   culttab.addEventListener("click", onclickCult);
   shopTab.addEventListener("click", onclickTest);
   loop();

   canvas.init();
};

export { init }
