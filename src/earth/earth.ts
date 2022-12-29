import {
	Matrix4
} from '../../libs/three.module';



export default class Earth{

	private minLevel: number = 1;
	private maxLevel: number = 19;

	private matrix: Matrix4 = new Matrix4();
	private matrixInv: Matrix4 = new Matrix4();

	constructor( options: Object ){

	}

	setOrigin(longitude: number, latitude: number, height: number = 0){
		let
			cartesian = Coordinates.getCartesianByLL( longitude, latitude, height ),
			up = Coordinates.getCartesianNormal( cartesian.x, cartesian.y, cartesian.z ),
			east = new Vector3( -cartesian.y, cartesian.x, 0 ).normalize(),
			north = new Vector3().crossVectors(up, east);

		this.matrix.set(
			east.x, north.x, up.x, cartesian.x,
			east.y, north.y, up.y, cartesian.y,
			east.z, north.z, up.z, cartesian.z,
			0, 0, 0, 1,
		).invert();

		this.matrixInv.copy(this.matrix).invert();

		return this;
	}
}