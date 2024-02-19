import { Button } from "./button.js"
import { CultistManager } from "./resources.js";
import { getRandom } from "./utils.js";

//price struct
//pattern is to edit this before each new building gets created
const PRICE = {
    faith: 0,
    money: 0,
    food: 0,
    cultists: 0
}

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


    //increases amount by one
    Buy() {
        this.amount++;
    }

    //upgrades the building and updates its name
    Upgrade() {
        this.level++;
        if (this.level > this.maxLevel) this.level = this.maxLevel;
        this.currentName = this.names[this.level];
        console.log("upgrade " + this.currentName);
    };


    //assign a cultist from this building
    AssignCultist(amount = 1) {
        this.assignedCultists += amount;
    };

    //remove an assigned cultist
    RemoveCultist(amount = 1) {
        this.assignedCultists -= amount;
        if (this.assignedCultists < 0) this.assignedCultists = 0;
    }

    //update
    Update() { if (this.hidden) return; };
}

class Church extends Building {
    constructor(maxCount, names) {
        super(maxCount, names);
    }


    //has the passive gain for the building
    Update(cultistManager) {
        super.Update();
        if (this.level > 0)
            cultistManager.GrowFaith();
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
        if (this.occupency != cultistManager.amount && this.occupency > cultistManager.amount && this.occupency != 0) {
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
        this.maxCount *= 2;
    }
}

class Farm extends Building {
    constructor(maxCount, names) {
        super(maxCount, names);
        this.foodProductionPerCultist = .01;
    }

    Update(cultistManager) {
        cultistManager.GrowFood(this.foodProductionPerCultist);
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

    }
}

const BUILDINGS = {
    Church: new Church(1, ["Shrine", "Chapel", "Church", "Temple", "ziggurat"]),
    Farm: new Farm(3, ["Pen", "Farmstead", "Farms", "Slaughterhouses", "Butchery"]),
    TradingPost: new TradingPost(1, ["Shrine", "Chapel", "Church", "Temple", "ziggurat"]),
    Hut: new Hut(3, ["Hut", "Home", "Apartments", "Super Habitation Complex", "Container"]),
    Mine: new Mine(3, ["Mine, Strip-Mine, Bank, Donation Center, Alms Collection Facility"])
}

class BuildingManager {

    churchButton;
    hutButton;
    constructor(cultistManager, faith, money, food) { //additional resources
        this.cultistManager = cultistManager;
        this.faith = faith;
        this.money = money;
        this.food = food;

        //setup price of the buildings
        BUILDINGS.Church.price.faith = 10;
        BUILDINGS.Hut.price.money = 10;
        BUILDINGS.Hut.price.food = 10;
        BUILDINGS.Farm.price.food = 10;
        BUILDINGS.Farm.money = 100;
        BUILDINGS.Farm.faith = 1000;
        //more later

        //setupUI
        this.SetupUI();

    }


    //get and setup the UI elements
    //1 button per building(5)
    //setup onclick to buy, then to upgrade if not hidden

    SetupUI() {
        const cbutton = document.querySelector("#church-button");
        this.churchButton = new Button(cbutton, 5, () => {
            BUILDINGS.Church.hidden = false;
            this.SubtractCosts(BUILDINGS.Church.price);
            BUILDINGS.Church.Upgrade();
            console.log("clicked");
            this.churchButton.ChangeName(BUILDINGS.Church.currentName);
            //added  hut here for the name changing over time
            BUILDINGS.Hut.Upgrade();
            this.hutButton.ChangeName(BUILDINGS.Hut.currentName);
        });
        this.churchButton.ChangeName(BUILDINGS.Church.currentName)

        //+ for church
        const cplus = document.querySelector("#church-button-plus");
        this.churchPlusButton = new Button(cplus, 100, () => {
            console.log("church plus clicked");
            this.cultistManager.onClickPlusBuilding(BUILDINGS.Church);
            console.log("Church Amount: " + BUILDINGS.Church.assignedCultists);
        });
        const cminus = document.querySelector("#church-button-minus");
        this.churchMinusButton = new Button(cminus, 100, () => {
            console.log("Church Minus clicked");
            this.cultistManager.onClickMinusBuilding(BUILDINGS.Church);
            console.log("Church Amount: " + BUILDINGS.Church.assignedCultists + " Hut Amount: " + BUILDINGS.Hut.assignedCultists);
        });


        //hut
        const hbutton = document.querySelector("#hut-button");
        this.hutButton = new Button(hbutton, 5, () => {

            BUILDINGS.Hut.hidden = false;
            if (BUILDINGS.Hut.maxCount != BUILDINGS.Hut.amount) {
                this.SubtractCosts(BUILDINGS.Hut.price);

                console.log("clicked");
                BUILDINGS.Hut.Buy();
                this.CheckBuy();
            }
            this.CheckBuy();
        });
        this.hutButton.ChangeName(BUILDINGS.Hut.currentName)

        //+ for hut
        const hplus = document.querySelector("#hut-button-plus");
        this.hutPlusButton = new Button(hplus, 100, () => {
            console.log("hut plus clicked");
            this.cultistManager.onHutPlusClick();
            console.log("Church Amount: " + BUILDINGS.Church.assignedCultists + " Hut Amount: " + BUILDINGS.Hut.assignedCultists);
        });


        //+- for Farm
        const fbutton = document.querySelector("#farm-button");
        this.farmButton = new Button(fbutton, 5, () => {

            BUILDINGS.Farm.hidden = false;
            if (BUILDINGS.Farm.maxCount != BUILDINGS.Farm.amount) {
                this.SubtractCosts(BUILDINGS.Farm.price);

                console.log("clicked");
                BUILDINGS.Farm.Buy();
                this.CheckBuy();
            }
            this.CheckBuy();
        });
        this.farmButton.ChangeName(BUILDINGS.Farm.currentName)

        const fplus = document.querySelector("#farm-button-plus");
        this.farmPlusButton = new Button(fplus, 100, () => {
            console.log("Farm plus clicked");
            this.cultistManager.onClickPlusBuilding(BUILDINGS.Farm);
            console.log("Farm Amount: " + BUILDINGS.Farm.assignedCultists + " Hut Amount: " + BUILDINGS.Hut.assignedCultists);
        });
        const fminus = document.querySelector("#farm-button-minus");
        this.farmMinusButton = new Button(fminus, 100, () => {
            console.log("Farm Minus clicked");
            this.cultistManager.onClickMinusBuilding(BUILDINGS.Farm);
            console.log("Farm Amount: " + BUILDINGS.Farm.assignedCultists + " Hut Amount: " + BUILDINGS.Hut.assignedCultists);
        });

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
        BUILDINGS.Hut.Update(this.cultistManager)
        //mines

        //farms
        BUILDINGS.Farm.Update(this.cultistManager);
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
            if (key != "Hut") {
                if (BUILDINGS[key].assignedCultists > 0)
                    cultistsInBuildings = true;
            }
        }
        if (cultistsInBuildings)
            this.hutPlusButton.Enable();
        else
            this.hutPlusButton.Disable();

        //church-minus
        if (BUILDINGS.Church.assignedCultists > 0)
            this.churchMinusButton.Enable();
        else
            this.churchMinusButton.Disable();

        //farm minus
        if (BUILDINGS.Farm.assignedCultists > 0)
            this.farmMinusButton.Enable();
        else
            this.farmMinusButton.Disable();


        //check church to determine if other buildings can be added to
        if (BUILDINGS.Hut.assignedCultists != 0) {
            this.churchPlusButton.Enable();
            this.farmPlusButton.Enable();
        }
        else {
            this.churchPlusButton.Disable();
            this.farmMinusButton.Disable();
        }

        //others

    }
    //check if they can buy it
    //for now ima update every frame
    CheckBuy() {
        //church
        if (BUILDINGS.Church.price.faith > this.faith.amount)
            this.churchButton.Disable();

        else
            this.churchButton.Enable();

        //hut
        if (BUILDINGS.Hut.price.money > this.money.amount && BUILDINGS.Hut.price.food > this.food.amount || BUILDINGS.Hut.maxCount == BUILDINGS.Hut.amount)
            this.hutButton.Disable();

        else
            this.hutButton.Enable();

        if (BUILDINGS.Farm.price.money > this.money.amount && BUILDINGS.Farm.price.food > this.food.amount && BUILDINGS.Farm.price.faith > this.faith.amount || BUILDINGS.Hut.maxCount == BUILDINGS.Hut.amount)
            this.farmButton.Disable();

        else
            this.farmButton.Enable();
        //other buildings          
    }

    //Should maybe be refactored into something that can get the level of any building
    CheckChurchLevel() {
        return BUILDINGS.Church.level;
    }

}

export { BuildingManager, BUILDINGS }