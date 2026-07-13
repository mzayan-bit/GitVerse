import * as THREE from 'three';
import { OrbitConfig } from './SolarSystemTypes';

export class OrbitMechanics {
  /**
   * Calculates the position of a planet on its orbit at a given time.
   */
  static getPositionAtTime(
    config: OrbitConfig,
    time: number,
    timeScale: number = 1.0
  ): THREE.Vector3 {
    // Current angle along the orbit
    const angle =
      config.initialAngle + time * config.speed * config.direction * timeScale;

    // Position on the 2D elliptical plane (X-Z plane usually)
    const x = Math.cos(angle) * config.radiusX;
    const z = Math.sin(angle) * config.radiusZ;

    const position = new THREE.Vector3(x, 0, z);

    // Apply inclination (tilt relative to the sun's equator, tilting around X axis for simplicity)
    const euler = new THREE.Euler(config.inclination, 0, 0, 'XYZ');
    position.applyEuler(euler);

    return position;
  }

  /**
   * Generates a Line geometry representing the full elliptical orbit path.
   */
  static generateOrbitLineGeometry(
    config: OrbitConfig,
    segments: number = 128
  ): THREE.BufferGeometry {
    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;

      const x = Math.cos(theta) * config.radiusX;
      const z = Math.sin(theta) * config.radiusZ;

      const point = new THREE.Vector3(x, 0, z);

      const euler = new THREE.Euler(config.inclination, 0, 0, 'XYZ');
      point.applyEuler(euler);

      points.push(point);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }
}
