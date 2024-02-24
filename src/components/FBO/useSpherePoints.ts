import * as THREE from "three";

export const useSpherePoints = (count, size) => {
  const getPoint = (v, size) => {
    v.x = Math.random() * 2 - 1;
    v.y = Math.random() * 2 - 1;
    v.z = Math.random() * 2 - 1;
    if (v.length() > 1) return getPoint(v, size);
    return v.normalize().multiplyScalar(size);
  };

  const data = new Float32Array(count * 4); // update to * 4
  const p = new THREE.Vector3();
  for (let i = 0; i < data.length; i += 3) {
    getPoint(p, size);
    data[i] = p.x;
    data[i + 1] = p.y;
    data[i + 2] = p.z;
    data[i + 3] = 1;
  }

  return data;
};
