class Button {

    //takes in the button itself
    constructor(_button, _loadingTime, onclick) {
        //set values
        this.button = _button;
        this.loadingTime = _loadingTime;
        this.percent = 0;
        this.clicked = false;

        //create progress div
        this.child = document.createElement("div");
        this.child.classList.add("button_progress");
        this.button.appendChild(this.child);

        //onclick
        this.button.onclick = () => {
            if (!this.clicked) {
                this.clicked = true;
                onclick();
            }
        }

        //update
        this.update();
    };

    //changes the time on the button
    changeLoadingTime(_loadingTime) {
        if (this._loadingTime > 0)
            this.loadingTime = _loadingTime;
    };

    //add one to percent (will need to scale by delta time )
    update() {
        if (this.clicked) {
            this.percent += this.loadingTime;
            this.#setProgressBar();
            if (this.percent >= 100) {
                this.percent = 0;
                this.clicked = false;
            }
        }
    };

    Disable(){
        this.#setProgressBar(0);
        this.clicked = true;
    }
    Enable(){
        this.#setProgressBar(100);
        this.clicked = false;
    }

    #setProgressBar(percent = this.percent) {
        this.child.style.width = `${percent}%`;
    };


}

export { Button }