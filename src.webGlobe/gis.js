import * as THREE from 'three';
import Earth from './earth/earth.js';

export default class GisInit{
	constructor(container = document.body){
		this.initScene(container);

		this.initEarth();
	}
	initScene(container){
		this.container = container;
		this.renderer = new THREE.WebGLRenderer( {
			antialias: true
		} );
		this.renderer.domElement.className = 'simple_gis';
		this.container.appendChild( this.renderer.domElement );

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 60, this.container.clientWidth / this.container.clientHeight, 1, 10000 );

		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener( 'resize', this.onWindowResize );

		this.animate = this.animate.bind(this);
		requestAnimationFrame( this.animate );
	}
	initEarth(){
		this.earth = new Earth({
			scene: this.scene
		});
	}
	initEvent(){

	}
	onWindowResize(){
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
	}
	animate(){
		requestAnimationFrame( this.animate );
		this.renderer.render( this.scene, this.camera );
		this.earth.update(this.camera);
	}
	destroy(){
		window.removeEventListener( 'resize', this.onWindowResize );
	}

	addLayer(){

	}
}