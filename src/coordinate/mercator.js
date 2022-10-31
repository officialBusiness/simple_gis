import {
	Vector3
} from 'three';

export default {
	earthRadius: 6378137,
	invFlattening: 298.257223563,
	minimumRadius: 6356752.314245179,// earthRadius - earthRadius / invFlattening
	maximumRadius: 6378137,
		
	radiiSquared: new Vector3( 6378137*6378137, 6378137*6378137, 6356752.314245179 * 6356752.314245179),

	latitudeToMercator(){

	},

	mercatorTolatitude(mercator){
		return Math.PI * 0.5 - ( 2.0 * Math.atan( Math.exp( -mercator ) ) );
	}

}