import {
	Matrix4,
	Vector3
} from 'three';
import Terrain from './terrain/Terrain.js';
import BingProvider from './provider/bing_provider.js';
import Coordinates, { wgs84 } from './coordinates/coordinates.js';
import GisMath from '../core/math.js';

let _camera = null; 

export default class Earth{
	#terrain = null;
	#scene = null;

	constructor(options = {}){
		let
			minLevel = options.minLevel || 1,
			maxLevel = options.maxLevel || 19,
			provider = options.provider || new BingProvider();

		this.#terrain = new Terrain(provider, minLevel, maxLevel);

		if( options.scene ){
			this.#scene = scene;
			this.#terrain.mountScene(options.scene);
		}

		if( options.ellipse ){
			this.ellipse = options.ellipse;
		}else{
			this.ellipse = wgs84;
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
		this.matrix = matrix;
		this.matrixInv = matrix.clone().invert();

		return this;
	}

	getCoordinatesMatrix(){
		return this.matrix;
	}

	getCoordinatesMatrixInv(){
		return this.matrixInv;
	}

	getEllipse(){
		return this.ellipse;
	}

	add(obj){
		this.#scene.add(obj);
		return this;
	}

	getMouseIntersection(gisCamera, mouse){
		let ray = gisCamera.getMouseLine(mouse);

		ray.origin.applyMatrix4(this.matrixInv);
		ray.destination.applyMatrix4(this.matrixInv);

		ray.direction = new Vector3().copy(ray.destination).sub(ray.origin);

		ray.direction.normalize();

		return this.getRayIntersection(ray.origin, ray.direction);
	}

	getRayIntersection(origin, direction){

		return GisMath.getEllipseIntersection(
			this.ellipse.x, this.ellipse.y, this.ellipse.z,
			origin, direction, this.matrix
		);
	}

	update(camera){
		_camera = camera.clone();
		_camera.applyMatrix4(this.matrixInv);

		_camera.updateWorldMatrix();

		this.#terrain.showTiles(_camera);

		return this;
	}

}