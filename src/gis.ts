import {
	Scene
} from '../../libs/three.module';

import Earth from './earth/earth';


export class Gis{
	private earth: Earth;

	private scene: Scene;

	constructor(options: Object = {}){

		this.earth = new Earth({});

	}

}