import {
	BufferGeometry,
	Float32BufferAttribute,
} from 'three';

import Mercator from '../../core/coordinate/mercator.js';

export default class TileGeometry extends BufferGeometry{
	constructor(x, y, z){
		console.log('x:', x, 'y:', y, 'z:', z);
		super();
		this.type = 'TileGeometry';

		const indices = [];
		const vertices = [];
		const uvs = [];

		let
			n = Math.pow(2, z),
			longitude0 = x / n * 360 - 180,
			longitude1 = (x + 1) / n * 360 - 180,
			latitude0 = Math.atan( Math.sinh( Math.PI * (1 - 2 * (y + 1) / n) ) ) * 180 / Math.PI,
			latitude1 = Math.atan( Math.sinh( Math.PI * (1 - 2 * y / n) ) ) * 180 / Math.PI,

			{ x0, y0, x1, y1 } = Mercator.getMercatorRangeByTile(x, y, z);

		// console.log('longitude0:', longitude0, 'longitude1:', longitude1, 'latitude0:', latitude0, 'latitude1:', latitude1);
		// console.log('x0:', x0, 'x1:', x1, 'y0:', y0, 'y1:', y1);

		const
			segment = 32,
			deltaX = ( longitude1 - longitude0 ) / segment,
			deltaY = ( latitude1 - latitude0 ) / segment,
			deltaUV = 1 / segment;

		for( let i = 0; i <= segment; i++ ){
			for( let j = 0; j <= segment; j++ ){
				let { x, y, z } = Mercator.getCartesianByLL(
					longitude0 + j * deltaX,
					latitude1 - i * deltaY
				);
				// console.log('longitude:', longitude0 + j * deltaX, 'latitude:', latitude1 - i * deltaY);
				vertices.push(x, y, z);
				uvs.push( j * deltaUV, 1 - i * deltaUV );
			}			
		}

		for( let i = 0; i < segment; i++ ){
			for( let j = 0; j < segment; j++ ){
				let
					idx0 = (segment + 1) * i + j,
					idx1 = (segment + 1) * ( i + 1 ) + j,
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
		// console.log('vertices:', JSON.stringify(vertices, null, 4));

		this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
	}
}