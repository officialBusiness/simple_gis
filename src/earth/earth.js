import Terrain from './terrain/Terrain.js';
import BingProvider from './provider/bing_provider.js';

export default class Earth{
	#terrain = null;

	constructor(options = {}){
		let
			minLevel = options.minLevel || 1,
			maxLevel = options.maxLevel || 20,
			provider = options.provider || new BingProvider();

		this.#terrain = new Terrain(provider, minLevel, maxLevel);

		if( options.scene ){
			this.#terrain.mountScene(options.scene);
		}

	}

	setProvider(){
		this.#terrain.setProvider(options.provider);
		return this;
	}

	update(camera){
		this.#terrain.showTiles(camera);
		return this;
	}

}