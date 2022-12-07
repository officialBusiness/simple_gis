import { Group, TextureLoader, Frustum, Matrix4, Vector2 } from 'three';
import TileState from '../tile/tile_state.js';
import Coordinates, { wgs84 } from '../coordinates/coordinates.js';

import tile, { createRootTile } from '../tile/tile.js';

const
	_textureLoader = new TextureLoader(),
	_frustum = new Frustum(),
	_matrix = new Matrix4();

export default class Terrain{
	#tiles = null;
	#minLevel = null;
	#maxLevel = null;
	#rootTile = null;

	#waitStack = [];
	#isLoading = false;
	#provider = null;
	#originMatrix = null;

	constructor(provider, minLevel, maxLevel){
		this.#tiles = new Group();
		this.#tiles.name = 'terrain';

		this.#minLevel = minLevel;
		this.#maxLevel = maxLevel;

		this.#provider = provider;

		this.#rootTile = createRootTile();

		this.#initBaseTiles()
	}

	mountScene(scene){
		scene.add(this.#tiles);
		return this;
	}

	showTiles(camera){
		console.time('showTiles');
		let
			stack = [...this.#rootTile],
			tile;
		while( tile = stack.pop() ){
			// console.log('tile:', tile);
			// console.log(tile.mesh.name, 'tileIsVision:', tileIsVision(camera, tile));
			if( tileIsVision(camera, tile) ){
				// console.log('tile:', tile);
				switch( tile.state ){
					case TileState.READY:
						this.#loadTexture(tile);
						tile.state = TileState.IMAGELOADING;
						break;
					case TileState.IMAGELOADING:
					case TileState.IMAGEFAILED:
					case TileState.BASE:
					case TileState.SHOW:
						// console.log('不加载');
						break;
					case TileState.IMAGELOADED:
					case TileState.STORE:
						this.#tiles.add(tile.mesh);
						tile.state = TileState.SHOW;
						break;
					default:
						break;
				}

				if( subIsVision(camera, tile, this.#minLevel, this.#maxLevel) ){
					// console.log('subIsVision:', subIsVision(camera, tile, this.#minLevel, this.#maxLevel));
					tile.getChildren().forEach((child)=>{
						stack.push(child);
					});
				}
			}
		}
		console.timeEnd('showTiles');
		return this;
	}

	applyMatrix4(matrix){
		this.#tiles.applyMatrix4(matrix);
		this.#originMatrix = matrix;
		return this;
	}

	#initBaseTiles(){
		this.#rootTile.forEach((child)=>{
			child.traverse((tile)=>{
				// console.log('tile:', tile);
				if( tile.z < this.#minLevel ){
					return true;
				}else if( tile.z === this.#minLevel ){
					this.#loadTexture(tile);
					tile.state = TileState.BASE;
				}
				return false;
			});
		})
	}

	#loadTexture(tile){
		this.#waitStack.push(tile);
		if( !this.#isLoading ){
			this.#isLoading = true;
			this.#requestTexture();
		}
		return this;
	}

	#requestTexture(){
		let tile;
		if( tile = this.#waitStack.pop() ){
			// console.log('this.#provider:', this.#provider);
			let url = this.#provider.getUrl(tile.x, tile.y, tile.z);
			_textureLoader.load(url, (texture)=>{
				tile.setTexture(texture);
				tile.state = TileState.SHOW
				this.#tiles.add(tile.mesh);
				this.#requestTexture();
			}, ()=>{
				tile.state = TileState.IMAGEFAILED
			});

		}else{
			this.#isLoading = false;

		}
	}


}

function subIsVision(
	camera,
	tile,
	minLevel,
	maxLevel,
	sseThreshold = 5
){
	if ( tile.z === 0 || tile.z < minLevel) {
    return true;
  }
  if ( maxLevel <= tile.z ) {
    return false;
  }

  let
  	cV = camera.position.clone().divide(wgs84),
  	vhMagnitudeSquared = cV.lengthSq() - 1.0,
  	canvasSize = new Vector2( window.innerWidth, window.innerHeight ),
  	hypotenuse = canvasSize.length(),
  	radAngle = camera.fov * Math.PI / 180,
  	HYFOV = 2.0 * Math.atan(Math.tan(radAngle * 0.5) * hypotenuse / canvasSize.x),
  	preSSE = hypotenuse * (2.0 * Math.tan(HYFOV * 0.5)),

		boundingSphere = tile.mesh.geometry.boundingSphere,
		center = tile.cornersVector.center,

  	distance = Math.max(
        0.0,
        camera.position.distanceTo(center) - 
        boundingSphere.radius);

  return sseThreshold < preSSE * (tile.geometricError / distance);
}

function tileIsVision(camera, tile){
	if( tile.z === 0 ){
		return true;
	}

	let
		boundingSphere = tile.mesh.geometry.boundingSphere.clone(),
		points = tile.cornersVector;

	_frustum.setFromProjectionMatrix( _matrix.multiplyMatrices( camera.projectionMatrix,camera.matrixWorldInverse ) );

	if( _frustum.intersectsSphere(boundingSphere) ){
	// if( _frustum.intersectsObject(tile.mesh) ){
		// return true;
		let vectors = tile.extent.vectors;
		for( let i = 0, len = vectors.length; i < len; i++ ){

			let
				n = Coordinates.getCartesianNormal( vectors[i].x, vectors[i].y, vectors[i].z ),
				v = camera.position.clone().sub( n ),
				angle = v.angleTo( n );

			// console.log('_frustum.containsPoint( vectors[i] ):', _frustum.containsPoint( vectors[i] ));
			// console.log('angle:', angle / Math.PI * 180);
			if( 
					// _frustum.intersectsSphere(boundingSphere)
					// && 
						angle <= Math.PI / 2 
					){
				return true;
			}
		}
	}

	return false;
}


