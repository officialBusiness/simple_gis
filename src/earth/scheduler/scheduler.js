import { TextureLoader } from 'three';

const textureLoader = new TextureLoader();

export default class Scheduler{
	#baseTile = [];
	#waitStack = [];
	// #loadStack = [];
	#isLoading = false;
	#onFinish = null;
	#provider = null;

	constructor(){

	}

	setFinish(callback){
		this.#onFinish = callback;
		return this;
	}

	setProvider(provider){
		this.#provider = provider;
		return this;
	}

	loadTexture(tile){
		this.#waitStack.push(tile);
		if( !this.#isLoading ){
			this.#isLoading = true;
			this.#requestTexture();
		}
		return this;
	}

	#requestTexture(){
		if( this.#waitStack.length > 0 ){
			let tile = this.#waitStack.pop();
			// console.log('tile:', tile);
			let	url = this.#provider.getUrl(tile.x, tile.y, tile.z);

			textureLoader.load(url, (texture)=>{
				// console.log('瓦片加载完成:', tile);
				tile.setTexture(texture);

				this.#requestTexture();
			});
		}else{
			this.#isLoading = false;

			if( this.#onFinish ){
				this.#onFinish();
			}
		}
	}
}