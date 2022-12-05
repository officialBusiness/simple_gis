import { Group, Vector2, Vector3 } from 'three';
import Scheduler from './scheduler/scheduler.js';
import Tile from './tile/tile.js';
import BingProvider from './provider/bing_provider.js';
import { wgs84 } from './coordinates/coordinates.js';


export default class Earth{
	#rootTile = null;
	#scheduler = null;
	#terrain = null;
	#minLevel = 2;
	#maxLevel = 20;
	#loadedTiles = [];
	#addLoadedTile = null;
	#isAdding = false;

	constructor(options = {
		minLevel: 2,
		maxLevel: 20,
		scheduler: new Scheduler(),
		provider: new BingProvider(),
		ellipse: wgs84
	}){
		this.#terrain = new Group();

		this.#rootTile = new Tile(0, 0, 0);

		this.#scheduler = options.scheduler;
		this.#scheduler.setProvider(options.provider);
		this.#addLoadedTile = function(){
			if( this.#isAdding === false ){
				this.#isAdding = true;
				while(this.#loadedTiles.length > 0){
					this.#terrain.add(this.#loadedTiles.pop().getMesh());
				}
				this.#isAdding = false;
			}
			return this;
		}.bind(this);
		this.#scheduler.setFinish(this.#addLoadedTile);

		this.#minLevel = options.minLevel;

		this.#maxLevel = options.maxLevel;

		this.#ellipse = ellipse;

		this.#initBaseTile();
	}

	mountScene(scene){
		scene.add(this.#terrain);
		return this;
	}

	update(camera){
		this.#rootTile.traverse((tile)=>{
			let sub = subdivision(
							camera,
							tile,
							this.#minLevel,
							this.#maxLevel
						);
			if( sub ){
				this.#scheduler.loadTexture(tile);
				this.#loadedTiles.push(tile);
			}
			return sub;
			// return false;
		});
	}

	#initBaseTile(){
		this.#rootTile.traverse((tile)=>{
			// console.log('tile:', tile);
			if( tile.z < this.#minLevel ){
				return true;
			}else if( tile.z === this.#minLevel ){
				this.#scheduler.loadTexture(tile);
				// this.#terrain.add(tile.getMesh());
				this.#loadedTiles.push(tile);
			}
			return false;
		});
	}
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

  const boundingSphere = tile.getMesh().geometry.boundingSphere;
  // console.log('boundingSphere:', boundingSphere);
  const distance = Math.max(
        0.0,
        camera.position.distanceTo(
	        	tile.centerSphere
        	)
        	 - boundingSphere.radius
        );
 	// console.log('distance:', distance);
  // pre-horizon culling
  // console.log('wgs84:', wgs84);
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
  // console.log('geometricError:', tile.geometricError);
  return sseThreshold < preSSE * (tile.geometricError / distance);
}