import * as main from "./main.js";

let farmDescriptions = [];
let churchDescriptions = [];
let mineDescriptions = [];

window.onload = ()=>{
	console.log("window.onload called");
	const url = "assets/descriptions.json";
	const xhr = new XMLHttpRequest();
	xhr.onload = (e) =>{
		console.log(`In onload - HTTP Status Code = ${e.target.status}`);
		const string = e.target.responseText;
		const json = JSON.parse(string);

		farmDescriptions = json.Farm;
		churchDescriptions = json.Church;
		mineDescriptions = json.Mine;

		console.log(farmDescriptions);
		console.log(churchDescriptions);
		console.log(mineDescriptions);
		main.init();
	};
	xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
	xhr.open("GET",url);
	xhr.send();
}