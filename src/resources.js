import * as cultist from "./cultist.js"
import {BUILDINGS} from "./buildings.js"

class Resource {

    constructor(name, amount) {
        this.name = name; //the name of the resource
        this.amount = amount; //how much of the resource the player currently has
    }

}
//Gonna condense this later
class Faith extends Resource {
    constructor(name, amount, multiplier) {
        super(name, amount);
        this.multiplier = multiplier;
    }

    //increase by the amount speicified by the multiplier
    grow(multiplier = this.multiplier) {
        this.amount = this.amount + (1 * multiplier);
    }

    //opposite of grow
    erode(multiplier = this.multiplier){
        this.amount = this.amount - (1 * multiplier);
    }
}
class Money extends Resource {
    constructor(name, amount, multiplier) {
        super(name, amount);
        this.multiplier = multiplier;
    }

    //increase by the amount speicified by the multiplier
    grow(multiplier = this.multiplier) {
        this.amount = this.amount + (1 * multiplier);
    }

    //opposite of grow
    erode(multiplier = this.multiplier){
        this.amount = this.amount - (1 * multiplier);
    }
}
class Food extends Resource {
    constructor(name, amount, multiplier) {
        super(name, amount);
        this.multiplier = multiplier;
    }

    //increase by the amount speicified by the multiplier
    grow(multiplier = this.multiplier) {
        this.amount = this.amount + (1 * multiplier);
    }

    //opposite of grow
    erode(multiplier = this.multiplier){
        this.amount = this.amount - (1 * multiplier);
    }
}




class CultistManager extends Resource {
    
    constructor(name, faith, food, money) {
        super(name);
        this.amount = 0;
        this.faith = faith; //reference to the Faith resource
        this.food = food;
        this.money = money;
        this.cultists = [];
        this.cultistFoodDrain = .25;
        this.cultistFaithProduction = .5;
    }

    //add a cultist to the array
    AddCultist() {
        this.cultists.push(new cultist.Cultist(10, 0, 50, 50));
        this.amount = this.cultists.length; //update amount
        BUILDINGS.Hut.AssignCultist();
    }

    //Increase faith by the specified passive amount for each cultist
    GrowFaith(){
        /*this.cultists.forEach(cultist => {
            this.faith.amount += cultist.passiveFaithGeneration;
        });*/

        if(this.cultists.length > 0)
            //just use the passive faith generation of the first cultist in the array for now
            this.faith.amount += this.cultistFaithProduction * BUILDINGS.Church.assignedCultists; 
    }

    //Update
    Update(){
        this.FeedCultists();
    }

    //lowers food and kills cultist if food is too low
    FeedCultists(){
        if(BUILDINGS.Church.level < 3)
            return;
        this.food.amount -= this.amount * this.cultistFoodDrain;
        
        if(this.food.amount <= 0){
            this.food.amount = 0;
            
            //remove cultist and feed
            this.KillCultist(Math.floor(Math.random() * this.cultists.length));
            this.AddFood(1);
        }
    }

    //based on farm
    GrowFood(num){
        this.food.amount += BUILDINGS.Farm.assignedCultists * num;
    }

    AddFood(num){
        this.food.amount +=  num;
    }

    GrowMoney(num){
        this.money.amount += BUILDINGS.Mine.assignedCultists * num;
    }

    //increase fath by one 
    AddFaith(){
        this.faith.amount+=1;
    }
    //for each cultist, increase passive faith gain
    // * 2 for now on upgrade
    UpgradeCultists(){
        this.cultists.forEach(cultist => {
            cultist.passiveFaithGeneration *= 2;
            cultist.faithOnDeath *=2
        });
    }

    //randomly select one cultist from the array, remove them from the array, and increase faith by the specified on death amount
    SacrificeRandomCultist() {
        //only do this if there are cultists to sacrifice
        if (this.cultists.length > 0) {
            let randNum = Math.floor(Math.random() * this.cultists.length);

            this.faith.amount += this.cultists[randNum].faithOnDeath;
            this.KillCultist(randNum); //kill a cultist
        }
    }

    //goes down the buildings and removes cultists in a priority order
    //calls #killCultistInBuilding
    KillCultist(randNum){
        if(this.cultists.length > 0){
            //priority remove in order of buildings
            //returns if kill is successful
            if(this.#KillCultistInBuilding(BUILDINGS.Hut, randNum))
                return;
            if(this.#KillCultistInBuilding(BUILDINGS.Church, randNum))
                return;
            if(this.#KillCultistInBuilding(BUILDINGS.Mine, randNum))
                return;
            if(this.#KillCultistInBuilding(BUILDINGS.Farm, randNum))
                return;
        }
    }

    //kills a cultist from a building if possible
    #KillCultistInBuilding(building, randNum){
        if(building.assignedCultists > 0){
            this.cultists.splice(randNum, 1);
            this.amount = this.cultists.length; //update amount
            building.RemoveCultist();
            return true;
        }
        return false;
    }


    //SetupUI-gets the buttons for each building
    //+ Church
    //+- Trading Post
    //+- Farm
    //+- Apartments
    //+- Mines

    //removes a cultist to the building
    //adds one from the church
    onClickMinusBuilding(building){
        building.RemoveCultist();
        BUILDINGS.Hut.AssignCultist();
    }

    //adds a cultist to the building
    //removes one from the church
    onClickPlusBuilding(building){
        building.AssignCultist();
        BUILDINGS.Hut.RemoveCultist();
    }

    //adds one cultist to the church, removes one from a random building
    onHutPlusClick(){
        //pick a building and remove a cultist from it
        //will do first availiable for efficiency
        for (let key of Object.keys(BUILDINGS)) {
            if(key != "Hut")
            {
                if(BUILDINGS[key].assignedCultists > 0)
                {
                    this.onClickMinusBuilding(BUILDINGS[key]);
                    return;
                }
            }
        }
    }
}

export { Resource, Faith, Money,Food, CultistManager };