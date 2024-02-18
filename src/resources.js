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
    
    constructor(name, faith, ) {
        super(name);
        this.amount = 0;
        this.faith = faith; //reference to the Faith resource
        this.cultists = [];
    }

    //add a cultist to the array
    AddCultist() {
        this.cultists.push(new cultist.Cultist(.01, 10, 0, 50, 50));
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
            this.faith.amount += this.cultists[0].passiveFaithGeneration * BUILDINGS.Church.assignedCultists;
        
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
            this.cultists.splice(randNum, 1);
            this.amount = this.cultists.length; //update amount
            BUILDINGS.Hut.RemoveCultist();
        }
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