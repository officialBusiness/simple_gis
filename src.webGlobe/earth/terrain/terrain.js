import { Group } from 'three';
import Tile from './tile.js';

export default class Terrain{
	constructor(){
		this.tileCache = new Map();

		this.tiles = new Group();
	}

	mountScene(scene){
		scene.add(this.tiles);
		return this;
	}

	setMaxLevel(maxLevel){
		this.maxLevel = maxLevel;
		return this;
	}

	addTile(x, y, z){
		this.tiles.add(new Tile(x, y, z));
		return this;
	}
	removeTile(tile){
		tile.parent.remove(tile);
		return this;
	}
	getTile(name){
		return this.tileCache.get(name);
	}

	destroy(){
		this.tileCache.forEach((value, key)=>{
			value.dispose();
		});
		this.tileCache.clear();
	}
}