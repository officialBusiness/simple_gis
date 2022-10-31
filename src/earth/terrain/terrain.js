import * as THREE from 'three';
import Tile from './tile.js';

export default class Terrain{
	constructor(options){
		this.tileCache = new Map();

		this.tiles = new THREE.Group();
		options.scene.add(this.tiles);

		this.tileLayers = [];

		this.zeroTileX = options.zeroTileX;
		this.zeroTileY = options.zeroTileY;
		this.maxLevel = options.maxLevel;

		this.addTile(0,0,1);
		this.addTile(0,1,1);
		this.addTile(1,0,1);
		this.addTile(1,1,1);
	}

	addTile(x, y, z){
		let name = Tile.getName(x, y, z),
				tile = this.tileCache.get(name);
		if( !tile ){
			tile = new Tile(x, y, z, this.tileLayers);
		}
		this.tiles.add(tile);
	}
	removeTile(tile){
		tile.parent.remove(tile);
		return this;
	}

	destroy(){
		this.tileCache.forEach((value, key)=>{
			value.dispose();
		});
		this.tileCache.clear();
	}
}