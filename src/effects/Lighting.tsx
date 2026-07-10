'use client';

/**
 * Scene lighting configuration.
 * Must be a child of `<Canvas>`.
 *
 * Currently provides a basic directional + point light setup.
 * Future extensions:
 *  - Volumetric lighting
 *  - Light probes
 *  - Dynamic time-of-day lighting
 */
function Lighting() {
  return (
    <>
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        color="#ffffff"
      />
      <pointLight position={[-10, -10, -5]} intensity={0.2} color="#6366f1" />
    </>
  );
}

export { Lighting };
