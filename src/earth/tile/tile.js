import {
	Mesh,
	MeshBasicMaterial,
	// ArrowHelper,
	// Vector3,
	// BoxGeometry,
	// BufferGeometry,
	// LineBasicMaterial,
	// Line
} from 'three';
import TileState from '../tile/tile_state.js';
import TileGeometry from './tile_geometry.js';
import Coordinates from '../coordinates/coordinates.js';

export function createRootTile(){
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
			vectors: []
		}

		this.cornersVector = {
			northwest: Coordinates.getCartesianByLL(this.extent.minLongitude, this.extent.maxLatitude),
			southwest: Coordinates.getCartesianByLL(this.extent.minLongitude, this.extent.minLatitude),
			northeast: Coordinates.getCartesianByLL(this.extent.maxLongitude, this.extent.maxLatitude),
			southeast: Coordinates.getCartesianByLL(this.extent.maxLongitude, this.extent.minLatitude),
			center: Coordinates.getCartesianByLL( (this.extent.minLongitude + this.extent.maxLongitude) / 2, (this.extent.minLatitude + this.extent.maxLatitude) / 2),
		}

		// index %= 4;
		let geometry = new TileGeometry( this.extent, z ),
				material = new MeshBasicMaterial({
					depthTest: false,
					color: 0xffffff,
					// color: index === 0 ? 0xff0000 :
					// 			index === 1 ? 0xffff00 :
					// 			index === 2 ? 0x0000ff : 0xff00ff,
					// wireframe: true,
				})
		// index ++;

		this.mesh = new Mesh( geometry, material );
		this.mesh.name = `${x}-${y}-${z}`;

		this.centerSphere = this.mesh.geometry.boundingSphere.center;
		this.geometricError = this.mesh.geometry.boundingSphere.radius / 256;
		this.state = TileState.READY;

		// for( let key in this.cornersVector ){
		// 	let value = this.cornersVector[key];
		// 	// this.mesh.add( new ArrowHelper(
		// 	// 	value.clone(),
		// 	// 	value.clone(),
		// 	// 	1000000 , 0x000000, 100000, 10000)
		// 	// );

		// 	let lineMaterial = new LineBasicMaterial({
		// 		color: 0x0000ff
		// 	});

		// 	let points = [];
		// 	points.push( value.clone() );
		// 	points.push( value.clone().multiplyScalar ( 1.12 ) );
		// 	// points.push( new Vector3(0,0,0) );

		// 	let lineGeometry = new BufferGeometry().setFromPoints( points );

		// 	let line = new Line( lineGeometry, lineMaterial );
		// 	this.mesh.add( line );

		// 	let cube = new Mesh(
		// 								new BoxGeometry( 20000, 20000, 20000 ),
		// 								new MeshBasicMaterial( {color: 0xff0000} ) 
		// 							);
		// 	cube.position.copy(value);
		// 	this.mesh.add(cube);
		// }

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
		this.mesh.material.map = texture;
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