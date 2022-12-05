import {
	Mesh,
	MeshBasicMaterial
} from 'three';

import TileGeometry from './tile_geometry.js';

export default class Tile{
	#children = null;
	#mesh = null;

	constructor(x, y, z, parent){
		this.x = x;
		this.y = y;
		this.z = z;

		if( parent ){
			this.parent = parent;
		}

		this.#mesh = new Mesh(
			new TileGeometry( x, y, z ),
			new MeshBasicMaterial({
				// map: new TextureLoader().load( getUrl(x, y, z) ),
				depthTest: false,
				color: 0xffffff,
				// color: index === 0 ? 0x00ffff :
				// 			index === 1 ? 0xff0000 :
				// 			index === 2 ? 0xffff00 :
				// 			index === 3 ? 0xff00ff : 0x000000,
				// wireframe: true,
			})
		);

		this.centerSphere = this.#mesh.geometry.boundingSphere.center;
		this.geometricError = this.#mesh.geometry.boundingSphere.radius / 256;
	}

	setTexture(texture){
		// console.log('texture:', texture);
		this.#mesh.material.map = texture;
		return this;
	}

	getMesh(){
		return this.#mesh;
	}

	getChildren(){
		if( this.#children === null ){
			this.#children = [
				new Tile(
					this.x << 1,
					this.y << 1,
					this.z + 1,
					this
				),
				new Tile(
					this.x << 1 | 1,
					this.y << 1,
					this.z + 1,
					this
				),
				new Tile(
					this.x << 1,
					this.y << 1 | 1,
					this.z + 1,
					this
				),
				new Tile(
					this.x << 1 | 1,
					this.y << 1 | 1,
					this.z + 1,
					this
				)
			];
		}
		return this.#children;
	}

	traverse(judge){
		// console.log('judge:', judge);
		if( judge(this) ){
			this.getChildren().forEach((child)=>{
				child.traverse(judge);
			});
		}
		return this;
	}
}

