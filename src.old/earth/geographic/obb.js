import {
	Box3,
	Vector2,
	Vector3,
	Object3D,
    Quaternion,
    Plane
} from 'three';

import Coordinates from './coordinates.js';

function OBB(min, max, lookAt, translate) {
    // this.init(min, max, lookAt, translate);
}

OBB.prototype = Object.create(Object3D.prototype);
OBB.prototype.constructor = OBB;

OBB.prototype.init = function(min, max, lookAt, translate){
    this.box3D = new Box3(min, max);

    this.natBox = this.box3D.clone();

    if (lookAt) {
        // console.log('lookAt:', lookAt);
        this.lookAt(lookAt);
    }


    if (translate) {
        this.translateX(translate.x);
        this.translateY(translate.y);
        this.translateZ(translate.z);
    }

    this.oPosition = new Vector3();

    this.update();

    this.oPosition = this.position.clone();
    this.z = { min: 0, max: 0 };
}

OBB.prototype.update = function update() {
    this.updateMatrixWorld(true);

    this.pointsWorld = this._cPointsWorld(this._points());
};

OBB.prototype.updateZ = function updateZ(min, max) {
    this.z = { min, max };
    return this.addHeight(min, max);
};

OBB.prototype.addHeight = function addHeight(minz, maxz) {
    var depth = Math.abs(this.natBox.min.z - this.natBox.max.z);
    //
    this.box3D.min.z = this.natBox.min.z + minz;
    this.box3D.max.z = this.natBox.max.z + maxz;


    var nHalfSize = Math.abs(this.box3D.min.z - this.box3D.max.z) * 0.5;
    var translaZ = this.box3D.min.z + nHalfSize;
    this.box3D.min.z = -nHalfSize;
    this.box3D.max.z = nHalfSize;

    this.position.copy(this.oPosition);

    this.translateZ(translaZ);

    this.update();

    return new Vector2(nHalfSize - depth * 0.5, translaZ);

    // TODO <---- à vérifier
};

OBB.prototype._points = function _points() {
    var points = [
        new Vector3(),
        new Vector3(),
        new Vector3(),
        new Vector3(),
        new Vector3(),
        new Vector3(),
        new Vector3(),
        new Vector3(),
    ];

    points[0].set(this.box3D.max.x, this.box3D.max.y, this.box3D.max.z);
    points[1].set(this.box3D.min.x, this.box3D.max.y, this.box3D.max.z);
    points[2].set(this.box3D.min.x, this.box3D.min.y, this.box3D.max.z);
    points[3].set(this.box3D.max.x, this.box3D.min.y, this.box3D.max.z);
    points[4].set(this.box3D.max.x, this.box3D.max.y, this.box3D.min.z);
    points[5].set(this.box3D.min.x, this.box3D.max.y, this.box3D.min.z);
    points[6].set(this.box3D.min.x, this.box3D.min.y, this.box3D.min.z);
    points[7].set(this.box3D.max.x, this.box3D.min.y, this.box3D.min.z);

    return points;
};

OBB.prototype._cPointsWorld = function _cPointsWorld(points) {
    var m = this.matrixWorld;

    for (var i = 0, max = points.length; i < max; i++) {
        points[i].applyMatrix4(m);
    }

    return points;
};

// get oriented bounding box of tile
OBB.extentToOBB = function extentToOBB(x, y, z, minHeight = 0, maxHeight = 0) {

    const cardinals = [];


    let
    	minLongitude = Coordinates.getLongitudeByTileOrder( x, z ),
    	maxLongitude = Coordinates.getLongitudeByTileOrder( x + 1, z ),
        longitudeLength = maxLongitude - minLongitude,
    	minLatitude = Coordinates.getLatitudeByTileOrder( y + 1, z ),
    	maxLatitude = Coordinates.getLatitudeByTileOrder( y, z ),
        latitudeLength = maxLatitude - minLatitude,

    	centerWorld = Coordinates.getCartesianByLL(
    		(minLongitude + maxLongitude) / 2, 
    		(minLatitude + maxLatitude) / 2
    	),
    	normal = centerWorld.clone().normalize();

    //      0---1---2
    //      |       |
    //      7   8   3
    //      |       |
    //      6---5---4
    cardinals.push( [minLongitude, minLatitude] );
    cardinals.push( [minLongitude + longitudeLength / 2, minLatitude] );
    cardinals.push( [minLongitude + longitudeLength, minLatitude] );
    cardinals.push( [minLongitude + longitudeLength, minLatitude + latitudeLength / 2] );
    cardinals.push( [minLongitude + longitudeLength, minLatitude + latitudeLength] );
    cardinals.push( [minLongitude + longitudeLength / 2, minLatitude + latitudeLength] );
    cardinals.push( [minLongitude, minLatitude + latitudeLength] );
    cardinals.push( [minLongitude, minLatitude + latitudeLength / 2] );
    cardinals.push( [minLongitude + longitudeLength / 2, minLatitude + latitudeLength / 2] );

    var cardin3DPlane = [];

    var maxV = new Vector3(-1000, -1000, -1000);
    var minV = new Vector3(1000, 1000, 1000);
    var halfMaxHeight = 0;
    var planeZ = new Quaternion();
    var qRotY = new Quaternion();
    var tangentPlaneAtOrigin = new Plane(normal);

    planeZ.setFromUnitVectors(normal, new Vector3(0, 0, 1));
    qRotY.setFromAxisAngle(
        new Vector3(0, 0, 1), -(minLongitude + longitudeLength / 2) / 180 * Math.PI);
    qRotY.multiply(planeZ);

    for (var i = 0; i < cardinals.length; i++) {
        // const cardinal3D = cardinals[i].as('EPSG:4978').xyz();
        const cardinal3D = Coordinates.getCartesianByLL(cardinals[i][0], cardinals[i][1]);
        // console.log('cardinal3D:', cardinal3D);
        // console.log(tangentPlaneAtOrigin.projectPoint(cardinal3D))
        cardin3DPlane.push(tangentPlaneAtOrigin.projectPoint(cardinal3D, new Vector3()));
        const d = cardin3DPlane[i].distanceTo(cardinal3D.sub(centerWorld));
        halfMaxHeight = Math.max(halfMaxHeight, d * 0.5);
        // compute tile's min/max
        cardin3DPlane[i].applyQuaternion(qRotY);
        maxV.max(cardin3DPlane[i]);
        minV.min(cardin3DPlane[i]);
    }

    var halfLength = Math.abs(maxV.y - minV.y) * 0.5;
    var halfWidth = Math.abs(maxV.x - minV.x) * 0.5;
    var max = new Vector3(halfLength, halfWidth, halfMaxHeight);
    var min = new Vector3(-halfLength, -halfWidth, -halfMaxHeight);

    // delta is the distance between line `([6],[4])` and the point `[5]`
    // These points [6],[5],[4] aren't aligned because of the ellipsoid shape
    var delta = halfWidth - Math.abs(cardin3DPlane[5].x);
    var translate = new Vector3(0, delta, -halfMaxHeight);
    var obb = new OBB(min, max, normal, translate);
    // for 3D
    if (minHeight !== 0 || maxHeight !== 0) {
        obb.addHeight(minHeight, maxHeight);
    }
    obb.centerWorld = centerWorld;
    return obb;
};
export default OBB;
