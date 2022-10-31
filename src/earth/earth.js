import { Group } from 'three';
import Tile from './terrain/tile.js';

export default class Earth{
	constructor(){
		this.terrain = new Group();

		this.tileCache = new Map();

		this.layers = [];

		this.maxLevel = 17;
	}

	mountScene(scene){
		scene.add(this.terrain);
		this.terrain.add(new Tile(0,0,1));
		this.terrain.add(new Tile(1,0,1));
		this.terrain.add(new Tile(0,1,1));
		this.terrain.add(new Tile(1,1,1));
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