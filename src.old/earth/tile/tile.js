import {
	Vector3
} from 'three';
import tileMesh from './tile_mesh.js';
import OBB from '../geographic/obb.js';

export default class Tile{
	#children = null

	constructor(x, y, z, parent){
		this.x = x;
		this.y = y;
		this.z = z;

		this.mesh = new tileMesh(x, y, z);

		if( parent ){
			this.parent = parent;
		}

		// console.log('this.mesh.geometry.center:', this.mesh.geometry.center);
		this.centerSphere = this.mesh.geometry.boundingSphere.center;
		// = new Vector3().addVectors(
		// 	this.mesh.geometry.boundingSphere.center,
		// 	this.mesh.geometry.center
		// )

		this.geometricError = this.mesh.geometry.boundingSphere.radius / 256;

		// this.OBB = OBB.extentToOBB(x, y, z);
		// this.mesh.add(this.OBB);
		// this.OBB.init();
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
	setTexture(texture){
		// console.log(texture)
		this.mesh.material.map = texture;
		return this;
	}
	toJSON(){

	}
}

export function createRootTile(){
	return new Tile(0, 0, 0);
}