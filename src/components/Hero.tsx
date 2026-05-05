import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Single bird: a low-poly cone with flapping wings (two thin boxes)
const Bird = ({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) => {
  const group = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const radius = useMemo(() => 3 + Math.random() * 2, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (group.current) {
      group.current.position.x = position[0] + Math.cos(t) * radius;
      group.current.position.z = position[2] + Math.sin(t) * radius;
      group.current.position.y = position[1] + Math.sin(t * 2) * 0.4;
      group.current.rotation.y = -t + Math.PI / 2;
    }
    const flap = Math.sin(t * 8) * 0.6;
    if (leftWing.current) leftWing.current.rotation.z = flap;
    if (rightWing.current) rightWing.current.rotation.z = -flap;
  });

  return (
    <group ref={group} position={position} scale={0.25}>
      <mesh>
        <coneGeometry args={[0.3, 1, 6]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh ref={leftWing} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh ref={rightWing} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
};

const Particles = () => {
  const positions = useMemo(() => {
    const arr = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.04} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
};

const OrbitingLights = () => {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (l1.current) {
      l1.current.position.set(Math.cos(t * 0.6) * 5, 2, Math.sin(t * 0.6) * 5);
    }
    if (l2.current) {
      l2.current.position.set(Math.cos(t * 0.6 + Math.PI) * 5, -1, Math.sin(t * 0.6 + Math.PI) * 5);
    }
  });
  return (
    <>
      <pointLight ref={l1} color="#14b8a6" intensity={40} distance={15} />
      <pointLight ref={l2} color="#f97316" intensity={40} distance={15} />
    </>
  );
};

const Scene = ({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) => {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * 1 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    if (group.current) {
      group.current.rotation.y += (mouse.current.x * 0.3 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-mouse.current.y * 0.2 - group.current.rotation.x) * 0.05;
    }
  });

  const birds = useMemo(() => {
    const colors = ["#14b8a6", "#f97316", "#fbbf24", "#ffffff"];
    return new Array(12).fill(0).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
      color: colors[i % colors.length],
      speed: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <OrbitingLights />
      <group ref={group}>
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          {birds.map((b, i) => (
            <Bird key={i} {...b} />
          ))}
        </Float>
        <Particles />
      </group>
    </>
  );
};

export const Hero = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleExploreClick = () => {
    document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden bg-background">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(220 40% 6%) 0%, hsl(200 50% 10%) 50%, hsl(180 40% 8%) 100%)",
        }}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        {ready && (
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <Scene mouse={mouse} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Radial vignette for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, hsl(var(--background) / 0.7) 100%)",
        }}
      />

      {/* Hero content */}
      <div className="relative h-full flex items-center justify-center text-center px-4 pointer-events-none">
        <div className="max-w-4xl animate-fade-in-up pointer-events-auto">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs uppercase tracking-widest border border-primary/40 text-primary bg-primary/10 backdrop-blur-sm">
            Dokumentarni portal
          </span>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient-primary">
            selo Šebet
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto">
            Istorija, kultura, ljudi i priče našeg sela — kroz priču, sliku i zvuk
          </p>
          <Button
            size="lg"
            onClick={handleExploreClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
          >
            Istražite priče
          </Button>
        </div>
      </div>

      {/* Scroll indicator with pulsing line */}
      <button
        onClick={handleExploreClick}
        aria-label="Skroluj nadole"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary"
      >
        <span className="block w-px h-12 bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>
    </section>
  );
};
