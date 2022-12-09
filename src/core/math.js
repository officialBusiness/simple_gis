import * as THREE from 'three';

const _matrix4 = new THREE.Matrix4();
const _projectionMatrixInverse = new THREE.Matrix4();

const GisMath = {
	unproject(v, camera){
		_projectionMatrixInverse.copy( camera.projectionMatrixInverse );
		_matrix4.compose( camera.position, camera.quaternion, camera.scale );

		v.applyMatrix4( _projectionMatrixInverse )
			.applyMatrix4( _matrix4 );

		return v;
	},



	getEllipseIntersection(
		xRadius, yRadius, zRadius,
		origin, direction,
		matrix4
	){
		origin = origin.clone();
		direction = direction.clone();

		origin.x /= xRadius;
		origin.y /= yRadius;
		origin.z /= zRadius;

		direction.x /= xRadius;
		direction.y /= yRadius;
		direction.z /= zRadius;
		direction = direction.normalize();

		let
			ao = new THREE.Vector3(0, 0, 0).sub(origin),
			angle = ao.angleTo(direction),
			lao = ao.length(),
			len = lao * Math.sin(angle);

		if( len > 1 ){
			// console.log('无交点');
			return false;
		}else{
			let p;

			if( len < 1 ){
				let
					len1 = lao * Math.cos(angle),
					len2 = Math.sqrt( 1 - len * len );

				lao < 1 ? len = len1 + len2 : len = len1 - len2;
			}else{
				len = Math.sqrt( lao * lao - 1 );
			}

			p = origin.clone().add( direction.multiplyScalar(len) );
			p.x *= xRadius;
			p.y *= yRadius;
			p.z *= zRadius;
			if( matrix4 ){
				p.applyMatrix4(matrix4);
			}
			return p;
		}
	}
}

export default GisMath;