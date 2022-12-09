import * as THREE from 'three';

import GisMath from './math.js';

export default class GisCamera extends THREE.PerspectiveCamera{
	constructor(fov, aspect, near, far){
		super(fov, aspect, near, far);
	}

	getMouseRay(mouse){

		let
			origin = new THREE.Vector3(),
			direction = new THREE.Vector3();

		origin.x = direction.x = mouse.x;
		origin.y = direction.y = mouse.y;

		origin.z = -1;
		direction.z = 1;

		GisMath.unproject(origin, this);
		GisMath.unproject(direction, this);

		direction.sub(origin);

		return { origin, direction }
	}
}