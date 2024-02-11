import * as main from "./main.js";

let names = [];
let occupations = [];

window.onload = ()=>{
	console.log("window.onload called");
    //old 330 loader code
	const url = "assets/people.json";
	const xhr = new XMLHttpRequest();
	xhr.onload = (e) =>{
		console.log(`In onload - HTTP Status Code = ${e.target.status}`);
		const string = e.target.responseText;
		const json = JSON.parse(string);

		names = json.name;
		occupations = json.occupation;

		console.log(names);
		console.log(occupations);
		main.init();
	};
	xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
	xhr.open("GET",url);
	xhr.send();
}