
class Cultist {
    //takes in the passive gen, gen on death, x and y for canvas position
    //kinda a "dumb" class
    constructor(_passiveFaithGeneration, _faithOnDeath, _xPos, _yPos) {
        //set values
        this.passiveFaithGeneration = _passiveFaithGeneration;
        this.faithOnDeath = _faithOnDeath;
        this.xPOs = _xPos;
        this.yPos = _yPos;
    };
}


export {Cultist}