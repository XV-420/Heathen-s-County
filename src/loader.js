import * as main from "./main.js";



window.onload = ()=>{
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
    main.init();

    //old 330 loader code
	/*const url = "data/av-data.json";
	const xhr = new XMLHttpRequest();
	xhr.onload = (e) =>{
		main.loadJson(e);
		// 2 - start up app
		main.init();
	};
	xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
	xhr.open("GET",url);
	xhr.send();*/
}