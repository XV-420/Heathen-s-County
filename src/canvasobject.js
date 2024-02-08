import { makeColor } from "./utils.js";
import { Vec } from "./vector.js";
import * as canvasUtils from "./canvas-utils.js";


//Basic Object for the canvas class
class CanvasObject {
    //takes in canvas size
    constructor(_xPos = 0, _yPos = 0, _scale = 1, ) {
      this.position = new Vec(_xPos, _yPos);   
      this.scale = _scale; //scale = 1 by default
      this.color = makeColor(255,255,255,255);//black : temp
      this.size = 1; //makes sure the scale doesn't permanently change the object
    };
     
    //default draw an arc at the objects position
    draw(ctx) {
      //will be overridden in the child, for now
      canvasUtils.drawArc(ctx, this.position.components[0], this.position.components[1], this.size * this.scale,this.color,0,this.color,0, 2 * Math.PI);
    }
}

export{CanvasObject}