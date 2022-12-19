import * as THREE from 'three';

import GisMath from '../../core/math.js';
import Coordinates from '../coordinates/coordinates.js';

const _mouseButtons = {
	LEFT: 0,
	MIDDLE: 1,
	RIGHT: 2
}

const STATE = {
	NONE: -1,
	PAN: 0,
	ZOOM: 1,
	ROTATE: 2,
}

export default class GlobeControls{
	constructor( gisCamera, domElement, earth ){
		let
			coordinatesMatrix = earth.getCoordinatesMatrix(),
			coordinatesMatrixInv = earth.getCoordinatesMatrixInv(),
			ellipse = earth.getEllipse(),

			_startMouse = new THREE.Vector2(),
			_nowMouse = new THREE.Vector2(),

			intersection = null,

			_quaternion = new THREE.Quaternion(),

			cameraPsotion = new THREE.Vector3(),
			earthCenter = new THREE.Vector3(),

			xAxis = new THREE.Vector3(1, 0, 0),
			yAxis = new THREE.Vector3(0, 1, 0),
			zAxis = new THREE.Vector3(0, 0, 1),



			nowXAngle = 0,
			nowYAngle = 0,
			nowZAngle = 0,

			state 

		this.zoomScale = 0.95;
		this.zoomSpeed = 1.0;
		this.enableZoom = true;
		this.enabled = true;


		earth.update(gisCamera);
					
		this.update = function () {

		}

		function onContextMenu( event ) {

			if ( this.enabled === false ) return;

			event.preventDefault();

		}

		function onPointerDown( event ){
			
			if ( this.enabled === false ) return;

			// console.log('event:', event);
			switch( event.button ){
				case 0:
					// console.log('单击 左键');
					state = STATE.PAN;
					break;
				case 1:
					state = STATE.ZOOM;
					break;
				case 2:
					// console.log('双击 右键');
					state = STATE.ROTATE;
					break;
				default:
					break;
			}

			_startMouse.x = ( event.offsetX / domElement.offsetWidth ) * 2 - 1;
			_startMouse.y = - ( event.offsetY / domElement.offsetHeight ) * 2 + 1;

			intersection = earth.getMouseIntersection(gisCamera, _startMouse);

			if( intersection ){


				domElement.addEventListener( 'pointermove', onPointerMove );
				domElement.addEventListener( 'pointerup', onPointerUp );

			}
		}

		function onPointerMove( event ) {

			if ( this.enabled === false ) {
				return;
			}

			_nowMouse.x = ( event.offsetX / domElement.offsetWidth ) * 2 - 1;
			_nowMouse.y = - ( event.offsetY / domElement.offsetHeight ) * 2 + 1;

			intersection = earth.getMouseIntersection(gisCamera, _startMouse);

			if( state === STATE.PAN ){

				if( intersection ){

					let
						nowIntersection = earth.getMouseIntersection(gisCamera, _nowMouse);

					if( nowIntersection ){

						earthCenter.set(0, 0, 0).applyMatrix4(coordinatesMatrix);
						
						cameraPsotion.copy(gisCamera.position);

						let
							sV = intersection.clone().sub(earthCenter),
							eV = nowIntersection.clone().sub(earthCenter),
							angle = sV.angleTo(eV),
							axis = sV.clone().cross(eV).normalize(),

							v = cameraPsotion.clone().sub(earthCenter);

						_quaternion.setFromAxisAngle(axis, -angle);

						cameraPsotion.sub(v);
						v.applyQuaternion(_quaternion);
						cameraPsotion.add(v);

						gisCamera.applyQuaternion(_quaternion);
						gisCamera.position.copy(cameraPsotion);

						_startMouse.copy(_nowMouse);

						earth.update(gisCamera);
					}

				}

			}else if( state === STATE.ZOOM ){




			}else if( state = STATE.ROTATE ){

				let
					rZ = ( _nowMouse.x - _startMouse.x ) * Math.PI / 2,
					rX = ( _nowMouse.y - _startMouse.y ) * Math.PI / 2;


				if( intersection ){

					let
						v = gisCamera.position.clone().sub(intersection);

					// console.log(v.length());
					cameraPsotion.copy( gisCamera.position );

					_quaternion.setFromAxisAngle( xAxis, nowXAngle - rX );

					cameraPsotion.sub( v );
					v.applyQuaternion(_quaternion);
					cameraPsotion.add( v );

					xAxis.applyQuaternion(_quaternion);
					yAxis.applyQuaternion(_quaternion);
					zAxis.applyQuaternion(_quaternion);

					gisCamera.applyQuaternion(_quaternion);
					gisCamera.position.copy(cameraPsotion);

					nowXAngle = rX;


					earthCenter.set(0, 0, 0).applyMatrix4(coordinatesMatrix);

					let axis = intersection.clone().sub(earthCenter);
					axis.normalize();

					_quaternion.setFromAxisAngle( axis, nowZAngle - rZ );

					v = gisCamera.position.clone().sub(intersection);

					cameraPsotion.sub( v );
					v.applyQuaternion( _quaternion );
					cameraPsotion.add( v );

					xAxis.applyQuaternion(_quaternion);
					yAxis.applyQuaternion(_quaternion);
					zAxis.applyQuaternion(_quaternion);

					gisCamera.applyQuaternion(_quaternion);
					gisCamera.position.copy(cameraPsotion);

					nowZAngle = rZ;

					earth.update(gisCamera);
					// console.log('gisCamera.position:', JSON.stringify(gisCamera.position, null, 4))
					// console.log('gisCamera.rotation:', JSON.stringify(gisCamera.rotation, null, 4))
					// console.log('axis:', JSON.stringify(axis.normalize(), null, 4))
				}else{


				}

			}

		}

		function onPointerUp( event ) {

	    // removePointer( event );
	    intersection = null;

	    state = STATE.NONE;

      domElement.removeEventListener( 'pointermove', onPointerMove );
      domElement.removeEventListener( 'pointerup', onPointerUp );

      nowXAngle = 0;
      nowZAngle = 0;
		}

		function onMouseWheel( event ) {
			if ( this.enabled === false || this.enableZoom === false ) return;
			event.preventDefault();

			_nowMouse.x = ( event.offsetX / domElement.offsetWidth ) * 2 - 1;
			_nowMouse.y = - ( event.offsetY / domElement.offsetHeight ) * 2 + 1;

			intersection = earth.getMouseIntersection(gisCamera, _nowMouse);

			earthCenter.set(0, 0, 0).applyMatrix4(coordinatesMatrix);

			let
				scale = ( event.deltaY > 0 ? 0.05 : -0.05 );
				
			if( intersection ){
				// console.log('intersection:', JSON.stringify(intersection, null, 2));

				// console.log('earthCenter:', JSON.stringify(earthCenter, null, 2));

				cameraPsotion.copy( gisCamera.position );

				let
					cameraPsotionClone = cameraPsotion.clone().applyMatrix4(coordinatesMatrixInv),
					cameraPsotionLL = Coordinates.getLLByCartesian(cameraPsotionClone.x, cameraPsotionClone.y, cameraPsotionClone.z);
				// console.log(cameraPsotionLL)
				if( event.deltaY < 0 && cameraPsotionLL.height < 100 ){
					return;
				}
				let
					v1 = new THREE.Vector3().subVectors(intersection, earthCenter),
					v2 = new THREE.Vector3().subVectors(cameraPsotion, earthCenter),
					v3 = new THREE.Vector3().subVectors(cameraPsotion, intersection),

					l1 = v1.length(),
					l2 = v2.length(),
					sub = cameraPsotionLL.height * scale,
					nl2 = l2 + sub,
					l3 = v3.length(),

					a1 = v2.angleTo(v3),
					a2 = Math.PI - v1.angleTo(v3),
					a3 = v1.angleTo(v2),

					axis = v1.clone().cross(v2).normalize(),

					na3 = Math.asin( Math.sin( a1 ) / l1 * nl2 ) - a1;

				_quaternion.setFromAxisAngle( axis , -a3 + na3 );

				cameraPsotion
					.sub(earthCenter)
					.applyQuaternion( _quaternion )
					.normalize()
					.multiplyScalar(nl2)
					.add(earthCenter);

				gisCamera.position.copy(cameraPsotion);
				gisCamera.lookAt(earthCenter);

			}else{

				let vector = gisCamera.position.clone().sub(earthCenter).multiplyScalar(scale);

				gisCamera.position.add(vector);

			}


			earth.update(gisCamera);

		}

		domElement.addEventListener( 'contextmenu', onContextMenu );

		domElement.addEventListener( 'pointerdown', onPointerDown );
		// domElement.addEventListener( 'pointercancel', onPointerCancel );
		domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

		this.dispose = function () {

			domElement.removeEventListener( 'contextmenu', onContextMenu );

			domElement.removeEventListener( 'pointerdown', onPointerDown );
			// domElement.removeEventListener( 'pointercancel', onPointerCancel );
			domElement.removeEventListener( 'wheel', onMouseWheel );

			// domElement.removeEventListener( 'pointermove', onPointerMove );
			// domElement.removeEventListener( 'pointerup', onPointerUp );

		};
	}

}