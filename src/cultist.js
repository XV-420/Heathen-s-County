import { CanvasObject } from "./canvasobject.js";

class Cultist extends CanvasObject {
    //takes in the passive gen, gen on death, x and y for canvas position
    //kinda a "dumb" class
    constructor(_passiveFaithGeneration, _faithOnDeath, _xPos, _yPos) {
        //set values
        super(_xPos, _yPos);
        this.passiveFaithGeneration = _passiveFaithGeneration;
        this.faithOnDeath = _faithOnDeath;
    };
}

export { Cultist };