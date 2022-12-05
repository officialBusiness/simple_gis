import extent from './extent.js';

export default class Tile{
	#x
	#y
	#z
	#extent = null
	#children = null

	constructor(x, y, z, parent){
		this.#x = x;
		this.#y = y;
		this.#z = z;

		this.#extent = new Extent(x, y, z);

		if( #parent ){
			this.#parent = parent;
		}
	}

	getParent(){
		if( this.#parent ){
			return this. #parent;
		}
		return null;
	}
	getChildren(){
		if( this.#children === null ){
			this.#children = [
				new Tile(
					this.#x << 1,
					this.#y << 1,
					this.#z + 1,
					this
				),
				new Tile(
					this.#x << 1 | 1,
					this.#y << 1,
					this.#z + 1,
					this
				),
				new Tile(
					this.#x << 1,
					this.#y << 1 | 1,
					this.#z + 1,
					this
				),
				new Tile(
					this.#x << 1 | 1,
					this.#y << 1 | 1,
					this.#z + 1,
					this
				)
			];
		}
		return this.#children;
	}

	getX(){
		return this.#x;
	}
	getY(){
		return this.#y;
	}
	getZ(){
		return this.#z;
	}

	setTexture(texture){

	}
}

export function createRootTile(){
	return new Tile(0, 0, 0);
}