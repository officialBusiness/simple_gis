
const Mercator = {
	radius: 6378137,
	invFlat: 298.257223563,

	getLongitudeByTileOrder( column, level ){
		return column / (1 << level) * 360 - 180;
	},
	getLatitudeByTileOrder( row, level ){
		return Math.atan( 
							Math.sinh(
								Math.PI * (1 - 2 * row / (1 << level))
							)
						) * 180 / Math.PI;
	},
	getTileOrderByLL(longitude, latitude, level){

    let
    	n = Math.pow(2, level),
    	column = Math.floor(((longitude + 180) / 360) * n),
    	row = Math.floor( (1 - ( Math.log( Math.tan( latitude / 180 * Math.PI ) + (1 / Math.cos( latitude / 180 * Math.PI ) ) ) / Math.PI ) ) / 2 * n );

    return {
    	column, row
    };
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

	getCartesianByLL(longitude, latitude, height = 0){
		let
			a = Mercator.radius,
			b = a * (1 - 1 / Mercator.invFlat),
			e = Math.sqrt(a * a - b * b) / a,
			N = a / Math.sqrt(1 - e * e * Math.sin(latitude * Math.PI / 180) * Math.sin(latitude * Math.PI / 180));

		return {
			x: (N + height) * Math.cos(latitude * Math.PI / 180) * Math.cos(longitude * Math.PI / 180),
			y: (N + height) * Math.cos(latitude * Math.PI / 180) * Math.sin(longitude * Math.PI / 180),
			z: (N * (1 - (e * e)) + height) * Math.sin(latitude * Math.PI / 180)
		}
	},
	getLLByCartesian( x, y, z ){
		let
			a = Mercator.radius,
			b = a * (1 - 1 / Mercator.invFlat),
			
			e = Math.sqrt( a * a - b * b ) / a,
			eprime = Math.sqrt( a * a - b * b ) / b,
			p = Math.sqrt( x * x + y * y ),
			theta = Math.atan(z * a / p / b),
 
			// // 计算经纬度及海拔
			longitude = Math.atan2( y, x ),
			latitude = Math.atan2( z + eprime * eprime * b * Math.pow( Math.sin(theta), 3),
															p - e * e * a * Math.pow( Math.cos(theta), 3)),
			N = a / Math.sqrt( 1 - e * e * Math.sin(latitude) * Math.sin(latitude) ),
			height = p / Math.cos(latitude) - N;

		  longitude = longitude / Math.PI * 180;
		  latitude = latitude / Math.PI * 180;

		return {
			longitude, latitude, height
		}
	},

}

export default Mercator;