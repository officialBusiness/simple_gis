import {
	Mesh,
	MeshBasicMaterial,
	Vector3,
	Texture,
	TextureLoader,
	BoxGeometry
} from 'three';
import TileGeometry from './tile_geometry.js';

let index = 0;

export default class Tile extends Mesh {
	static getName(x, y, z){
		return `${x}-${y}-${z}`;
	}
	constructor(x, y, z, layers){
		index %= 4;
		// 初始化几何体
		let 
			geometry = new TileGeometry( x, y, z ),
			material = new MeshBasicMaterial({
				// map: new TextureLoader().load( getUrl(x, y, z) ),
				depthTest: false,
				color: index === 0 ? 0x00ffff :
							index === 1 ? 0xff0000 :
							index === 2 ? 0xffff00 :
							index === 3 ? 0xff00ff : 0x000000,
				// wireframe: true,
			});

		index ++;

		super(geometry, material);
		this.name = Tile.getName(x, y, z);
		this.type = "tile";

		// geometry.computeBoundingBox();
		// console.log(geometry)
		// let testBox = 
		// 	new Mesh(
		// 		new BoxGeometry(500000,500000,500000),
		// 		new MeshBasicMaterial({
		// 		// map: new TextureLoader().load( getUrl(x, y, z) ),
		// 		// depthTest: false,
		// 		color: 0xff00000,
		// 		// wireframe: true,
		// 		}) 
		// 	)
		// testBox.position.copy(geometry.center)
		// this.add(testBox);
	}

	dispose(){
		this.geometry.dispose();

		this.material.dispose();
	}
}
