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
}