import * as THREE from "three";

export function makeGrid(
  gridSize,
  cellSize,
  majorInterval,
  colorMajor,
  colorMinor,
  centered = true
) {
  let offset = centered ? gridSize / 2 : 0;

  let pts = [];
  pts.push(new THREE.Vector3(0 - offset, 0, 0));
  pts.push(new THREE.Vector3(gridSize - offset, 0, 0));

  let geometry = new THREE.BufferGeometry().setFromPoints(pts);
  let matLineMajor = new THREE.LineBasicMaterial({ color: colorMajor });
  let matLineMinor = new THREE.LineBasicMaterial({ color: colorMinor });

  let group = new THREE.Group();
  let currentSize = 0;

  for (let i = 0; currentSize <= gridSize; i++) {
    currentSize = i * cellSize;
    let color = i % majorInterval === 0 ? matLineMajor : matLineMinor;
    let line = new THREE.Line(geometry, color);

    line.position.y = currentSize - offset;
    group.add(line);

    let line2 = new THREE.Line(geometry, color);
    line2.rotation.z = Math.PI / 2;
    line2.position.x = currentSize - offset;
    group.add(line2);
  }
  return group;
}
