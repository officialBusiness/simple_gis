const textureLoader = new TextureLoader();

export default class Provider{
	#waitStack = null
	#isLoading

	#onFinish = null

	constructor(){
		this.#waitStack = [];
		this.#isLoading = false;
	}
	getUrl(){
		return null;
	}
	requestTexture(tiles){
		if( Array.isArray(tiles) ){
			tiles.forEach((tile)=>{
				this.#waitStack.push(tile);
			});
		}else{
			this.#waitStack.push(tile);
		}
		if( !this.#isLoading ){
			this.#isLoading = true;
			this.#loadTexture();
		}
		return this;
	}
	onFinish(callback){
		this.#onFinish = callback;
		return this;
	}
	
	#loadTexture(){
		if( this.#waitStack.length > 0 ){
			let
				tile = this.#loadStack.pop(),
				url = this.getUrl(tile.getX(), tile.getY(), tile.getZ());
			// console.log('加载瓦片:', tile);
			textureLoader.load(url, (texture)=>{
				// console.log('瓦片加载完成:', tile);
				tile.setTexture(texture);
				this.#loadTexture();
			});
		}else{
			this.#isLoading = false;
			this.#onFinish();
		}
	}
}