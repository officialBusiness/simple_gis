import * as THREE from 'three';

const temp = new THREE.Vector3();
const frustum = new THREE.Frustum();
const localViewMatrix = new THREE.Matrix4();
const tempMatrix = new THREE.Matrix4();
const tempBox3d = new THREE.Box3();
const tempSphere3d = new THREE.Sphere();

function _prepareMatrix(matrixWorld, visibilityTestingOffset, volumes3D, tempContainer) {
    if (matrixWorld) {
        tempMatrix.copy(matrixWorld);
    } else {
        tempMatrix.identity();
    }
    if (volumes3D.getCenter) {
        // THREE.Box objects have a .getCenter method
        volumes3D.getCenter(temp);
    } else if (volumes3D.center) {
        // THREE.Sphere objects have a .center property
        temp.copy(volumes3D.center);
    } else {
        throw new Error(`Unsupported volume object ${volumes3D}`);
    }
    // temp is -center
    temp.negate();
    // shift the volumes3D toward origin
    tempContainer.copy(volumes3D);
    tempContainer.translate(temp);

    // modify position: substract camera.position and add box3d.min
    tempMatrix.elements[12] -= visibilityTestingOffset.x + temp.x;
    tempMatrix.elements[13] -= visibilityTestingOffset.y + temp.y;
    tempMatrix.elements[14] -= visibilityTestingOffset.z + temp.z;
}
let _viewMatrix = new THREE.Matrix4();

export function isBox3DVisible(box3d, matrixWorld, camera) {
	let c = camera.matrixWorld.clone();
	c.setPosition({ x: 0, y: 0, z: 0 });

  _viewMatrix.getInverse(c);
  _viewMatrix.premultiply(camera.projectionMatrix);

  _prepareMatrix(matrixWorld, camera.position, box3d, tempBox3d);

  localViewMatrix.multiplyMatrices(_viewMatrix, tempMatrix);
  frustum.setFromMatrix(localViewMatrix);

  return frustum.intersectsBox(tempBox3d);
};
