import simulationVertexShader from "./simulation_vs";
import simulationFragmentShader from "./simulation_fs";
import * as THREE from "three";
import { useSpherePoints } from "./useSpherePoints";

const width = 512; // Texture width
const height = 512; // Texture height
const size = width * height;

const spherePoints = useSpherePoints(size, 128);
class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(
    size: number,
    frequency: number,
    amplitude: number,
    maxDistance: number,
    mouse: THREE.Vector2 // Add this
  ) {
    const positionsTexture = new THREE.DataTexture(
      //   getRandomData(512, 512),
      spherePoints,
      // data,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType,
      THREE.RepeatWrapping
    );
    positionsTexture.needsUpdate = true;

    const simulationUniforms = {
      uTexture: { value: positionsTexture },
      uTime: { value: 0 },
      frequency: { type: "f", value: frequency.value },
      amplitude: { type: "f", value: amplitude.value },
      maxDistance: { type: "f", value: maxDistance.value },
      uMouse: { value: mouse.value }, // Add mouse uniform
      mouseEffectRadius: { value: 100.0 }, // Add radius uniform
      dispersionStrength: { value: 100.0 },
    };

    super({
      uniforms: simulationUniforms,
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }
}

export default SimulationMaterial;
