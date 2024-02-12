import * as resouce from "./resources.js"

const price = {
    id: 0,
    name: '',
    country: '',
    pets: [],
}


class ShopItem
{
    ShopItem(image = null, price, cultistManager){        
        this.level = 1; //level of the object
        this.price = price; //price to buy intially
        this.upgradePrice = []; //price to upgrade
        this.image; //image?
        this.assignedCultists = 0; 
        this.cultistManager = cultistManager;   
    };

    Upgrade(){
        level++; 
    };

    AssignCultist(amount = amount){
        this.assignedCultists + amount;
    };

    RemoveCultist(amount = 1){
        this.assignedCultists - amount;

        if(this.assignedCultists < 0) this.assignedCultists = 0;
    }

    Update(){};
}

class Church extends ShopItem
{
    Church(image, price, faith){
        super(image, price);
        this.faith = faith;
    }

    Update(){
        if(this.level > 2)
            this.cultistManager.GrowFaith();
    }
}