import {
	Raycaster,
	Vector2,
	Vector3
} from 'three';

const _raycaster = new Raycaster();
const _pointer = new Vector2();


export default class GlobeControls{
	target = new Vector3()

	constructor(camera, earth, domElement){


		// domElement.addEventListener( 'mousedown', onMouseDown );
		domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

		this.dispose = function () {
			domElement.removeEventListener('wheel', onMouseWheel);
		}
	}
	setTarget(x, y, z){
		this.target.x = x;
		this.target.y = y;
		this.target.z = z;
		return ;
	}
}