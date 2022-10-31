import { Group } from 'three';
import Tile from './terrain/tile.js';

export default class Earth{
	constructor({
			scene,
			maxLevel = 17
		} = {}){
		this.terrain = new THREE.Group();

		this.tileCache = new Map();

		this.layers = [];
	}

	mountScene(scene){
		scene.add(this.terrain);
		return this;
	}

	setMaxLevel(maxLevel){
		this.maxLevel = maxLevel;
		return this;
	}

	update(camera){

	}

	addLayer(fun){
		this.layers.push(fun);
		return this;
	}

	destroy(){
		this.tileCache.forEach((value, key)=>{
			value.dispose();
		});
		this.tileCache.clear();
	}
}