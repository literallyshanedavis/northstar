import { OrbitControls, useFBO, StatsGl } from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  createPortal,
} from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import SimulationMaterial from "./SimulationMaterial";

// import { useTheme } from "next-themes";

import vertexShader from "./render_vs";
import fragmentShader from "./render_fs";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";

extend({ SimulationMaterial: SimulationMaterial });

const FBOParticles = () => {
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert the mouse position to normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      // Update a uniform or a state that will be passed to your shader
      updateMousePosition(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // const size = 300;
  const size = 662;

  const points = useRef();
  const simulationMaterialRef = useRef();

  const scene = new THREE.Scene();
  const orthCamera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );
  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const { color } = useControls({ color: "#ffffff" });

  // useEffect(() => {
  //   points.current.material.uniforms.big.value = new THREE.Color(color);
  // }, [color]);

  const mouseUniform = new THREE.Vector2(0, 0);

  const updateMousePosition = (x, y) => {
    // console.log("mouse x", x);
    // console.log("mouse y ", y);
    // points.current.material.uniforms.uMouse.value = new THREE.Vector2(x, y);
    mouseUniform.set(x, y);
    // console.log("mouseUniform", mouseUniform);
  };

  useEffect(() => {
    if (
      mouseUniform &&
      simulationMaterialRef.current &&
      simulationMaterialRef.current.uniforms.uMouse
    ) {
      simulationMaterialRef.current.uniforms.uMouse.value = mouseUniform;
    }
  }, [mouseUniform]);

  const uniforms = useMemo(
    () => ({
      positions: {
        value: null,
      },
      uMouse: { type: "v2", value: mouseUniform },
      dispersionStrength: { value: 2000.0 },
      pointSize: { type: "f", value: 4.0 },
      mouseEffectRadius: { type: "f", value: 100.2 },
      big: {
        type: "v3",
        // value: new THREE.Color(color),
        value: new THREE.Vector3(0.233, 0.273, 0.869),
      },
      small: {
        type: "v3",
        value: new THREE.Vector3(120, 120, 255),
      },
      nearFar: { type: "v2", value: new THREE.Vector2(150, 500) },
    }),
    [mouseUniform]
  );


  useFrame((state) => {
    const { gl, clock, camera } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, orthCamera);
    gl.setRenderTarget(null);

    if (points.current && simulationMaterialRef.current) {
      points.current.material.uniforms.positions.value = renderTarget.texture;
      points.current.rotation.x =
        ((Math.cos(clock.getElapsedTime()) * Math.PI) / 180) * 2;
      points.current.rotation.y -= (Math.PI / 180) * 0.05;
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
      simulationMaterialRef.current.uniforms.uMouse.value = mouseUniform;
    }
  });

  const frequency = useControls("frequency", {
    value: 0.013,
    min: 0,
    max: 0.1,
    step: 0.001,
  });
  const amplitude = useControls("amplitude", { value: 36, min: 0, max: 128 });
  const maxDistance = useControls("maxDistance", {
    value: 36,
    min: 0,
    max: 128,
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial
            ref={simulationMaterialRef}
            args={[size, frequency, amplitude, maxDistance, mouseUniform]}
          />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

const CameraSetup = () => {
  const { cameraX, cameraY, cameraZ } = useControls({
    cameraX: { value: -90, min: -1000, max: 1000, step: 10 },
    cameraY: { value: 0, min: -1000, max: 1000, step: 10 },
    cameraZ: { value: 230, min: -1000, max: 1000, step: 10 },
  });
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(cameraX, cameraY, cameraZ);
    // camera.lookAt(0, 0, 0); // Adjust this target as needed
  }, [camera, cameraX, cameraY, cameraZ]);

  return null;
};

const Scene = () => {
  const { luminanceThreshold, luminanceSmoothing, bloomHeight } = useControls({
    luminanceThreshold: {
      value: 0.9,
      min: 0,
      max: 1,
      step: 0.01,
    },
    luminanceSmoothing: {
      value: 0.9,
      min: 0,
      max: 1,
      step: 0.01,
    },
    bloomHeight: {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
    },
  });
  return (
    <Canvas
    //   camera={{ position: [-200, 0, 400], fov: 80, near: 1, far: 1000 }}
    //   camera={{ position: [8.5, 8.5, 0.0] }}
    // style={{ background: "#1c1c1c" }}
    >
      <CameraSetup />
      {/* <StatsGl className="stats" /> */}
      {/* <perspectiveCamera
        fov={80}
        aspect={window.innerWidth / window.innerHeight}
        near={1}
        far={1000}
        position={[20, 100, 400]}
      /> */}
      <FBOParticles /> 
       <EffectComposer>
        {/* <Bloom
          luminanceThreshold={luminanceThreshold}
          luminanceSmoothing={luminanceSmoothing}
          height={bloomHeight}
        />  */}
        <ChromaticAberration offset={[0.0005, 0.0012]} />
      </EffectComposer> 
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default Scene;
