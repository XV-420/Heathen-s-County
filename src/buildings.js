import { Button } from "./button.js"

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
        this.price = PRICE;
        this.hidden = true; //make all the buildings up front, and hide the ones that 
        this.names = _names;
        this.currentName = this.names[0];
        this.maxLevel = 4;
        this.amount = 1;
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
    AssignCultist(amount = amount) {
        this.assignedCultists + amount;
    };

    //remove an assigned cultist
    RemoveCultist(amount = 1) {
        this.assignedCultists - amount;
        if (this.assignedCultists < 0) this.assignedCultists = 0;
    }

    //update
    Update() { if(this.hidden) return;};
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
    Upgrade(){
        super.Upgrade();
        this.price.faith *=2; //double faith cost for now //tmp
    }
}

class Hut extends Building {
    constructor(maxCount, names) {
        super(maxCount, names);
    }
}

class Farm extends Building {
    constructor(maxCount, names) {
        super(maxCount, names);

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
    Farm: new Farm(3, ["Pen", "Farmstead", "Farms", "Slaughterhouses", "Butchery"]),
    Church: new Church(1, ["Shrine", "Chapel", "Church", "Temple", "ziggurat"]),
    TradingPost: new TradingPost(1, ["Shrine", "Chapel", "Church", "Temple", "ziggurat"]),
    Hut: new Hut(3, ["Hut", "Home", "Apartments", "Super Habitation Complex", "Container"]),
    Mine: new Mine(3, ["Mine, Strip-Mine, Bank, Donation Center, Alms Collection Facility"])
}

class BuildingManager {

    churchButton;
    constructor(cultistManager, faith) { //additional resources
        this.cultistManager = cultistManager;
        this.faith = faith;

        //setup price of the buildings
        BUILDINGS.Church.price.faith = 10;
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
        });
    }

    SubtractCosts(price){
        this.faith.amount -= price.faith;
        
        //other resouces lower here
    }

    Update() {
        //check level of each building and update values based on their level
        //church
        BUILDINGS.Church.Update(this.cultistManager);
        //tradingpost

        //huts

        //mines

        //farms

        this.UIUpdate();
    }

    //updates all the buttons
    UIUpdate(){
        this.CheckBuy();

    }

    //check if they can buy it
    //for now ima update every frame
    CheckBuy(){
        if(BUILDINGS.Church.price.faith > this.faith.amount)
            this.churchButton.Disable();

        else
            this.churchButton.Enable();

        //other resources


        //other buildings
    }

}

export { BuildingManager }