import { Mesh } from 'three';
// import TileGeometry from './tile_geometry.js';
// import TileMaterial from './tile_material.js';

export default class Tile extends Mesh {
	static getName(x, y, z){
		return `${x}-${y}-${z}`;
	}
	constructor(x, y, z, layers){
		// let
		// 	geometry = new TileGeometry(x, y, z),
		// 	material = new THREE.MeshBasicMaterial({
		// 		texture: new THREE.TextureLoader().load(`http://11.163.70.133:6020/file/earth_map/${z}/${y}/${x}.jpg`) 
		// 	});

		// super(geometry, material);

		// this.name = Tile.getName(x, y, z);
		// this.type = "tile";
	}

	dispose(){
		this.geometry.dispose();

		this.material.dispose();
	}
}