'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

interface StlViewerProps {
  url: string;
}

export default function StlViewer({ url }: StlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!containerRef.current) return;

    setLoading(true);
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = null; // Прозорий фон для інтеграції з карткою Nothing OS

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 80); // Повертаємо оптимальну інженерну точку огляду

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Освітлення студійного рівня
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(1, 1, 1).normalize();
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-1, -1, -1).normalize();
    scene.add(dirLight2);

    // Матовий світло-сірий інженерний пластик
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.5,
      metalness: 0.1,
    });

    let mesh: THREE.Mesh | null = null;
    let loadedGeometry: THREE.BufferGeometry | null = null;

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry: THREE.BufferGeometry) => {
        loadedGeometry = geometry;
        geometry.center(); // Центруємо модель відносно локальних осей координат
        mesh = new THREE.Mesh(geometry, material);

        // Авто-масштабування (виправляє баг "модель не в кадрі")
        geometry.computeBoundingSphere();
        const sphere = geometry.boundingSphere;
        if (sphere) {
          const radius = sphere.radius;
          const scale = 30 / radius; // Масштабуємо будь-яку модель під рамки канвасу
          mesh.scale.set(scale, scale, scale);
        }
        scene.add(mesh);
        setLoading(false);
      },
      undefined,
      (err: unknown) => {
        console.error('Error loading STL Matrix:', err);
        setLoading(false);
      },
    );

    // Ручний трекінг миші для обертання вузла
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = () => {
      isDragging = true;
    };
    const handleMouseMove = (e: MouseEvent) => {
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };
      if (isDragging && mesh) {
        mesh.rotation.y += deltaMove.x * 0.01;
        mesh.rotation.x += deltaMove.y * 0.01;
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (mesh && !isDragging) {
        mesh.rotation.y += 0.005; // Легке автообертання вузла в просторі
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (loadedGeometry) loadedGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [url]);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-nothing-text/40 font-space text-xs gap-3">
          <span className="animate-spin text-nothing-red">⟳</span>
          <span className="uppercase tracking-widest">Booting WebGL Engine...</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
