
const Mercator = {
	// EARTH_RADIUS: 6378137,
	radius: 6378137,

	zeroXCount: 1,
	zeroYCount: 1,

	getTileByLL(x, y, z){
		let n = Math.pow(2, z);
		return {
			longitude: x / n * 360 - 180,
			latitude: Math.atan( 
									Math.sinh(
										Math.PI * (1 - 2 * y / n)
									)
								) * 180 / Math.PI
		};
	},
	getLLByTile(longitude, latitude, z){

	},

	getMercatorRangeByTile(x, y, z){
		// let { longitude, latitude } = getTileLL(x, y, z);
		let 
			n = Math.pow(2, z),
			longitude0 = x / n * 360 - 180,
			longitude1 = (x + 1) / n * 360 - 180,
			latitude0 = Math.atan( Math.sinh( Math.PI * (1 - 2 * (y + 1) / n) ) ) * 180 / Math.PI,
			latitude1 = Math.atan( Math.sinh( Math.PI * (1 - 2 * y / n) ) ) * 180 / Math.PI,

			x0 = Mercator.radius * longitude0 / 180 * Math.PI,
			x1 = Mercator.radius * longitude1 / 180 * Math.PI,
			y0 = Mercator.radius * Math.log( Math.tan( latitude0 / 180 * Math.PI / 2 + Math.PI / 4 ) ),
			y1 = Mercator.radius * Math.log( Math.tan( latitude1 / 180 * Math.PI / 2 + Math.PI / 4 ) );
		return {
			x0, y0, x1, y1
		}
	},

	getMercatorByLL(longitude, latitude){
		return {
			x: Mercator.radius * longitude / 180 * Math.PI,
			y: Mercator.radius * Math.log( Math.tan( latitude / 180 * Math.PI / 2 + Math.PI / 4 ) ),
		}
	},

	getCartesianByLL(longitude, latitude, height = 0){
		let
			r = Mercator.radius + height,
			radianLonDegree = longitude / 180 * Math.PI,
			radianLatDegree = latitude / 180 * Math.PI,
			sin1 = Math.sin(radianLonDegree),
			cos1 = Math.cos(radianLonDegree),
			sin2 = Math.sin(radianLatDegree),
			cos2 = Math.cos(radianLatDegree);
		return {
			x: r * sin1 * cos2,
			y: r * sin2,
			z:r * cos1 * cos2
		}
	},

}

export default Mercator;