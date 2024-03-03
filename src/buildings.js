import { Button } from './button.js';
import { getRandom } from './utils.js';
import { farmDescriptions, churchDescriptions, mineDescriptions } from './loader.js';

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
    this.priceScaler = 20;
  }

  SetPrice(faith = 0, money = 0, food = 0, cultists = 0) {
    this.price.faith = faith;
    this.price.money = money;
    this.price.food = food;
    this.price.cultists = cultists;
  }

  //checks the price vs the amount of the resouce they have
  CheckPrice(faith, food, money) {
    if (
      this.price.faith > faith.amount ||
      this.price.money > money.amount ||
      this.price.food > food.amount ||
      this.maxCount == this.amount
    ) {
      return true;
    }

    return false;
  }

  //increases amount by one
  Buy(church = false) {
    if(!church)
      this.amount++;
    this.price.faith *= this.priceScaler;
    this.price.food *= this.priceScaler;
    this.price.money *= this.priceScaler;
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
  }

  Buy() {
    super.Buy(true);

  }
}

class Hut extends Building {
  constructor(maxCount, names) {
    super(maxCount, names);
    this.occupency = 0;
  }
  Update(cultistManager) {
    super.Update();
    console.log(this.amount);
    this.occupency = this.amount * 4;
    if (
      this.occupency != cultistManager.amount &&
      this.occupency > cultistManager.amount &&
      this.occupency != 0
    ) {
      //so this doesn't immediatley fill up we can make an upgrade later to improve probabibility
      let rand = getRandom(1, 500);
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
    this.maxCount *= 2;
  }
}

class Farm extends Building {
  constructor(maxCount, names) {
    super(maxCount, names);
    this.foodProductionPerCultist = 0.1;
  }

  Update(cultistManager) {
    super.Update();
    cultistManager.GrowFood(this.foodProductionPerCultist);
  }
  Buy() {
    super.Buy();
    this.foodProductionPerCultist *= 2;
  }
  //overide to change cost
  Upgrade() {
    super.Upgrade();
    this.foodProductionPerCultist += 0.1;
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
    this.moneyProductionPerCultist = 0.5;
  }

  Update(cultistManager) {
    super.Update();
    cultistManager.GrowMoney(this.moneyProductionPerCultist);
  }

  Buy(){
    super.Buy();
    this.moneyProductionPerCultist *=2;
  }
  //overide to change cost
  Upgrade() {
    super.Upgrade();
    this.moneyProductionPerCultist += .1;
  }
}

const BUILDINGS = {
  Church: new Church(5, ['Shrine', 'Chapel', 'Church', 'Temple', 'Ziggurat']),
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
    BUILDINGS.Church.SetPrice(10, 0, 0);
    BUILDINGS.Hut.SetPrice(0, 10, 10);
    BUILDINGS.Farm.SetPrice(0, 100, 100);
    BUILDINGS.Mine.SetPrice(0, 100, 100);

    //setupUI
    this.SetupUI();
  }

  //get and setup the UI elements
  //1 button per building(5)
  //setup onclick to buy, then to upgrade if not hidden

  SetupUI() {
    //tracks current church level for description changing
    let churchLevel = 0;

    //church button
    this.churchButton = this.CreateBuyAndUpgradeButtonCustom(BUILDINGS.Church, 'church', () => {
      //upgrades church description tier
      churchLevel++;
      //added  hut here for the name changing over time
      BUILDINGS.Hut.Upgrade();
      this.hutButton.ChangeName(BUILDINGS.Hut.currentName);
      BUILDINGS.Farm.Upgrade();
      this.farmButton.ChangeName(BUILDINGS.Farm.currentName);
      document.querySelector("#farm-button").title = farmDescriptions[churchLevel];
      BUILDINGS.Mine.Upgrade();
      this.mineButton.ChangeName(BUILDINGS.Mine.currentName);
      document.querySelector("#mine-button").title = mineDescriptions[churchLevel];
      BUILDINGS.Church.Upgrade();
      this.churchButton.ChangeName(BUILDINGS.Church.currentName);
      document.querySelector("#church-button").title = churchDescriptions[churchLevel];
    });
    this.churchButton.ChangeName(BUILDINGS.Church.currentName);
    this.churchPlusButton = this.CreatePlusButton('church', BUILDINGS.Church);
    this.churchMinusButton = this.CreateMinusButton('church', BUILDINGS.Church);

    //hut
    this.hutButton = this.CreateBuyAndUpgradeButton(BUILDINGS.Hut, 'hut');
    this.hutButton.ChangeName(BUILDINGS.Hut.currentName);

    /*
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
    });*/

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
    let button = new Button(
      document.querySelector(`#${buildingName}-button`),
      5,
      () => {
        building.hidden = false;
        if (building.maxCount != building.amount) {
          this.SubtractCosts(building.price);
          building.Buy();
        }
      }
    );
    return button;
  }

  //defines custom onclick for the building on top of existing stuff
  CreateBuyAndUpgradeButtonCustom(building, buildingName, onclick) {
    let button = new Button(
      document.querySelector(`#${buildingName}-button`),
      5,
      () => {
        building.hidden = false;
        if (building.maxCount != building.amount) {
          this.SubtractCosts(building.price);
          building.Buy();
          onclick();
        }
      }
    );
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

    //huts
    BUILDINGS.Hut.Update(this.cultistManager);

    //farms
    BUILDINGS.Farm.Update(this.cultistManager);

    //mines
    BUILDINGS.Mine.Update(this.cultistManager);
  }

  //updates all the buttons
  UIUpdate() {
    this.CheckLevels();
    this.CheckBuy();
    this.CheckCultistAmounts();
    this.CheckHidden();
  }

  //checks the cultists assigned to each building and enables/disables relative buttons
  CheckCultistAmounts() {
    //update the +- of each building as well
    //hut
    /*
    let cultistsInBuildings = false;
    for (let key of Object.keys(BUILDINGS)) {
      if (key != 'Hut') {
        if (BUILDINGS[key].assignedCultists > 0) cultistsInBuildings = true;
      }
    }
    if (cultistsInBuildings) this.hutPlusButton.Enable();
    else this.hutPlusButton.Disable();*/

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
    document.querySelector('#church-amount').textContent =
      BUILDINGS.Church.assignedCultists;
    document.querySelector('#farm-amount').textContent =
      BUILDINGS.Farm.assignedCultists;
    document.querySelector('#mine-amount').textContent =
      BUILDINGS.Mine.assignedCultists;
    document.querySelector('#cultist-amount').textContent =
      BUILDINGS.Hut.assignedCultists;
  }

  //check if they can buy it
  //for now ima update every frame
  CheckBuy() {
    //church
    let shophighlight = false;
    if (BUILDINGS.Church.CheckPrice(this.faith, this.food, this.money))
      this.churchButton.Disable();
    else {
      this.churchButton.Enable();

      shophighlight = true;
    }

    //hut
    if (BUILDINGS.Hut.CheckPrice(this.faith, this.food, this.money))
      this.hutButton.Disable();
    else {
      this.hutButton.Enable();
      if (document.querySelector('#hut-button').className != 'hide') {
        shophighlight = true;
      }
    }

    //farm
    if (BUILDINGS.Farm.CheckPrice(this.faith, this.food, this.money))
      this.farmButton.Disable();
    else {
      this.farmButton.Enable();
      if (document.querySelector('#farm-button').className != 'hide') {
        shophighlight = true;
      }
      //shophighlight = true;
    }

    //mine
    if (BUILDINGS.Mine.CheckPrice(this.faith, this.food, this.money))
      this.mineButton.Disable();
    else {
      this.mineButton.Enable();
      if (document.querySelector('#mine-button').className != 'hide') {
        shophighlight = true;
      }
      //shophighlight = true;
    }
    //church price
    document.querySelector(
      '#church-price'
    ).textContent = `Faith:${BUILDINGS.Church.price.faith}`;
    //hut price
    document.querySelector(
      '#hut-price'
    ).textContent = `Food:${BUILDINGS.Hut.price.food} Money:${BUILDINGS.Hut.price.money}`;
    //farmn price
    document.querySelector(
      '#farm-price'
    ).textContent = `Food:${BUILDINGS.Farm.price.food} Money:${BUILDINGS.Farm.price.money}`;
    //mine price
    document.querySelector(
      '#mine-price'
    ).textContent = `Food:${BUILDINGS.Mine.price.food} Money:${BUILDINGS.Mine.price.money}`;
    if (shophighlight == true) {
      document.querySelector('#shop-tab').className = 'tab-activated';
    } else {
      document.querySelector('#shop-tab').className = 'tab';
    }
  }

  //Should maybe be refactored into something that can get the level of any building
  CheckChurchLevel() {
    return BUILDINGS.Church.level;
  }

  CheckHutOccupancy(){
    return BUILDINGS.Hut.occupency;
  }

  CheckLevels() {
    if (BUILDINGS.Church.level > 0 && BUILDINGS.Hut.amount != 0) {
      document.querySelector('#addtochurch').className = '';
      document.querySelector('#cultistnumber').className = '';
    }

    if (BUILDINGS.Farm.amount > 0 && BUILDINGS.Hut.amount != 0) {
      document.querySelector('#Farms').className = '';
      document.querySelector('#cultistnumber').className = '';
    }

    if (BUILDINGS.Mine.amount > 0 && BUILDINGS.Hut.amount != 0) {
      document.querySelector('#Mines').className = '';
      document.querySelector('#cultistnumber').className = '';
    }
  }
  CheckHidden() {
    let churchlvl = this.CheckChurchLevel();
    if (churchlvl > 0) {
      document.querySelector('#gather-button').className = 'button hvr-push';
      document.querySelector('#hut-button').className = 'button';
      document.querySelector('#hut-container').className = '';
    }
    if (churchlvl > 3) {
      document.querySelector('#sacrifice-button').className = 'button hvr-push';
    }
    if (BUILDINGS.Hut.amount > 0) {
      document.querySelector('#mine-button').className = 'button';
      document.querySelector('#farm-button').className = 'button';
      document.querySelector('#farm-container').className = '';
      document.querySelector('#mine-container').className = '';
    }
  }
}

export { BuildingManager, BUILDINGS };
