import * as canvas from './canvas.js';
import { Button } from './button.js';
import * as resources from './resources.js';
import * as buildings from './buildings.js';

let faith = new resources.Faith('Faith', 0, 1);
let money = new resources.Money('Money', 10, 1);
let food = new resources.Food('Food', 10, 1);
let cultistManager = new resources.CultistManager(
  'Cultists',
  faith,
  food,
  money
);

//last as it takes in faith and cultist and other resources in the future
const buildingManager = new buildings.BuildingManager(
  cultistManager,
  faith,
  money,
  food
);

const init = () => {
  let cultistOutput = document.querySelector('#cultists');
  let faithOutput = document.querySelector('#faith');
  let foodOutput = document.querySelector('#food');
  let moneyOutput = document.querySelector('#money');
  let faithPerSecOutput = document.querySelector('#faith-per-sec');
  let foodPerSecOutput = document.querySelector('#food-per-sec');
  let moneyPerSecOutput = document.querySelector('#money-per-sec');
  let cultdisplay = document.querySelector('#mainroom');
  let Shopdisplay = document.querySelector('#testroom');
  let shopTab = document.querySelector('#shop-tab');
  let culttab = document.querySelector('#cult-tab');
  let GifRunning = false;
  let imgheart = document.querySelector('.hvr-pulse-grow');
  //for now buttons update here
  const onclickGather = () => {
    let chance = Math.random(0, 1) * 100;
    if (chance < 48) {
      money.amount += 10;
      moneyOutput.innerHTML = money.amount;
    } else if (chance < 96) {
      food.amount += 10;
      //foodOutputt.innerHTML = food.amount;
    } else if (buildingManager.CheckHutOccupancy() < cultistManager.amount) {
      cultistManager.AddCultist();
      cultistOutput.innerHTML = cultistManager.amount;
    }
    else {
      money.amount += 5;
      moneyOutput.innerHTML = money.amount;
      food.amount += 5;
    }
  };

  const onclickFaith = () => {
    //sacrifices a cultist
    cultistManager.SacrificeRandomCultist();

    //increase faith by one, but decrease score by one
    // faith.amount++;
    // score--;
    // //update HTML
    scoreOutput.innerHTML = cultistManager.amount;
  };

  const onclickPray = () => {
    faith.amount++;
  };


  let elapsedTime = 0;
  let prevTime = 0;
  const loop = () => {
    setTimeout(loop, 1000 / 60);
    let time = Date.now();
    time = time / 1000;
    elapsedTime += time - prevTime;
    prevTime = time;
    //TODO: move this out of main when refactoring
    //Unlock Recruit when church is level 1 or higher
    if (buildingManager.CheckChurchLevel() >= 1) {
      //TODO: Do Enable and Update do the same thing?
      //recruitButton.Enable();
      recruitButton.update();
    } else {
      recruitButton.Disable();
    }
    //TODO: Reconsider unlock levels
    //unlock sacrifice when church is level 3 or higher
    if (buildingManager.CheckChurchLevel() >= 3) {
      sacrificeButton.update();
    } else {
      sacrificeButton.Disable();
    }
    prayButton.update();
    buildingManager.UIUpdate();

    if (elapsedTime > 1) {
      elapsedTime = 0;
      buildingManager.Update();
      cultistManager.Update();
      //update the amount per sec
      faithPerSecOutput.title = `Faith Per Second: ${faith.amountPerSec}`;
      moneyPerSecOutput.title = `Money Per Second: ${money.amountPerSec}`;
      foodPerSecOutput.title = `Food Per Second: ${food.amountPerSec}`;

      //set amount per sec to zero
      faith.amountPerSec = 0;
      money.amountPerSec = 0;
      food.amountPerSec = 0;
    }

    faithOutput.innerHTML = Math.round(faith.amount);
    cultistOutput.innerHTML = `${cultistManager.amount}/${buildingManager.CheckHutOccupancy()}`;
    foodOutput.innerHTML = Math.round(food.amount);
    moneyOutput.innerHTML = Math.round(money.amount);

    if (cultistManager.amount == 0) {
      //imgheart.src = './assets/heart_static.png';
      GifRunning = false;
    } else {
      if (GifRunning == false) {
        //imgheart.src = './assets/heartgif.gif';
        GifRunning = true;
      } else {
      }
    }

  };
  const onclickCult = () => {
    cultdisplay.style.display = 'block';
    Shopdisplay.style.display = 'none';
  };
  const onclickTest = () => {
    cultdisplay.style.display = 'none';
    Shopdisplay.style.display = 'block';
  };

  const recruitButton = new Button(
    document.querySelector('#gather-button'),
    10,
    onclickGather
  );
  const sacrificeButton = new Button(
    document.querySelector('#sacrifice-button'),
    5,
    onclickFaith
  );
  const prayButton = new Button(
    document.querySelector('#pray-button'),
    500,
    onclickPray
  );

  culttab.addEventListener('click', onclickCult);
  shopTab.addEventListener('click', onclickTest);
  loop();

  canvas.init();
};

export { init };
