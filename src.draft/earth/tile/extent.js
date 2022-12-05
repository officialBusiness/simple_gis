
import Coordinates from '../coordinates/coordinates.js';

export default class Extent{
	constructor(column, row, level){
		// this.minLongitude = Coordinates.getLongitudeByTileOrder( column, level );
		// this.maxLongitude = Coordinates.getLongitudeByTileOrder( column + 1, level );

		// this.minLatitude = Coordinates.getLatitudeByTileOrder( row + 1, level );
		// this.maxLatitude = Coordinates.getLatitudeByTileOrder( row, level );

		// this.minMercatorX = Coordinates.getMercatorXByLongitude(minLongitude);
		// this.maxMercatorX = Coordinates.getMercatorXByLongitude(maxLongitude);

		// this.minMercatorY = Coordinates.getMercatorYByLatitude(minLatitude);
		// this.maxMercatorY = Coordinates.getMercatorYByLatitude(maxLatitude);

		this.#east = Coordinates.getLongitudeByTileOrder( column + 1, level );	//	max
		this.#west = Coordinates.getLongitudeByTileOrder( column, level );			//	min

		this.#north = Coordinates.getLatitudeByTileOrder( row, level );					//	max
		this.#sourth = Coordinates.getLatitudeByTileOrder( row + 1, level );		//	min


		this.#eastMercator = Coordinates.getMercatorXByLongitude(#east);
		this.#westMercator = Coordinates.getMercatorXByLongitude(#west);

		this.#northMercator = Coordinates.getMercatorYByLatitude(#north);
		this.#sourthMercator = Coordinates.getMercatorYByLatitude(#sourth);
	}

	north(){// 北
		return this.#north;
	}
	sourth(){// 南
		return this.#sourth;
	}
	west(){// 西
		return this.#west;
	}
	east(){// 东
		return this.#east;
	}
}