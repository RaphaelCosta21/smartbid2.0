import * as React from "react";
import * as THREE from "three";
import { EquipmentModelFactory } from "./survey3d/equipmentModels";
import { SceneShape } from "./survey3d/sceneTypes";

interface Props {
  shape: SceneShape;
  /** Fallback square size (px) when the host has no measured box yet. */
  size?: number;
}

/** Spins the same procedural primitive used by the big survey scene. */
export const SurveyEquipment3DThumb: React.FC<Props> = ({ shape, size = 140 }) => {
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return undefined; // No WebGL: caller keeps the photo fallback.
    }

    const w = host.clientWidth || size;
    const h = host.clientHeight || size;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(1.6, 1.1, 2.1);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9ec6d8, 0.4);
    fill.position.set(-4, 1, -3);
    scene.add(fill);

    const factory = new EquipmentModelFactory();
    const model = factory.build(shape, false);
    scene.add(model);

    let raf = 0;
    const animate = (): void => {
      model.rotation.y += 0.01;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = (): void => {
      const nw = host.clientWidth || size;
      const nh = host.clientHeight || size;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      factory.dispose();
      renderer.dispose();
      const el = renderer.domElement;
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [shape, size]);

  // pointer-events: none keeps the editors' "upload photo" click working underneath.
  return <div ref={hostRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }} />;
};
