import {
	BufferGeometry,
	Float32BufferAttribute,
	Vector3
} from 'three';

import Coordinates from '../coordinates/coordinates.js';

export default class TileGeometry extends BufferGeometry{
	constructor(extent, level){
		super();
		this.type = 'TileGeometry';

		const indices = [];
		const vertices = [];
		const uvs = [];

		let
			{ minLongitude, maxLongitude, minLatitude, maxLatitude } = extent,

			minMercatorX = Coordinates.getMercatorXByLongitude(minLongitude),
			maxMercatorX = Coordinates.getMercatorXByLongitude(maxLongitude),
			minMercatorY = Coordinates.getMercatorYByLatitude(minLatitude),
			maxMercatorY = Coordinates.getMercatorYByLatitude(maxLatitude),

			wSegment = Math.max( 64 >> level, 1),
			hSegment = Math.max( 64 >> level, 1),

			deltaX = ( maxMercatorX - minMercatorX ) / wSegment,
			deltaY = ( maxMercatorY - minMercatorY ) / hSegment,
			deltaU = 1 / wSegment,
			deltaV = 1 / hSegment;

		for( let i = 0; i <= hSegment; i++ ){
			let latitude = Coordinates.getLatitudeByMercatorY( maxMercatorY - i * deltaY ),
					v = 1 - i * deltaV;
			for( let j = 0; j <= wSegment; j++ ){
				let vector = Coordinates.getCartesianByLL(
					Coordinates.getLongitudeByMercatorX( minMercatorX + j * deltaX ),
					latitude
				);
				extent.vectors.push(vector);
				vertices.push(vector.x, vector.y, vector.z);
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

		// this.computeBoundingBox();
		this.computeBoundingSphere();
	}
}