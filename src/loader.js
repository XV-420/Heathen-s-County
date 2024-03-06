import * as main from "./main.js";

export let farmDescriptions = [];
export let churchDescriptions = [];
export let mineDescriptions = [];
export let hutDescriptions = [];

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
		hutDescriptions = json.Hut;

		document.querySelector("#farm-button").title = farmDescriptions[0];
		document.querySelector("#church-button").title = churchDescriptions[0];
		document.querySelector("#mine-button").title = mineDescriptions[0];
		document.querySelector("#hut-button").title = hutDescriptions[0];
		main.init();
	};
	xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
	xhr.open("GET",url);
	xhr.send();
}