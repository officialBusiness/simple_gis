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

		// function onMouseWheel(event){
		// 	// console.log('event:', event);
		// 	event.preventDefault();

		// 	let
		// 		direction = event.deltaY > 0 ? true : false,
		// 		distance, dir;

		// 	_pointer.x = ( event.offsetX / domElement.offsetWidth ) * 2 - 1;
		// 	_pointer.y = - ( event.offsetY / domElement.offsetHeight ) * 2 + 1;

		// 	_raycaster.setFromCamera( _pointer, camera );
		// 	const intersect = _raycaster.intersectObjects( earth.getTerrain().children )[0];

		// 	if( intersect ){
		// 		distance = intersect.distance;
		// 		dir = intersect.point.sub(camera.position).normalize();
		// 	}else{
		// 		distance = camera.position.clone().sub(earth.position).length();
		// 		dir = camera.position.clone().sub(earth.position).normalize();
		// 	}

		// 	if( direction ){
		// 		camera.position.add( dir.multiplyScalar(distance * 0.05) )
		// 	}else{
		// 		camera.position.sub( dir.multiplyScalar(distance * 0.05) )
		// 	}
		// }

		// function onMouseDown(event){

		// }

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