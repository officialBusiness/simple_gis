import {
	Mesh,
	MeshBasicMaterial,
	Texture,
	TextureLoader
} from 'three';
import TileGeometry from './tile_geometry.js';
import getUrl from '../layer/bing_layer.js';

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
		let 
			geometry = new TileGeometry( x, y, z ),
			material = new MeshBasicMaterial({
				map: new TextureLoader().load( getUrl(x, y, z) ),
				depthTest: false,
				color: 0xffffff,
				// wireframe: true,
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
