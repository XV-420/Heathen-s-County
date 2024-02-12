import * as resouce from "./resources.js"

//price struct
//pattern is to edit this before each new building gets created
const PRICE = {
    faith: 0,
    money: 0,
    food: 0,
    cultists: 0
}

const BUILDINGS = {
    Farm: ,
    Church: ,
    TradingPost: ,
    Hut: ,

}


class Building
{
    constructor(){        
        this.level = 0; //level of the object
        this.upgradePrice = []; //price to upgrade
        this.assignedCultists = 0; 
        this.price = PRICE;
        this.hidden = true; //make all the buildings up front, and hide the ones that 
        this.names = [];
        this.currentName = "";
        this.maxLevel = 4;
    };

    //upgrades the building and updates its name
    Upgrade(){
        this.level++;
        if(this.level > this.maxLevel) this.level = this.maxLevel;
        this.currentName = this.names[level];  
    };


    //assign a cultist from this building
    AssignCultist(amount = amount){
        this.assignedCultists + amount;
    };

    //remove an assigned cultist
    RemoveCultist(amount = 1){
        this.assignedCultists - amount;
        if(this.assignedCultists < 0) this.assignedCultists = 0;
    }

    //update
    Update(){};
}

class Church extends Building
{
    constructor(){
        super();
        this.currentName = "Shrine";

        //could have done this on one line, but wanted to make it readable
        this.names[0] = "Shrine";
        this.names[1] = "Chapel";
        this.names[2] = "Church";
        this.names[3] = "Temple";
        this.names[4] = "Ziggurat";
    }
}

class Hut extends Building
{
    constructor(){
        super();
        this.currentName = "Hut";

        //could have done this on one line, but wanted to make it readable
        this.names[0] = "Hut";
        this.names[1] = "Home";
        this.names[2] = "Hostel";
        this.names[3] = "Hotel";
        this.names[4] = "Apartments";
    }
}

class Farm extends Building
{
    constructor(){
        super();
        this.currentName = "Pens";

        //could have done this on one line, but wanted to make it readable
        this.names[0] = "Pens";
        this.names[1] = "Farmstead";
        this.names[2] = "Farms";
        this.names[3] = "Slaughterhouses";
        this.names[4] = "Butchery";
    }
}

class TradingPost extends Building
{
    constructor(){
        super();
        this.currentName = "Trading Post";

        //could have done this on one line, but wanted to make it readable
        this.names[0] = "Trading Post";
        this.names[1] = "Market";
        this.names[2] = "Bazaar";
        this.names[3] = "Chain Store";
        this.names[4] = "Mall";
    }
}

class Mine extends Building
{
    constructor(){
        super();
        this.currentName = "Mine";

        //could have done this on one line, but wanted to make it readable
        this.names[0] = "Mine";
        this.names[1] = "Strip-Mine";
        this.names[2] = "Bank";
        this.names[3] = "Donation Buckets";
        this.names[4] = "Alms Collection Facility";
    }
}


class BuildingManager
{
    #church;
    #tradingPost;
    #huts;
    #mines;
    #farms;
    constructor(cultistManager, faith, money){ //additional resources
        this.#Init();
    }

    //method to init the buildings
    //gonna make a certain amount of each one to start, and set them all the hidden
    //1 church
    //1 tradingpost
    //3 of each of the rest
    #Init(){
        //make all the buildings
        this.#church = new Church();
        this.#tradingPost = new TradingPost();
        this.#huts = new Hut();
        this.#mines = new Mine();
        this.#farms = new Farm();
    }

    Update(){
        //check level of each building and update values based on their level\


        //church

        //tradingpost-maybe not here

        //huts-maybe not here

        //mines

        //farms
    }
}

export {}