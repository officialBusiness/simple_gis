import {
	BufferGeometry,
	Float32BufferAttribute,
} from 'three';

import Mercator from '../../core/coordinate/mercator.js';

export default class TileGeometry extends BufferGeometry{
	constructor(column, row, level){
		super();
		this.type = 'TileGeometry';

		const indices = [];
		const vertices = [];
		const uvs = [];

		let
			minLongitude = Mercator.getLongitudeByTile( column, level ),
			maxLongitude = Mercator.getLongitudeByTile( column + 1, level ),
			minLatitude = Mercator.getLatitudeByTile( row + 1, level ),
			maxLatitude = Mercator.getLatitudeByTile( row, level ),

			minMercatorX = Mercator.getMercatorXByLongitude(minLongitude),
			maxMercatorX = Mercator.getMercatorXByLongitude(maxLongitude),
			minMercatorY = Mercator.getMercatorYByLatitude(minLatitude),
			maxMercatorY = Mercator.getMercatorYByLatitude(maxLatitude),

			wSegment = 64 >> level,
			hSegment = 64 >> level,

			deltaX = ( maxMercatorX - minMercatorX ) / wSegment,
			deltaY = ( maxMercatorY - minMercatorY ) / hSegment,
			deltaU = 1 / wSegment,
			deltaV = 1 / hSegment;

		for( let i = 0; i <= hSegment; i++ ){
			let latitude = Mercator.getLatitudeByMercatorY( maxMercatorY - i * deltaY ),
					v = 1 - i * deltaV;
			for( let j = 0; j <= wSegment; j++ ){
				let { x, y, z } = Mercator.getCartesianByLL(
					Mercator.getLongitudeByMercatorX( minMercatorX + j * deltaX ),
					latitude
				);

				vertices.push(x, y, z);
				uvs.push( j * deltaU, v );
			}			
		}

  for (let i = 0; i < hSegment; i++) {
    for (let j = 0; j < wSegment; j++) {
				let
					idx0 = (wSegment + 1) * i + j,
					idx1 = (wSegment + 1) * ( i + 1 ) + j,
					idx2 = idx1 + 1,
					idx3 = idx0 + 1;
				indices.push(
					// 0 1 2
					idx0, idx1, idx2,
					// 2 3 0
					idx2, idx3, idx0
				);
			}	
		}

		this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
		this.setIndex(indices);
	}
}