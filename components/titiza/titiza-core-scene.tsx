'use client'

/**
 * TitizaCoreScene
 * -----------------------------------------------------------------------------
 * The visual identity of Titiza — a living light "presence" made of a glowing
 * core, layered glass energy membranes, gentle orbital rings and a stream of
 * particles that flow slowly *inward* toward the core, as if she is quietly
 * drawing in and understanding information. Intentionally NOT a human, robot
 * or avatar.
 *
 * Depth layers (front-to-back):
 *   1. Bright living core        (glowing metallic heart + inner glow)
 *   2. Glass reflection glint    (a soft off-axis specular highlight)
 *   3. Glass energy membranes    (Fresnel-lit, slowly breathing)
 *   4. Holographic wire cage      (very faint)
 *   5. Two gentle orbital rings   (independent slow speeds, distinct planes)
 *   6. Inflowing particle stream  (drifts toward the core, then respawns)
 *   + a soft heartbeat wave every few seconds
 *
 * Calm and luxurious by design: everything moves slowly. Lightweight custom
 * additive shaders (no heavy transmission passes) so it renders reliably
 * everywhere. When a proprietary "Titiza Core" model exists later, ONLY this
 * file needs to change.
 */

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const GOLD = new THREE.Color('#e8c47a')
const GOLD_BRIGHT = new THREE.Color('#f7e6b4')

/* -------------------------------------------------------------------------- */
/*  Pointer-reactive rig — gentle rotation + subtle positional parallax        */
/* -------------------------------------------------------------------------- */
function PresenceRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame((_, delta) => {
    if (!group.current) return
    // calm rotation toward the cursor
    const targetY = pointer.x * 0.35
    const targetX = -pointer.y * 0.25
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 1.6, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 1.6, delta)
    // subtle parallax drift so the whole presence feels physically present
    const px = pointer.x * 0.22
    const py = pointer.y * 0.16
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, px, 1.4, delta)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, py, 1.4, delta)
  })

  return <group ref={group}>{children}</group>
}

/* -------------------------------------------------------------------------- */
/*  Flowing energy shell — a Fresnel-lit, gently displacing glass membrane     */
/* -------------------------------------------------------------------------- */
function EnergyShell({
  radius = 1.35,
  detail = 48,
  color = GOLD,
  intensity = 1.6,
  displace = 0.08,
  speed = 0.6,
  opacity = 1,
}: {
  radius?: number
  detail?: number
  color?: THREE.Color
  intensity?: number
  displace?: number
  speed?: number
  opacity?: number
}) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: color.clone() },
      uIntensity: { value: intensity },
      uDisplace: { value: displace },
      uOpacity: { value: opacity },
    }),
    [color, intensity, displace, opacity],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mat.current) mat.current.uniforms.uTime.value = t * speed
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.06
      mesh.current.rotation.x = t * 0.025
      const s = 1 + Math.sin(t * 0.55) * 0.045 // slow breathing
      mesh.current.scale.setScalar(s)
    }
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[radius, detail]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform float uDisplace;
          varying vec3 vNormal;
          varying vec3 vView;

          // cheap flowing displacement from layered sines
          float flow(vec3 p){
            return sin(p.x * 3.0 + uTime) * 0.5
                 + sin(p.y * 2.3 - uTime * 1.3) * 0.5
                 + sin(p.z * 2.8 + uTime * 0.8) * 0.5;
          }

          void main(){
            vec3 n = normalize(normal);
            float d = flow(position) * uDisplace;
            vec3 displaced = position + n * d;
            vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
            vNormal = normalize(normalMatrix * n);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor;
          uniform float uIntensity;
          uniform float uOpacity;
          varying vec3 vNormal;
          varying vec3 vView;

          void main(){
            float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.6);
            float glow = fresnel * uIntensity;
            gl_FragColor = vec4(uColor * glow, fresnel * uOpacity);
          }
        `}
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Living core — a bright metallic heart with a soft breathing inner glow     */
/* -------------------------------------------------------------------------- */
function CoreHeart() {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.y = -t * 0.14
    const s = 0.55 + Math.sin(t * 0.7) * 0.028 // slow breathe
    mesh.current.scale.setScalar(s)
    // core pulse — subtle rise and fall of inner light
    if (mat.current) mat.current.emissiveIntensity = 0.65 + Math.sin(t * 0.7) * 0.22
  })
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial
        ref={mat}
        color={GOLD_BRIGHT}
        emissive={GOLD}
        emissiveIntensity={0.65}
        metalness={0.92}
        roughness={0.22}
        flatShading
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Inner glow — soft additive halo pulsing behind the heart                   */
/* -------------------------------------------------------------------------- */
function InnerGlow() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    const s = 0.72 + Math.sin(t * 0.75) * 0.05
    mesh.current.scale.setScalar(s)
    const m = mesh.current.material as THREE.MeshBasicMaterial
    m.opacity = 0.34 + Math.sin(t * 0.75) * 0.1
  })
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial
        color={GOLD_BRIGHT}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Glass reflection glint — a soft off-axis specular highlight on the shell   */
/* -------------------------------------------------------------------------- */
function GlassGlint() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    // drift the highlight slowly across the upper-left of the sphere
    const a = 0.6 + Math.sin(t * 0.25) * 0.15
    mesh.current.position.set(-0.55, 0.7, 1.15)
    const m = mesh.current.material as THREE.MeshBasicMaterial
    m.opacity = 0.28 + Math.sin(t * 0.5) * 0.08
    mesh.current.scale.setScalar(a)
  })
  return (
    <mesh ref={mesh} position={[-0.55, 0.7, 1.15]}>
      <circleGeometry args={[0.32, 32]} />
      <meshBasicMaterial
        color={GOLD_BRIGHT}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Orbital ring — a tilted torus that slowly spins on its own axis            */
/* -------------------------------------------------------------------------- */
function OrbitalRing({
  radius = 2,
  tube = 0.012,
  color = GOLD,
  opacity = 0.5,
  speed = 0.25,
  tilt = [Math.PI / 2.4, 0, 0] as [number, number, number],
}: {
  radius?: number
  tube?: number
  color?: THREE.Color
  opacity?: number
  speed?: number
  tilt?: [number, number, number]
}) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.z = t * speed
    // gentle opacity breathing so the ring "pulses"
    const m = mesh.current.material as THREE.MeshBasicMaterial
    m.opacity = opacity * (0.7 + Math.sin(t * 0.5 + radius) * 0.3)
  })
  return (
    <mesh ref={mesh} rotation={tilt}>
      <torusGeometry args={[radius, tube, 16, 160]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Heartbeat wave — a soft ring that expands + fades every ~7 seconds         */
/* -------------------------------------------------------------------------- */
function HeartbeatWave({ period = 8 }: { period?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!mesh.current) return
    const phase = (state.clock.elapsedTime % period) / period // 0 → 1
    const s = 1.2 + phase * 2.4
    mesh.current.scale.setScalar(s)
    const m = mesh.current.material as THREE.MeshBasicMaterial
    // quick appear, slow fade — almost invisible, just a pulse of presence
    m.opacity = Math.max(0, 0.45 * (1 - phase) * (1 - phase))
  })
  return (
    <mesh ref={mesh}>
      <torusGeometry args={[1, 0.02, 16, 128]} />
      <meshBasicMaterial
        color={GOLD_BRIGHT}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Holographic wireframe — a slow counter-rotating cage (very faint)          */
/* -------------------------------------------------------------------------- */
function HoloWire() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.y = -t * 0.1
    mesh.current.rotation.x = t * 0.045
  })
  return (
    <mesh ref={mesh} scale={1.85}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial
        color={GOLD}
        wireframe
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Inflowing particle stream — points drift slowly toward the core, then      */
/*  respawn at the outer radius. Feels like Titiza drawing in understanding.   */
/* -------------------------------------------------------------------------- */
function ParticleStream({ count = 900 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)
  const R_OUT = 3.6
  const R_IN = 0.6

  const { positions, dirs, radii, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const dirs = new Float32Array(count * 3) // unit direction from center
    const radii = new Float32Array(count) // current radius along its ray
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const dx = Math.sin(phi) * Math.cos(theta)
      const dy = Math.sin(phi) * Math.sin(theta)
      const dz = Math.cos(phi)
      const r = R_IN + Math.random() * (R_OUT - R_IN)
      dirs[i * 3] = dx
      dirs[i * 3 + 1] = dy
      dirs[i * 3 + 2] = dz
      radii[i] = r
      speeds[i] = 0.12 + Math.random() * 0.22
      positions[i * 3] = dx * r
      positions[i * 3 + 1] = dy * r
      positions[i * 3 + 2] = dz * r
    }
    return { positions, dirs, radii, speeds }
  }, [count])

  useFrame((state, delta) => {
    if (!points.current) return
    const t = state.clock.elapsedTime
    // slow overall swirl so the stream isn't perfectly radial
    points.current.rotation.y = t * 0.03
    const arr = points.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      radii[i] -= speeds[i] * delta // flow inward
      if (radii[i] <= R_IN) {
        radii[i] = R_OUT * (0.85 + Math.random() * 0.15) // respawn outward
      }
      const r = radii[i]
      arr[i * 3] = dirs[i * 3] * r
      arr[i * 3 + 1] = dirs[i * 3 + 1] * r
      arr[i * 3 + 2] = dirs[i * 3 + 2] * r
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.026}
        color={GOLD}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* -------------------------------------------------------------------------- */
/*  Full presence assembly — layered front-to-back for depth                   */
/* -------------------------------------------------------------------------- */
function Presence() {
  return (
    <PresenceRig>
      <Float speed={1} rotationIntensity={0.18} floatIntensity={0.45}>
        {/* 1. living core */}
        <InnerGlow />
        <CoreHeart />
        {/* 3. glass energy membranes */}
        <EnergyShell radius={1.3} intensity={1.7} displace={0.09} opacity={0.9} />
        <EnergyShell
          radius={1.55}
          intensity={0.9}
          displace={0.05}
          speed={-0.4}
          color={GOLD_BRIGHT}
          opacity={0.5}
        />
        {/* 2. glass reflection glint (rendered after shells so it sits on top) */}
        <GlassGlint />
        {/* 4. faint wire cage */}
        <HoloWire />
        {/* 5. two gentle orbital rings on distinct planes → depth */}
        <OrbitalRing radius={1.95} tube={0.012} opacity={0.4} speed={0.16} tilt={[Math.PI / 2.3, 0.4, 0]} />
        <OrbitalRing
          radius={2.45}
          tube={0.008}
          color={GOLD_BRIGHT}
          opacity={0.22}
          speed={-0.1}
          tilt={[Math.PI / 3.2, -0.5, 0.3]}
        />
        {/* heartbeat pulse */}
        <HeartbeatWave period={8} />
        {/* 6. inflowing particle stream */}
        <ParticleStream />
      </Float>
    </PresenceRig>
  )
}

export default function TitizaCoreScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 5, 4]} intensity={2.5} color={GOLD_BRIGHT} />
      <pointLight position={[-5, -3, -2]} intensity={1.2} color={'#8a6a2a'} />
      <directionalLight position={[0, 2, 5]} intensity={1.4} color={GOLD_BRIGHT} />
      <Presence />
    </Canvas>
  )
}
