import {
	Matrix4,
	Vector3
} from 'three';
import Terrain from './terrain/Terrain.js';
import BingProvider from './provider/bing_provider.js';
import Coordinates from './coordinates/coordinates.js';

export default class Earth{
	#terrain = null;

	constructor(options = {}){
		let
			minLevel = options.minLevel || 1,
			maxLevel = options.maxLevel || 20,
			provider = options.provider || new BingProvider();

		this.#terrain = new Terrain(provider, minLevel, maxLevel);

		if( options.scene ){
			this.#terrain.mountScene(options.scene);
		}

	}

	setProvider(){
		this.#terrain.setProvider(options.provider);
		return this;
	}

	setOriginOfCoordinates(longitude, latitude, height = 0){
		let
			matrix = new Matrix4(),
			cartesian = Coordinates.getCartesianByLL( longitude, latitude, height ),
			up = Coordinates.getCartesianNormal( cartesian.x, cartesian.y, cartesian.z ),
			east = new Vector3( -cartesian.y, cartesian.x, 0 ).normalize(),
			north = new Vector3().crossVectors(up, east);

		matrix.set(
			east.x, north.x, up.x, cartesian.x,
			east.y, north.y, up.y, cartesian.y,
			east.z, north.z, up.z, cartesian.z,
			0, 0, 0, 1,
		).invert();

		this.#terrain.applyMatrix4(matrix);
		return this;
	}

	update(camera){
		this.#terrain.showTiles(camera);
		return this;
	}

}