import { Button } from './button.js';
import { CultistManager } from './resources.js';
import { getRandom } from './utils.js';

//price struct
//pattern is to edit this before each new building gets created
const PRICE = {
  faith: 0,
  money: 0,
  food: 0,
  cultists: 0,
};

class Building {
  constructor(_maxCount, _names) {
    this.level = 0; //level of the object
    this.assignedCultists = 0;
    this.price = {};
    Object.keys(this.price);
    Object.assign(this.price, PRICE);

    this.hidden = true; //make all the buildings up front, and hide the ones that 
    this.names = _names;
    this.currentName = this.names[0];
    this.maxLevel = 4;
    this.amount = 0;
    this.maxCount = _maxCount;
  };

  SetPrice(faith = 0, money = 0, food = 0, cultists = 0) {
    this.price.faith = faith;
    this.price.money = money;
    this.price.food = food;
    this.price.cultists = cultists;
  }

  //increases amount by one
  Buy() {
    this.amount++;
  }

  //upgrades the building and updates its name
  Upgrade() {
    this.level++;
    if (this.level > this.maxLevel) this.level = this.maxLevel;
    this.currentName = this.names[this.level];
    console.log('upgrade ' + this.currentName);
  }

  //assign a cultist from this building
  AssignCultist(amount = 1) {
    this.assignedCultists += amount;
  }

  //remove an assigned cultist
  RemoveCultist(amount = 1) {
    this.assignedCultists -= amount;
    if (this.assignedCultists < 0) this.assignedCultists = 0;
  }

  //update
  Update() {
    if (this.hidden) return;
  }
}

class Church extends Building {
  constructor(maxCount, names) {
    super(maxCount, names);
  }

  //has the passive gain for the building
  Update(cultistManager) {
    super.Update();
    if (this.level > 0) cultistManager.GrowFaith();
  }

  //overide to change cost
  Upgrade() {
    super.Upgrade();
    this.price.faith *= 2; //double faith cost for now //tmp
  }
}

class Hut extends Building {
  constructor(maxCount, names) {
    super(maxCount, names);
    this.occupency = 0;
  }
  Update(cultistManager) {
    super.Update();
    this.occupency = this.amount * 4;
    if (
      this.occupency != cultistManager.amount &&
      this.occupency > cultistManager.amount &&
      this.occupency != 0
    ) {
      //so this doesn't immediatley fill up we can make an upgrade later to improve probabibility
      let rand = getRandom(1, 10000);
      if (rand < 50) {
        rand = getRandom(0, 10);
        let numpeople = 1;
        if (rand < 5 || this.occupency == cultistManager.amount + 1) {
          numpeople = 1;
        } else if (rand < 8 || this.occupency == cultistManager.amount + 2) {
          numpeople = 2;
        } else if (rand < 10 || this.occupency == cultistManager.amount + 3) {
          numpeople = 3;
        } else {
          numpeople = 4;
        }
        for (let index = 0; index < numpeople; index++) {
          cultistManager.AddCultist();
        }
      }
    }
  }
  Upgrade() {
    super.Upgrade();
    this.price.faith *= 2;
    this.maxCount *= 2;
  }
}

class Farm extends Building {
  constructor(maxCount, names) {
    super(maxCount, names);
    this.foodProductionPerCultist = 0.01;
  }

  Update(cultistManager) {
    super.Update();
    cultistManager.GrowFood(this.foodProductionPerCultist);
  }

  //overide to change cost
  Upgrade() {
    super.Upgrade();
    this.price.faith *= 2; //double faith cost for now //tmp
  }
}

class TradingPost extends Building {
  constructor(maxCount, names) {
    super(maxCount, names);
  }
}

class Mine extends Building {
  constructor(maxCount, names) {
    super(maxCount, names);
    this.moneyProductionPerCultist = 0.01;
  }

  Update(cultistManager) {
    super.Update();
    cultistManager.GrowMoney(this.moneyProductionPerCultist);
  }

  //overide to change cost
  Upgrade() {
    super.Upgrade();
    this.price.faith *= 2; //double faith cost for now //tmp
  }
}

const BUILDINGS = {
  Church: new Church(1, ['Shrine', 'Chapel', 'Church', 'Temple', 'Ziggurat']),
  Farm: new Farm(3, [
    'Pen',
    'Farmstead',
    'Farms',
    'Slaughterhouses',
    'Butchery',
  ]),
  TradingPost: new TradingPost(1, [
    'Shrine',
    'Chapel',
    'Church',
    'Temple',
    'ziggurat',
  ]),
  Hut: new Hut(3, [
    'Hut',
    'Home',
    'Apartments',
    'Super Habitation Complex',
    'Container',
  ]),
  Mine: new Mine(3, [
    'Mine',
    'Strip-Mine',
    'Bank',
    'Donation Center',
    'Alms Collection Facility',
  ]),
};

class BuildingManager {
  churchButton;
  hutButton;
  farmButton;
  mineButton;
  constructor(cultistManager, faith, money, food) {
    //additional resources
    this.cultistManager = cultistManager;
    this.faith = faith;
    this.money = money;
    this.food = food;

    //setup price of the buildings
    BUILDINGS.Church.SetPrice(10);
    BUILDINGS.Hut.SetPrice(0, 10, 10);
    BUILDINGS.Farm.SetPrice(100, 100, 100);
    BUILDINGS.Mine.SetPrice(100, 100, 100);

    //setupUI
    this.SetupUI();
  }


  //get and setup the UI elements
  //1 button per building(5)
  //setup onclick to buy, then to upgrade if not hidden

  SetupUI() {

    //church button
    this.churchButton = this.CreateBuyAndUpgradeButtonCustom(BUILDINGS.Church, 'church', () => {

      //added  hut here for the name changing over time
      BUILDINGS.Hut.Upgrade();
      this.hutButton.ChangeName(BUILDINGS.Hut.currentName);
      BUILDINGS.Farm.Upgrade();
      this.farmButton.ChangeName(BUILDINGS.Farm.currentName);
      BUILDINGS.Mine.Upgrade();
      this.mineButton.ChangeName(BUILDINGS.Mine.currentName);
    });
    this.churchButton.ChangeName(BUILDINGS.Church.currentName);
    this.churchPlusButton = this.CreatePlusButton('church', BUILDINGS.Church);
    this.churchMinusButton = this.CreateMinusButton('church', BUILDINGS.Church);

    //hut
    this.hutButton = this.CreateBuyAndUpgradeButton(BUILDINGS.Hut, 'hut');
    this.hutButton.ChangeName(BUILDINGS.Hut.currentName)

    //+ for hut its custom so doesn't use the method
    const hplus = document.querySelector('#hut-button-plus');
    this.hutPlusButton = new Button(hplus, 100, () => {
      console.log('hut plus clicked');
      this.cultistManager.onHutPlusClick();
      console.log(
        'Church Amount: ' +
          BUILDINGS.Church.assignedCultists +
          ' Hut Amount: ' +
          BUILDINGS.Hut.assignedCultists
      );
    });

    //+- for Farm
    this.farmButton = this.CreateBuyAndUpgradeButton(BUILDINGS.Farm, 'farm');
    this.farmButton.ChangeName(BUILDINGS.Farm.currentName);
    this.farmPlusButton = this.CreatePlusButton('farm', BUILDINGS.Farm);
    this.farmMinusButton = this.CreateMinusButton('farm', BUILDINGS.Farm);

    //+- for Mine
    this.mineButton = this.CreateBuyAndUpgradeButton(BUILDINGS.Mine, 'mine');
    this.mineButton.ChangeName(BUILDINGS.Mine.currentName);
    this.minePlusButton = this.CreatePlusButton('mine', BUILDINGS.Mine);
    this.mineMinusButton = this.CreateMinusButton('mine', BUILDINGS.Mine);
  }

  CreateBuyAndUpgradeButton(building, buildingName) {
    let button = new Button(document.querySelector(`#${buildingName}-button`), 5, () => {

      building.hidden = false;
      if (building.maxCount != building.amount) {
        this.SubtractCosts(building.price);
        building.Buy();
      }
    });
    return button;
  }


  //defines custom onclick for the building on top of existing stuff
  CreateBuyAndUpgradeButtonCustom(building, buildingName, onclick) {
    let button = new Button(document.querySelector(`#${buildingName}-button`), 5, () => {

      building.hidden = false;
      if (building.maxCount != building.amount) {
        this.SubtractCosts(building.price);
        building.Buy();
        onclick();
      }
    });
    return button;
  }

  CreatePlusButton(buildingName, building) {
    const bplus = document.querySelector(`#${buildingName}-button-plus`);
    let buildingPlusButton = new Button(bplus, 100, () => {
      console.log(`${buildingName} plus clicked`);
      this.cultistManager.onClickPlusBuilding(building);
      console.log(
        `Farm Amount: ${BUILDINGS.Farm.assignedCultists} Hut Amount: ${BUILDINGS.Hut.assignedCultists} Church Amount: ${BUILDINGS.Church.assignedCultists} Mine Amount: ${BUILDINGS.Mine.assignedCultists}`
      );
    });

    return buildingPlusButton;
  }

  CreateMinusButton(buildingName, building) {
    const bminus = document.querySelector(`#${buildingName}-button-minus`);
    let buildingMinusButton = new Button(bminus, 100, () => {
      console.log(`${buildingName} Minus clicked`);
      this.cultistManager.onClickMinusBuilding(building);
      console.log(
        `Farm Amount: ${BUILDINGS.Farm.assignedCultists} Hut Amount: ${BUILDINGS.Hut.assignedCultists} Church Amount: ${BUILDINGS.Church.assignedCultists} Mine Amount: ${BUILDINGS.Mine.assignedCultists}`
      );
    });

    return buildingMinusButton;
  }

  SubtractCosts(price) {
    this.faith.amount -= price.faith;

    //other resouces lower here
    this.money.amount -= price.money;

    this.food.amount -= price.food;
  }

  Update() {
    //check level of each building and update values based on their level
    //church
    BUILDINGS.Church.Update(this.cultistManager);
    //tradingpost

    //huts
    BUILDINGS.Hut.Update(this.cultistManager);

    //farms
    BUILDINGS.Farm.Update(this.cultistManager);

    //mines
    BUILDINGS.Mine.Update(this.cultistManager);
    this.UIUpdate();
  }

  //updates all the buttons
  UIUpdate() {
    this.CheckBuy();
    this.CheckCultistAmounts();
  }

  //checks the cultists assigned to each building and enables/disables relative buttons
  CheckCultistAmounts() {
    //update the +- of each building as well
    //hut
    let cultistsInBuildings = false;
    for (let key of Object.keys(BUILDINGS)) {
      if (key != 'Hut') {
        if (BUILDINGS[key].assignedCultists > 0) cultistsInBuildings = true;
      }
    }
    //if (cultistsInBuildings) this.hutPlusButton.Enable();
    //else this.hutPlusButton.Disable();

    //church-minus
    if (BUILDINGS.Church.assignedCultists > 0) this.churchMinusButton.Enable();
    else this.churchMinusButton.Disable();

    //farm minus
    if (BUILDINGS.Farm.assignedCultists > 0) this.farmMinusButton.Enable();
    else this.farmMinusButton.Disable();

    //mine minus
    if (BUILDINGS.Mine.assignedCultists > 0) this.mineMinusButton.Enable();
    else this.mineMinusButton.Disable();

    //check hut to determine if other buildings can be added to
    if (BUILDINGS.Hut.assignedCultists != 0) {
      this.churchPlusButton.Enable();
      this.farmPlusButton.Enable();
      this.minePlusButton.Enable();
    } else {
      this.churchPlusButton.Disable();
      this.farmPlusButton.Disable();
      this.minePlusButton.Disable();
    }

    //others
  }
  //check if they can buy it
  //for now ima update every frame
  CheckBuy() {
    //church
    if (BUILDINGS.Church.price.faith > this.faith.amount)
      this.churchButton.Disable();
    else this.churchButton.Enable();

    //hut
    if (
      (BUILDINGS.Hut.price.money > this.money.amount &&
        BUILDINGS.Hut.price.food > this.food.amount) ||
      BUILDINGS.Hut.maxCount == BUILDINGS.Hut.amount
    )
      this.hutButton.Disable();
    else this.hutButton.Enable();
    //farm
    if (
      (BUILDINGS.Farm.price.money > this.money.amount &&
        BUILDINGS.Farm.price.food > this.food.amount &&
        BUILDINGS.Farm.price.faith > this.faith.amount) ||
      BUILDINGS.Hut.maxCount == BUILDINGS.Hut.amount
    )
      this.farmButton.Disable();
    else this.farmButton.Enable();

    //mine
    if (
      (BUILDINGS.Mine.price.money > this.money.amount &&
        BUILDINGS.Mine.price.food > this.food.amount &&
        BUILDINGS.Mine.price.faith > this.faith.amount) ||
      BUILDINGS.Hut.maxCount == BUILDINGS.Hut.amount
    )
      this.mineButton.Disable();
    else this.mineButton.Enable();
    //other buildings
  }

  //Should maybe be refactored into something that can get the level of any building
  CheckChurchLevel() {
    return BUILDINGS.Church.level;
  }
}

export { BuildingManager, BUILDINGS };
