import Terrain from './terrain/terrain.js';


export default class Earth{
	constructor(options = {}){
		this.layers = [];
		this.terrain = new Terrain(options);
	}

	update(){
		// console.log('earth update');
	}

	addLayer(fun){
		this.terrain.layers.push(fun);
	}

	destroy(){
		
	}
}