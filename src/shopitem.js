
class ShopItem
{
    ShopItem(image = null){        
        let level = 1; //level of the object
        let price = []; //price to buy intially
        let upgradePrice = [level * 1]; //price to upgrade
        let image; //image?
        
    };

    Upgrade(){
        level++; 
    };

    Update(){};
}

class Church extends ShopItem
{
    Church(){
        super();
    }
}