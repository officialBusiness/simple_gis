import {
	Vector2,
	Vector3,
	Frustum
} from 'three';
import { Group, TextureLoader } from 'three';
import { createRootTile } from './tile/tile.js';
import { wgs84 } from './geographic/coordinates.js';

import getUrl from './provider/bing_provider.js';

import { isBox3DVisible } from '../core/camera.js';

const textureLoader = new TextureLoader();

export default class Earth{
	#minLevel = null
	#maxLevel = null
	#terrain = null
	#readyStack = null
	#loadStack = null
	#isLoadTextue = null
	#baseTile = null
	#rootTile = null
	#layer = null

	constructor(){
		this.#minLevel = 4;
		this.#maxLevel = 16;
		this.#terrain = new Group();

		this.#readyStack = [];
		this.#loadStack = [];
		this.#isLoadTextue = false;

		this.#baseTile = [];

		this.#rootTile = createRootTile();

		this.#layer = [];

		this.position = this.#terrain.position;

		let levelStack = [this.#rootTile];
		while(levelStack.length > 0){
			let tile = levelStack.pop();
			if( tile.z < this.#minLevel ){
				let children = tile.getChildren();
				if( tile.z === this.#minLevel - 1 ){
					children.forEach((child)=>{
						this.#baseTile.push(child);
						this.#addLoadTexture(child);
					});
				}else{
					children.forEach((child)=>{
						levelStack.push(child);
					});
				}
			}
				
		}
		levelStack = null;

		// console.log('this.#rootTile:', this.#rootTile);
	}
	mountScene(scene){
		scene.add(this.#terrain);
		return this;
	}
	addLayer(){

	}
	update(camera){
		// console.log('update');
		// let tempStack = [];
		// this.#baseTile.forEach((tile)=>{
		// 	let subVisible = subdivision(
		// 		camera,
		// 		tile,
		// 		this.minLevel,
		// 		this.maxLevel
		// 	);

		// 	if( subVisible ){
		// 		tile.getChildren().forEach((child)=>{
		// 			tempStack.push(child);
		// 		});
		// 	}
		// });

		// console.log('tempStack:', tempStack);
	}

	getTerrain(){
		return this.#terrain;
	}

	setCoord(longitude, latitude, height){

	}

	#addLoadTexture(tile){
		// console.log('添加待加载的瓦片:', tile);
		this.#loadStack.push(tile);
		if( !this.#isLoadTextue ){
			this.#isLoadTextue = true;
			this.#loadTexture();
		}
		return this;
	}
	#loadTexture(){
		if( this.#loadStack.length > 0 ){
			let
				tile = this.#loadStack.pop(),
				url = getUrl(tile.x, tile.y, tile.z);
			// console.log('加载瓦片:', tile);
			textureLoader.load(url, (texture)=>{
				// console.log('瓦片加载完成:', tile);
				tile.setTexture(texture);
				this.#readyStack.push(tile);
				this.#loadTexture();
			});
		}else{
			this.#isLoadTextue = false;
			// console.log('瓦片加载完成开始渲染');
			while(this.#readyStack.length > 0){
				this.#terrain.add( this.#readyStack.pop().mesh );
			}
		}
	}

	
}


function pointHorizonCulling(pt, camera) {
	  const cV = new Vector3().copy(camera.position).divide(wgs84);
    const vhMagnitudeSquared = cV.lengthSq() - 1.0;

    var vT = pt.divide(wgs84).sub(cV);

    var vtMagnitudeSquared = vT.lengthSq();

    var dot = -vT.dot(cV);

    return isOccluded =
        vhMagnitudeSquared < dot &&
        vhMagnitudeSquared < dot * dot / vtMagnitudeSquared;
}


function horizonCulling(tile, camera) {
    // horizonCulling Oriented bounding box
    var points = tile.OBB().pointsWorld;
    var isVisible = false;

    for (const point of points) {
        if (!pointHorizonCulling(point.clone(), camera)) {
            isVisible = true;
            break;
        }
    }
    return isVisible;
}

function frustumCullingOBB(tile, camera) {
  return isBox3DVisible(
      tile.OBB().box3D, 
      tile.OBB().matrixWorld,
      camera
  );
}

function culling(camera, tile, minLevel){
	return !(
	    frustumCullingOBB(tile, camera) && 
	    (tile.z < minLevel || 
	        horizonCulling(tile, camera))
	    );
}

function subdivision(
	camera,
	tile,
	minLevel,
	maxLevel,
	sseThreshold = 1,
){
	if (tile.z < minLevel) {
		return true;
  }
  if (maxLevel <= tile.z) {
		return false;
  }

  const boundingSphere = tile.mesh.geometry.boundingSphere;
  // console.log('boundingSphere:', boundingSphere);
  const distance = Math.max(
        0.0,
        camera.position.distanceTo(
	        	tile.centerSphere
        	) - boundingSphere.radius
        );

  // pre-horizon culling
  const cV = new Vector3().copy(camera.position).divide(wgs84);
  const vhMagnitudeSquared = cV.lengthSq() - 1.0;
  const canvasSize = new Vector2(window.innerWidth, window.innerHeight);
  // pre-sse
  const hypotenuse = canvasSize.length();
  const radAngle = camera.fov * Math.PI / 180;

   // TODO: not correct -> see new preSSE
  // const HFOV = 2.0 * Math.atan(Math.tan(radAngle * 0.5) / context.camera.ratio);
  const HYFOV = 2.0 * Math.atan(Math.tan(radAngle * 0.5) * hypotenuse / canvasSize.x);

  const preSSE = hypotenuse * (2.0 * Math.tan(HYFOV * 0.5));
  // console.log('preSSE:', preSSE);
  return sseThreshold < preSSE * (tile.geometricError / distance);
}