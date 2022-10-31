
const Mercator = {
	// EARTH_RADIUS: 6378137,
	radius: 6378137,

	zeroXCount: 1,
	zeroYCount: 1,

	getTileLL(x, y, z){
		let n = Math.pow(2, z);
		return {
			longitude: x / n * 360.0 - 180.0,
			latitude: Math.atan( 
									Math.sinh(
										Math.PI * (1 - 2 * y / n)
									)
								) * 180.0 / Math.PI
		};
	},
	getLLTile(longitude, latitude, z){

	},

	

}

export default Mercator;