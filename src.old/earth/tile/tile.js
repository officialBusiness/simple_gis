import {
	Mesh,
	ShaderMaterial,
} from 'three';
import TileState from '../tile/tile_state.js';
import TileGeometry from './tile_geometry.js';
import Coordinates from '../coordinates/coordinates.js';

export function createRootTile(){
	// return [new Tile(0, 0, 0), new Tile(1, 0, 0)];
	return [new Tile(0, 0, 0)];
}

// let index = 0

export default class Tile{
	#children = null;
	#urls = [];

	constructor(x, y, z, parent){
		this.x = x;
		this.y = y;
		this.z = z;

		if( parent ){
			this.parent = parent;
		}

		// 			north
		// west				east
		// 			south

		this.extent = {
			minLongitude: Coordinates.getLongitudeByTileOrder( x, z ),
			maxLongitude: Coordinates.getLongitudeByTileOrder( x + 1, z ),
			minLatitude: Coordinates.getLatitudeByTileOrder( y + 1, z ),
			maxLatitude: Coordinates.getLatitudeByTileOrder( y, z ),
			normals: [],
			centers: [],
			vectors: []
		}

		this.cornersVector = {
			northwest: Coordinates.getCartesianByLL(this.extent.minLongitude, this.extent.maxLatitude),
			southwest: Coordinates.getCartesianByLL(this.extent.minLongitude, this.extent.minLatitude),
			northeast: Coordinates.getCartesianByLL(this.extent.maxLongitude, this.extent.maxLatitude),
			southeast: Coordinates.getCartesianByLL(this.extent.maxLongitude, this.extent.minLatitude),
			center: Coordinates.getCartesianByLL( (this.extent.minLongitude + this.extent.maxLongitude) / 2, (this.extent.minLatitude + this.extent.maxLatitude) / 2),
		}

		let geometry = new TileGeometry( this.extent, z ),
				material = new ShaderMaterial({
					depthWrite: false,
					// polygonOffset: true,
					// polygonOffsetFactor: z,
					// polygonOffsetFactor: z,
					uniforms: {
						uTexture: null
					},
					vertexShader: `
						precision mediump float;
						varying vec2 vUv;

						void main() {
							vUv = uv;
							gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
						}
					`,
					fragmentShader: `
						precision mediump float;

						uniform sampler2D uTexture;
						varying vec2 vUv;

						void main() {

							vec4 texture = texture2D( uTexture, vUv );

				    	gl_FragColor = texture;
						}
					`
				})


		this.mesh = new Mesh( geometry, material );
		this.mesh.name = `${x}-${y}-${z}`;
		this.mesh.renderOrder = z;

		this.centerSphere = this.mesh.geometry.boundingSphere.center;
		this.geometricError = this.mesh.geometry.boundingSphere.radius / 256;
		this.state = TileState.READY;

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
		this.mesh.material.uniforms.uTexture = {
			value: texture
		}
		this.state = TileState.IMAGELOADED;
		return this;
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