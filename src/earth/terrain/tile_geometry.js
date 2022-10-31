import {
	BufferGeometry,
	MathUtils,
	Vector3,
} from 'three';
import Mercator from '../../coordinate/mercator.js';

export default class TileGeometry extends BufferGeometry{
	constructor(x, y, z){
		super();
		this.type = 'TileGeometry';

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		let 
			number = 1 << z,
			bound = Mercator.maximumRadius * Math.PI,
			fragment = bound * 2 / number,

			west = (-bound + x * fragment) / Mercator.maximumRadius,
			east = (-bound + (x + 1) * fragment) / Mercator.maximumRadius,
			north = Mercator.mercatorTolatitude((bound - y * fragment) / Mercator.maximumRadius) ,
			sourth = Mercator.mercatorTolatitude((bound - (y + 1) * fragment) / Mercator.maximumRadius),

			width = 16,
			height = 16,

			gX = ( east - west ) / ( width - 1 ),
			gY = ( north - sourth ) / ( height - 1 ),
			center = getCenter(west, east, north, sourth),

			lonScalar = 1 / ( east - west ),
			latScalar = 1 / ( north - sourth );

		for( let row = 0; row < width; row ++ ){
			const
				latitude = north - gY * row,
				cosLatitude = cos(latitude),
				nZ = Math.sin(latitude),
				kZ = Mercator.radiiSquared.z * nZ,
				geographicV = (latitude - sourth) * latScalar;

			for( let column = 0; column < height; column++ ){
				const
					longitude = west + gX * column,
					nX = cosLatitude * cos(longitude),
					nY = cosLatitude * sin(longitude),
					kX = Mercator.radiiSquared.x * nX,
					kY = Mercator.radiiSquared.y * nY,
					gamma = Math.sqrt(kX * nX + kY * nY + kZ * nZ),
					rX = kX / gamma,
					rY = kY / gamma,
					rZ = kZ / gamma;

				vertices.push(
					rX - center.x,
					rY - center.y,
					rZ - center.z,
				);

				geographicU = (longitude - west) * lonScalar;
				uvs.push(geographicU, geographicV);
			}
		}

		let index = 0,
				indicesIndex = 0;
		for( let i = 0; i < height - 1; i++ ){
			for( let j = 0; j < width - 1; j++ ){
				indices.push(
					index, index + width, index + 1,
					index + 1, index + width, index + width + 1,
	 			);
				index ++;
			}
			index ++;
		}


		this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
	}
}

function getCenter(west, east, north, sourth){
	if( east < west ){
		east += Math.PI * 2;
	}
	const
		longitude = negativePiToPi((west + east) / 2),
		latitude = ( sourth + north ) / 2,

		n = new THREE.Vector3(
			Math.cos(latitude) * Math.cos(longitude),
			Math.cos(latitude) * Math.sin(longitude),
			Math.sin(latitude)
		).normalize(),

		k = new Vector3().multiplyVectors( Mercator.radiiSquared, n),
		gamma = Math.sqrt(n.dot(k));

	k = k.divideScalar(gamma);
	n = n.multiplyScalar(0)

	return new Vector3().addVectors(k, n);
}

function negativePiToPi(angle){
	return ZeroToTwoPi(angle + Math.PI) - Math.PI;
}

function ZeroToTwoPi(angle){
	const mod = MathUtils.euclideanModulo(angle, Math.PI * 2);
	if(Math.abs(mod) < 0.000000000000001 && Math.abs(angle) > 0.000000000000001){
		return Math.PI * 2;
	}
	return mod;
}
