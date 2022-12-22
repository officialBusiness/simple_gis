import * as THREE from 'three';

import GisMath from './math.js';

export default class GisCamera extends THREE.PerspectiveCamera{
	constructor(fov, aspect, near, far){
		super(fov, aspect, near, far);
	}

	getMouseLine(mouse){

		let
			origin = new THREE.Vector3(),
			destination = new THREE.Vector3();

		origin.x = destination.x = mouse.x;
		origin.y = destination.y = mouse.y;

		origin.z = -1;
		destination.z = 1;

		GisMath.unproject(origin, this);
		GisMath.unproject(destination, this);

		// direction.sub(origin);

		return { origin, destination }
	}
}