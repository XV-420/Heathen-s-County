import * as cultist from "./cultist.js"

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
    
    constructor(name, faith) {
        super(name);
        this.amount = 0;
        this.faith = faith; //reference to the Faith resource
        this.cultists = [];
    }

    //add a cultist to the array
    AddCultist() {
        this.cultists.push(new cultist.Cultist(.01, 10, 0, 50, 50));
        this.amount = this.cultists.length; //update amount
    }

    //Increase faith by the specified passive amount for each cultist
    GrowFaith() {
        this.cultists.forEach(cultist => {
            this.faith.amount += cultist.passiveFaithGeneration;
        });
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
        }
    }
}

export { Resource, Faith, Money,Food, CultistManager };