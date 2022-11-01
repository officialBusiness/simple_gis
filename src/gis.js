import * as THREE from 'three';
import Earth from './earth/earth.js';
import bingLayer from './earth/layer/bing_layer.js';
import { OrbitControls } from './tool/orbit_controls.js';

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
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0xffffff);
		this.renderer.domElement.className = 'simple_gis';
		this.container.appendChild( this.renderer.domElement );

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 60, this.container.clientWidth / this.container.clientHeight, 1, 20000000 );
		this.camera.up.set(0,-1,0);
		this.camera.position.set(0, 13500000, 0);

		this.scene.add( new THREE.AxesHelper( 23500000 ) );

		this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener( 'resize', this.onWindowResize );

		this.animate = this.animate.bind(this);
		requestAnimationFrame( this.animate );
	}
	initEarth(){
		this.earth = new Earth()
									.mountScene(this.scene);
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

	addBingLayer(){
		this.earth.addLayer(bingLayer);
		return this;
	}

	addLayer(url, imageType){

	}
}