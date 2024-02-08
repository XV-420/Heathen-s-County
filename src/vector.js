 //vector class, has basic vector math function as well as x,y,z, uses ...to structure passed in values
 class Vec {
    constructor(...components) {
      this.components = components;
    }
  
    add(vec) {
      this.components = this.components.map((c, i) => c + vec.components[i]);
      return this;
    }
  
    sub(vec) {
      this.components = this.components.map((c, i) => c - vec.components[i]);
      return this;
    }
  
    div(vec) {
      this.components = this.components.map((c, i) => c / vec.components[i]);
      return this;
    }
  
    scale(scalar) {
      this.components = this.components.map((c) => c * scalar);
      return this;
    }
  
    multiply(vec) {
      this.components = this.components.map((c, i) => c * vec.components[i]);
      return this;
    }
    
    //rotate the vector to rotate things on the screen
    rotateXY(angle) {
      const x =
      this.components[0] * Math.cos(angle) -
      this.components[1] * Math.sin(angle);
      const y =
      this.components[0] * Math.sin(angle) +
      this.components[1] * Math.cos(angle);
      this.components[0] = x;
      this.components[1] = y;
    }
  }

  export{Vec}