import {
	Mesh,
	MeshBasicMaterial,
	Vector3,
	Texture,
	TextureLoader
} from 'three';
import TileGeometry from './tile_geometry.js';

export default class Tile extends Mesh {
	static getName(x, y, z){
		return `${x}-${y}-${z}`;
	}
	constructor(x, y, z, layers){
		// 初始化几何体
		let 
			geometry = new TileGeometry( x, y, z ),
			material = new MeshBasicMaterial({
				// map: new TextureLoader().load( getUrl(x, y, z) ),
				depthTest: false,
				color: 0xffffff,
				// wireframe: true,
			});

		super(geometry, material);
		this.name = Tile.getName(x, y, z);
		this.type = "tile";

		// geometry.computeBoundingBox();
		// console.log(geometry)
	}

	dispose(){
		this.geometry.dispose();

		this.material.dispose();
	}
}
