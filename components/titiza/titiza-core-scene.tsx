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
 *
 * IMPLEMENTATION NOTE
 * -----------------------------------------------------------------------------
 * This scene is authored with **raw three.js** (imperative), NOT
 * react-three-fiber. r3f's custom react-reconciler has a hard conflict with
 * this project's Next.js 15 / React 18.3.1 combination (it reads React
 * internals that Next's bundled runtime does not expose the same way), which
 * crashed the page. Driving three.js directly removes any React-internals
 * dependency for the 3D layer. The visual design is unchanged.
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GOLD = new THREE.Color('#e8c47a')
const GOLD_BRIGHT = new THREE.Color('#f7e6b4')

/* Shared GLSL for the Fresnel-lit, gently displacing glass membranes. */
const SHELL_VERTEX = /* glsl */ `
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
`

const SHELL_FRAGMENT = /* glsl */ `
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
`

/* -------------------------------------------------------------------------- */
/*  Builders — each returns a THREE object plus (optionally) its material so    */
/*  the animation loop can drive it. Mirrors the previous JSX one-for-one.      */
/* -------------------------------------------------------------------------- */

function makeEnergyShell(opts: {
  radius?: number
  detail?: number
  color?: THREE.Color
  intensity?: number
  displace?: number
  speed?: number
  opacity?: number
}) {
  const {
    radius = 1.35,
    detail = 48,
    color = GOLD,
    intensity = 1.6,
    displace = 0.08,
    speed = 0.6,
    opacity = 1,
  } = opts

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: color.clone() },
    uIntensity: { value: intensity },
    uDisplace: { value: displace },
    uOpacity: { value: opacity },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: SHELL_VERTEX,
    fragmentShader: SHELL_FRAGMENT,
  })

  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, detail), material)
  return { mesh, material, speed }
}

function makeOrbitalRing(opts: {
  radius?: number
  tube?: number
  color?: THREE.Color
  opacity?: number
  speed?: number
  tilt?: [number, number, number]
}) {
  const {
    radius = 2,
    tube = 0.012,
    color = GOLD,
    opacity = 0.5,
    speed = 0.25,
    tilt = [Math.PI / 2.4, 0, 0] as [number, number, number],
  } = opts

  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 16, 160), material)
  // Initial tilt on x/y; rotation.z is driven by the animation loop.
  mesh.rotation.x = tilt[0]
  mesh.rotation.y = tilt[1]
  return { mesh, material, radius, speed, baseOpacity: opacity }
}

export default function TitizaCoreScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    /* -------------------------- renderer + camera ------------------------- */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0) // transparent background
    const initialW = container.clientWidth || 1
    const initialH = container.clientHeight || 1
    renderer.setSize(initialW, initialH)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // dpr [1, 2]
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, initialW / initialH, 0.1, 100)
    camera.position.set(0, 0, 6)

    /* ------------------------------- lights ------------------------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const key = new THREE.PointLight(GOLD_BRIGHT, 2.5)
    key.position.set(4, 5, 4)
    scene.add(key)
    const rim = new THREE.PointLight(new THREE.Color('#8a6a2a'), 1.2)
    rim.position.set(-5, -3, -2)
    scene.add(rim)
    const dir = new THREE.DirectionalLight(GOLD_BRIGHT, 1.4)
    dir.position.set(0, 2, 5)
    scene.add(dir)

    /* --------------------- rig groups (Presence + Float) ------------------ */
    const rig = new THREE.Group() // PresenceRig — pointer-reactive
    const floatGroup = new THREE.Group() // FloatRig — gentle bob/rotation
    rig.add(floatGroup)
    scene.add(rig)

    /* 1. living core — inner glow + metallic heart */
    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 24),
      new THREE.MeshBasicMaterial({
        color: GOLD_BRIGHT,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    floatGroup.add(innerGlow)

    const coreMat = new THREE.MeshStandardMaterial({
      color: GOLD_BRIGHT,
      emissive: GOLD,
      emissiveIntensity: 0.65,
      metalness: 0.92,
      roughness: 0.22,
      flatShading: true,
    })
    const coreHeart = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 4), coreMat)
    floatGroup.add(coreHeart)

    /* 3. glass energy membranes */
    const shellA = makeEnergyShell({ radius: 1.3, intensity: 1.7, displace: 0.09, opacity: 0.9 })
    const shellB = makeEnergyShell({
      radius: 1.55,
      intensity: 0.9,
      displace: 0.05,
      speed: -0.4,
      color: GOLD_BRIGHT,
      opacity: 0.5,
    })
    floatGroup.add(shellA.mesh)
    floatGroup.add(shellB.mesh)
    const shells = [shellA, shellB]

    /* 2. glass reflection glint (added after shells so it sits on top) */
    const glintMat = new THREE.MeshBasicMaterial({
      color: GOLD_BRIGHT,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const glint = new THREE.Mesh(new THREE.CircleGeometry(0.32, 32), glintMat)
    glint.position.set(-0.55, 0.7, 1.15)
    floatGroup.add(glint)

    /* 4. faint holographic wire cage */
    const holo = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshBasicMaterial({
        color: GOLD,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    holo.scale.setScalar(1.85)
    floatGroup.add(holo)

    /* 5. two gentle orbital rings on distinct planes → depth */
    const ringA = makeOrbitalRing({
      radius: 1.95,
      tube: 0.012,
      opacity: 0.4,
      speed: 0.16,
      tilt: [Math.PI / 2.3, 0.4, 0],
    })
    const ringB = makeOrbitalRing({
      radius: 2.45,
      tube: 0.008,
      color: GOLD_BRIGHT,
      opacity: 0.22,
      speed: -0.1,
      tilt: [Math.PI / 3.2, -0.5, 0.3],
    })
    floatGroup.add(ringA.mesh)
    floatGroup.add(ringB.mesh)
    const rings = [ringA, ringB]

    /* heartbeat pulse */
    const heartbeatMat = new THREE.MeshBasicMaterial({
      color: GOLD_BRIGHT,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const heartbeat = new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 16, 128), heartbeatMat)
    floatGroup.add(heartbeat)
    const heartbeatPeriod = 8

    /* 6. inflowing particle stream */
    const PARTICLE_COUNT = 900
    const R_OUT = 3.6
    const R_IN = 0.6
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const dirs = new Float32Array(PARTICLE_COUNT * 3) // unit direction from center
    const radii = new Float32Array(PARTICLE_COUNT) // current radius along its ray
    const pSpeeds = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
      pSpeeds[i] = 0.12 + Math.random() * 0.22
      positions[i * 3] = dx * r
      positions[i * 3 + 1] = dy * r
      positions[i * 3 + 2] = dz * r
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.026,
      color: GOLD,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    floatGroup.add(particles)

    /* ----------------------- pointer (cursor) tracking -------------------- */
    // Normalized device coords relative to the canvas, matching r3f's pointer.
    const pointer = new THREE.Vector2(0, 0)
    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointerMove)

    /* ------------------------------ resize -------------------------------- */
    const onResize = () => {
      const w = container.clientWidth || 1
      const h = container.clientHeight || 1
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    /* --------------------------- animation loop --------------------------- */
    const clock = new THREE.Clock()
    const floatOffset = Math.random() * 10000
    let raf = 0

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const t = clock.elapsedTime

      // PresenceRig — calm rotation toward the cursor + subtle parallax drift
      const targetY = pointer.x * 0.35
      const targetX = -pointer.y * 0.25
      rig.rotation.y = THREE.MathUtils.damp(rig.rotation.y, targetY, 1.6, delta)
      rig.rotation.x = THREE.MathUtils.damp(rig.rotation.x, targetX, 1.6, delta)
      rig.position.x = THREE.MathUtils.damp(rig.position.x, pointer.x * 0.22, 1.4, delta)
      rig.position.y = THREE.MathUtils.damp(rig.position.y, pointer.y * 0.16, 1.4, delta)

      // FloatRig — gentle bob + rotation wobble (drei Float math, speed 1)
      const tf = floatOffset + t
      floatGroup.rotation.x = (Math.cos(tf / 4) / 8) * 0.18
      floatGroup.rotation.y = (Math.sin(tf / 4) / 8) * 0.18
      floatGroup.rotation.z = (Math.sin(tf / 4) / 20) * 0.18
      floatGroup.position.y = (Math.sin(tf / 4) / 10) * 0.45

      // inner glow — breathing scale + opacity
      const glowScale = 0.72 + Math.sin(t * 0.75) * 0.05
      innerGlow.scale.setScalar(glowScale)
      ;(innerGlow.material as THREE.MeshBasicMaterial).opacity = 0.34 + Math.sin(t * 0.75) * 0.1

      // core heart — slow spin, breathe, inner-light pulse
      coreHeart.rotation.y = -t * 0.14
      coreHeart.scale.setScalar(0.55 + Math.sin(t * 0.7) * 0.028)
      coreMat.emissiveIntensity = 0.65 + Math.sin(t * 0.7) * 0.22

      // energy shells — flowing uniforms + rotation + breathing scale
      const shellScale = 1 + Math.sin(t * 0.55) * 0.045
      for (const s of shells) {
        s.material.uniforms.uTime.value = t * s.speed
        s.mesh.rotation.y = t * 0.06
        s.mesh.rotation.x = t * 0.025
        s.mesh.scale.setScalar(shellScale)
      }

      // glass glint — drifting highlight
      glint.scale.setScalar(0.6 + Math.sin(t * 0.25) * 0.15)
      glintMat.opacity = 0.28 + Math.sin(t * 0.5) * 0.08

      // holographic wire — slow counter-rotation
      holo.rotation.y = -t * 0.1
      holo.rotation.x = t * 0.045

      // orbital rings — spin on own axis + opacity breathing
      for (const ring of rings) {
        ring.mesh.rotation.z = t * ring.speed
        ring.material.opacity = ring.baseOpacity * (0.7 + Math.sin(t * 0.5 + ring.radius) * 0.3)
      }

      // heartbeat wave — expand + fade every `period` seconds
      const phase = (t % heartbeatPeriod) / heartbeatPeriod
      heartbeat.scale.setScalar(1.2 + phase * 2.4)
      heartbeatMat.opacity = Math.max(0, 0.45 * (1 - phase) * (1 - phase))

      // particle stream — swirl + inflow toward the core, respawn outward
      particles.rotation.y = t * 0.03
      const arr = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        radii[i] -= pSpeeds[i] * delta
        if (radii[i] <= R_IN) {
          radii[i] = R_OUT * (0.85 + Math.random() * 0.15)
        }
        const r = radii[i]
        arr[i * 3] = dirs[i * 3] * r
        arr[i * 3 + 1] = dirs[i * 3 + 1] * r
        arr[i * 3 + 2] = dirs[i * 3 + 2] * r
      }
      particleGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    /* ------------------------------ cleanup ------------------------------- */
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const material = mesh.material
        if (material) {
          if (Array.isArray(material)) material.forEach((m) => m.dispose())
          else material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
