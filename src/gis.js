import * as THREE from 'three';
import Earth from './earth/earth.js';
// import { OrbitControls } from '../../examples/jsm/controls/OrbitControls.js';

export default class GisInit{
	constructor(options = {}){
		this.container = options.container ? options.container : document.body;
		this.renderer = new THREE.WebGLRenderer( {
			antialias: true
		} );
		this.renderer.domElement.className = 'simple_gis';
		this.container.appendChild( this.renderer.domElement );

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 60, this.container.clientWidth / this.container.clientHeight, 1, 10000 );
		// this.camera.position.set(0, 0, 1000)

		this.earth = new Earth({
			scene: this.scene
		});

		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener( 'resize', this.onWindowResize );

		this.animate = this.animate.bind(this);
		this.animate();
	}
	onWindowResize(){
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
	}
	animate(){
		if( this.renderer  ){
			requestAnimationFrame( this.animate );
			this.renderer.render( this.scene, this.camera );
			this.earth.update(this.camera);
		}
	}
	destroy(){
		window.removeEventListener( 'resize', this.onWindowResize );

	}
}