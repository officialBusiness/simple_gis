import {
	EventDispatcher,
	MOUSE,
	Quaternion,
	Spherical,
	TOUCH,
	Vector2,
	Vector3
} from 'three';

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class OrbitControls extends EventDispatcher {

	constructor( object, domElement ) {
		console.log('OrbitControls')

		super();

		this.object = object;
		this.domElement = domElement;
		this.domElement.style.touchAction = 'none'; // disable touch scroll

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.05;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.panSpeed = 1.0;
		this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

		// The four arrow keys
		this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

		// Mouse buttons
		this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };

		// Touch fingers
		this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		// the target DOM element for key events
		this._domElementKeyEvents = null;

		//
		// public methods
		//

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function () {

			const offset = new Vector3();

			// so camera.up is the orbit axis
			const quat = new Quaternion().setFromUnitVectors( object.up, new Vector3( 0, 1, 0 ) );
			const quatInverse = quat.clone().invert();

			const lastPosition = new Vector3();
			const lastQuaternion = new Quaternion();

			const twoPI = 2 * Math.PI;

			return function update() {

				const position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );
				// console.log('spherical.radius:', spherical.radius);
				// console.log('spherical.radius * 0.95:', spherical.radius * 0.95);
				// console.log('spherical.radius * scale:', spherical.radius * scale);
				// console.log('scale:', scale);
				// if ( scope.enableDamping ) {

				// 	spherical.theta += sphericalDelta.theta * scope.dampingFactor;
				// 	spherical.phi += sphericalDelta.phi * scope.dampingFactor;

				// } else {

				// 	spherical.theta += sphericalDelta.theta;
				// 	spherical.phi += sphericalDelta.phi;

				// }

				// restrict theta to be between desired limits

				// let min = scope.minAzimuthAngle;
				// let max = scope.maxAzimuthAngle;

				// if ( isFinite( min ) && isFinite( max ) ) {

				// 	if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

				// 	if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

				// 	if ( min <= max ) {

				// 		spherical.theta = Math.max( min, Math.min( max, spherical.theta ) );

				// 	} else {

				// 		spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ?
				// 			Math.max( min, spherical.theta ) :
				// 			Math.min( max, spherical.theta );

				// 	}

				// }

				// restrict phi to be between desired limits
				// spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				// spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// console.log('spherical.radius:', spherical.radius);
				// move target to panned location

				// if ( scope.enableDamping === true ) {

				// 	scope.target.addScaledVector( panOffset, scope.dampingFactor );

				// } else {

				// 	scope.target.add( panOffset );

				// }

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				// if ( scope.enableDamping === true ) {

				// 	sphericalDelta.theta *= ( 1 - scope.dampingFactor );
				// 	sphericalDelta.phi *= ( 1 - scope.dampingFactor );

				// 	panOffset.multiplyScalar( 1 - scope.dampingFactor );

				// } else {

				// 	sphericalDelta.set( 0, 0, 0 );

				// 	panOffset.set( 0, 0, 0 );

				// }

				scale = 1;

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( _changeEvent );

					// lastPosition.copy( scope.object.position );
					// lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function () {

			scope.domElement.removeEventListener( 'wheel', onMouseWheel );

		};

		//
		// internals
		//

		const scope = this;

		const EPS = 0.000001;

		// current position in spherical coordinates
		const spherical = new Spherical();
		const sphericalDelta = new Spherical();

		let scale = 1;
		const panOffset = new Vector3();
		let zoomChanged = false;

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function dollyOut( dollyScale ) {
			scale /= dollyScale;
		}

		function dollyIn( dollyScale ) {
			scale *= dollyScale;
		}

		function handleMouseWheel( event ) {

			if ( event.deltaY < 0 ) {

				dollyIn( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyOut( getZoomScale() );

			}

			scope.update();

		}

		//
		// event handlers - FSM: listen for events and reset state
		//
		function onMouseWheel( event ) {
			event.preventDefault();

			// scope.dispatchEvent( _startEvent );

			handleMouseWheel( event );

			// scope.dispatchEvent( _endEvent );

		}

		scope.domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

		// force an update at start

		this.update();

	}

}

export { OrbitControls };
