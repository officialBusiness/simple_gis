import * as THREE from 'three';

import GisMath from '../../core/math.js';

export default class GlobeControls{
	constructor( gisCamera, domElement, earth ){
		let
			coordinatesMatrix = earth.getCoordinatesMatrix(),
			coordinatesMatrixInv = earth.getCoordinatesMatrixInv(),
			ellipse = earth.getEllipse(),

			_mouse = new THREE.Vector2(),
			intersection = null,

			cameraPsotion = new THREE.Vector3(),

			state 

		this.zoomScale = 0.95;
		this.zoomSpeed = 1.0;
		this.enableZoom = true;
		this.enabled = true;

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
					console.log('单击 左键')
					break;
				case 2:
					console.log('双击 右键')
					break;
				default:
					break;
			}

			_mouse.x = ( event.offsetX / domElement.offsetWidth ) * 2 - 1;
			_mouse.y = - ( event.offsetY / domElement.offsetHeight ) * 2 + 1;

			intersection = earth.getMouseIntersection(gisCamera, _mouse);

			if( intersection ){

				domElement.addEventListener( 'pointermove', onPointerMove );
				domElement.addEventListener( 'pointerup', onPointerUp );

			}
		}

		function onPointerMove( event ) {

			if ( this.enabled === false ) return;

			if( intersection ){
				// console.log('intersection');

			}else{


			}
		}

		function onPointerUp( event ) {

	    // removePointer( event );
	    intersection = null;

      domElement.removeEventListener( 'pointermove', onPointerMove );
      domElement.removeEventListener( 'pointerup', onPointerUp );

		}

		function onMouseWheel( event ) {
			if ( this.enabled === false || this.enableZoom === false ) return;
			event.preventDefault();

			_mouse.x = ( event.offsetX / domElement.offsetWidth ) * 2 - 1;
			_mouse.y = - ( event.offsetY / domElement.offsetHeight ) * 2 + 1;

			intersection = earth.getMouseIntersection(gisCamera, _mouse);

			let vector;

			if( intersection ){

				vector = camera.position.clone().sub(intersection).multiplyScalar(0.05);

			}else{

				let center = new THREE.Vector3(0, 0, 0).applyMatrix4(coordinatesMatrix);
				
				vector = camera.position.clone().sub(center).multiplyScalar(0.05);

			}

			if ( event.deltaY < 0 ) {
				vector.negate();
			}

			camera.position.add(vector);
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