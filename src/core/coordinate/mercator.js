
const Mercator = {
	radius: 6378137,
	invFlat: 298.257223563,

	getLongitudeByTile( column, level ){
		return column / (1 << level) * 360 - 180;
	},
	getLatitudeByTile( row, level ){
		return Math.atan( 
							Math.sinh(
								Math.PI * (1 - 2 * row / (1 << level))
							)
						) * 180 / Math.PI;
	},

	getMercatorXByLongitude( longitude ){
		return Mercator.radius * longitude / 180 * Math.PI;
	},
	getMercatorYByLatitude( latitude ){
		return Mercator.radius * Math.log( Math.tan( ( latitude / 90 + 1 ) * Math.PI / 4 ) );
	},

	getLongitudeByMercatorX( mercatorX ){
		return mercatorX / Mercator.radius / Math.PI * 180;
	},
	getLatitudeByMercatorY( mercatorY ){
		return (2 * Math.atan( Math.pow( Math.E, mercatorY / Mercator.radius ) ) - Math.PI / 2) / Math.PI * 180;
	},

	// getCartesianByLL( longitude, latitude, height = 0 ){
	// 	let
	// 		r = Mercator.radius + height,
	// 		radianLonDegree = longitude / 180 * Math.PI,
	// 		radianLatDegree = latitude / 180 * Math.PI,
	// 		sin1 = Math.sin(radianLonDegree),
	// 		cos1 = Math.cos(radianLonDegree),
	// 		sin2 = Math.sin(radianLatDegree),
	// 		cos2 = Math.cos(radianLatDegree);

	// 	return {
	// 		x: r * sin1 * cos2,
	// 		y: r * sin2,
	// 		z: r * cos1 * cos2
	// 	}
	// },
	getCartesianByLL(longitude, latitude, height = 0){
		let
			a = Mercator.radius,
			f = 1 / Mercator.invFlat,
			b = a * (1 - f),
			e = Math.sqrt(a * a - b * b) / a,
		  N = a / Math.sqrt(1 - e * e * Math.sin(latitude * Math.PI / 180) * Math.sin(latitude * Math.PI / 180));

		return {
			x: (N + height) * Math.cos(latitude * Math.PI / 180) * Math.cos(longitude * Math.PI / 180),
			y: (N + height) * Math.cos(latitude * Math.PI / 180) * Math.sin(longitude * Math.PI / 180),
			z: (N * (1 - (e * e)) + height) * Math.sin(latitude * Math.PI / 180)
		}
	},
	getLLByCartesian( x, y, z ){
		
	},

}

export default Mercator;