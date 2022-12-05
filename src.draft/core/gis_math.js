import {
	Matrix4
} from 'three';

const _matrix4 = /*@__PURE__*/ new Matrix4();
const _projectionMatrixInverse = new Matrix4();

export default {
	unproject(v, camera){

		_projectionMatrixInverse.copy( camera.projectionMatrixInverse );
		_matrix4.compose( camera.position, camera.quaternion, camera.scale );

		v.applyMatrix4( _projectionMatrixInverse )
			.applyMatrix4( _matrix4 );

		return v;
	}

	isVisibleTileFront(camera, tile){
		
	}

	getPointSectionArea(camera, point){
		_matrix4.compose( camera.position, camera.quaternion, camera.scale );

		let
			cameraDirection = new Vector3(- _matrix4.elements[ 8 ], - _matrix4.elements[ 9 ], - _matrix4.elements[ 10 ]).normalize(),
			pointDirection = new Vector3().copy(point).sub(camera.position),
			angle = pointDirection.angleTo(cameraDirection);

		if( angle > Math.PI / 2 ){
			return -1;
		}

		let
			distance = pointDirection.length(),
			projectDistance = distance * Math.cos(angle),
			height = Math.tan(camera.fov / 2) * projectDistance * 2;

		return height * height * camera.aspect;
	}
}