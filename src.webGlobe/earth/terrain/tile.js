import {
	Mesh,
	MeshBasicMaterial,
} from 'three';
import TileGeometry from './tile_geometry.js';
// import TileMaterial from './tile_material.js';

export function getTileImageUrl(layers, x, y, z){
	return layers.map((layer)=>{
		return layer(x, y, z);
	})
}

export default class Tile extends Mesh {
	static getName(x, y, z){
		return `${x}-${y}-${z}`;
	}
	constructor(x, y, z, layers){
		// 初始化几何体
		// let image 
		let 
			geometry = new TileGeometry( x, y, z ),
			material = new MeshBasicMaterial({

			});


		super(geometry, material);
		this.name = Tile.getName(x, y, z);
		this.type = "tile";
	}

	dispose(){
		this.geometry.dispose();

		this.material.dispose();
	}
}