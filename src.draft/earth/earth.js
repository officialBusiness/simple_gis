import BingLayer from './provider/bing_provider.js';

export default class Earth{
	#terrain = null
	constructor(){
		this.#terrain = new Group();
		this.provider = new BingLayer().onFinish(()=>{
			this.#terrain.add(tile);
		});

		

	}
	mountScene(scene){
		scene.add(this.#terrain);
		return this;
	}
	getTerrain(){
		return this.#terrain;
	}
	update(camera){

	}
}