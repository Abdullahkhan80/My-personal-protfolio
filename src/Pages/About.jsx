import React, { useEffect, useRef, memo, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const beatsData = [
  { s: -0.05, e: 0.08, subtitle: "Full-Stack Developer", title: <>Building Modern<br />Web Experiences</>, isH1: true },
  { s: 0.09, e: 0.25, title: "Creative Solutions", desc: "Turning complex problems into elegant, user-friendly applications." },
  { s: 0.26, e: 0.41, subtitle: "Modern Stack", title: "React & Next.js" },
  { s: 0.42, e: 0.58, title: "Smooth Animations", desc: "Creating delightful user experiences with Framer Motion and GSAP." },
  { s: 0.59, e: 0.75, subtitle: "Full Integration", title: "Backend & APIs" },
  { s: 0.76, e: 0.91, title: "Clean Code" },
  { s: 0.92, e: 1.05, subtitle: "Developer Portfolio", title: "Abdullah Khan", desc: "Explore my projects and see what I can create for you.", isLuxeTitle: true }
];

function beatOpacity(p, s, e) {
  const fade = 0.04;
  if (p < s || p > e) return 0;
  if (p < s + fade) return (p - s) / fade;
  if (p > e - fade) return (e - p) / fade;
  return 1;
}

const Home = () => {
  const [isReady, setIsReady] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const petalCanvasRef = useRef(null);
  const bouquetRef = useRef(null);
  const bgLayerRef = useRef(null);
  const midLayerRef = useRef(null);
  const gradeWashRef = useRef(null);
  const lbTopRef = useRef(null);
  const lbBotRef = useRef(null);
  const tlFillRef = useRef(null);
  const timeLabelRef = useRef(null);

  const beatElsRef = useRef([]);
  const beatDotsRef = useRef([]);
  const targetPRef = useRef(0);

  const DUR = 12.75;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Defer heavy Three.js initialization to avoid blocking the
    // main thread during the welcome-to-home transition.
    const initDelay = setTimeout(() => {
    // -------------------------------------------------------------
    // THREE.JS SETUP
    // -------------------------------------------------------------

    const isMobile = window.innerWidth < 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W_init = window.innerWidth;
    const H_init = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance",
    });
    const pr = Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75);
    renderer.setPixelRatio(pr);
    renderer.setSize(W_init, H_init);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#111818"); // Matches portfolio background

    const camera = new THREE.PerspectiveCamera(50, W_init / H_init, 0.1, 100);
    camera.position.z = 14.5;

    // Particles Data
    const COUNT = isMobile ? 4000 : 12000;
    const rand = Math.random;
    const gauss = () => (rand() + rand() + rand() - 1.5) * 0.8;

    const posArr = new Float32Array(COUNT * 3);
    const ringId = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    const scales = new Float32Array(COUNT);
    const rings = [
      { r: 6.4, tx: -0.5, tz: 0 },
      { r: 5.3, tx: 0.9, tz: 0.7 },
      { r: 4.2, tx: 0.25, tz: -1.1 },
    ];

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const pick = rand();
      seeds[i] = rand();
      scales[i] = seeds[i] > 0.985 ? 2.4 : 0.5 + rand() * 0.9;

      if (pick < 0.12) {
        ringId[i] = 4;
        let x = gauss(), y = gauss(), z = gauss();
        const n = Math.hypot(x, y, z) || 1;
        const r = 7.5 + rand() * 5.5;
        posArr[i3] = (x / n) * r;
        posArr[i3 + 1] = (y / n) * r;
        posArr[i3 + 2] = (z / n) * r;
        continue;
      }
      if (pick < 0.24) {
        ringId[i] = 3;
        let x = gauss(), y = gauss(), z = gauss();
        const n = Math.hypot(x, y, z) || 1;
        const r = 1.7 * Math.cbrt(rand());
        posArr[i3] = (x / n) * r;
        posArr[i3 + 1] = (y / n) * r;
        posArr[i3 + 2] = (z / n) * r;
        continue;
      }
      ringId[i] = i % 3;
      const ring = rings[i % 3];
      const ang = rand() * Math.PI * 2;
      const x = Math.cos(ang) * ring.r + gauss() * 0.07;
      const y = gauss() * 0.07;
      const z = Math.sin(ang) * ring.r + gauss() * 0.07;

      let y2 = y * Math.cos(ring.tx) - z * Math.sin(ring.tx);
      const z2 = y * Math.sin(ring.tx) + z * Math.cos(ring.tx);
      const x2 = x * Math.cos(ring.tz) - y2 * Math.sin(ring.tz);
      y2 = x * Math.sin(ring.tz) + y2 * Math.cos(ring.tz);

      posArr[i3] = x2;
      posArr[i3 + 1] = y2;
      posArr[i3 + 2] = z2;
    }

    const SNOISE = `
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

    const VERT =
      `attribute float aSeed;attribute float aScale;attribute float aRing;uniform float uTime;uniform float uSize;uniform float uPixelRatio;uniform vec3 uColor;uniform vec3 uCore;uniform vec3 uRing0;uniform vec3 uRing1;uniform vec3 uRing2;varying vec3 vColor;varying float vTwinkle;` +
      SNOISE +
      `
      void main(){
      vec3 pos=position;
      if(aRing<2.5){vec3 ax=aRing<0.5?normalize(vec3(1.0,0.18,0.0)):aRing<1.5?normalize(vec3(0.0,1.0,0.22)):normalize(vec3(0.25,0.0,1.0));float ang=uTime*(aRing<0.5?0.24:aRing<1.5?-0.38:0.55);float c=cos(ang),s=sin(ang);pos=pos*c+cross(ax,pos)*s+ax*dot(ax,pos)*(1.0-c);}
      vec3 np=pos*0.2+vec3(uTime*0.18)+aSeed*6.28;
      pos+=vec3(snoise(np),snoise(np+31.7),snoise(np+74.3))*0.13;
      pos.x+=sin(uTime*0.9+aSeed*40.0)*0.05;
      pos.y+=cos(uTime*0.7+aSeed*30.0)*0.05;
      vColor=uColor;
      if(aRing<2.5){vColor=aRing<0.5?uRing0:aRing<1.5?uRing1:uRing2;}
      vColor=mix(vColor,uCore,smoothstep(2.5,1.4,length(pos)));
      vColor=mix(vColor,vec3(1.0),step(0.985,aSeed)*0.9);
      vTwinkle=0.6+0.4*sin(uTime*(0.6+aSeed*1.8)+aSeed*20.0);
      vec4 mv=modelViewMatrix*vec4(pos,1.0);
      gl_PointSize=uSize*aScale*uPixelRatio*(12.0/-mv.z);
      gl_Position=projectionMatrix*mv;
      }`;

    const FRAG = `precision mediump float;uniform float uOpacity;varying vec3 vColor;varying float vTwinkle;
      void main(){float d=length(gl_PointCoord-0.5);float alpha=smoothstep(0.5,0.12,d);alpha+=smoothstep(0.12,0.0,d)*0.5;gl_FragColor=vec4(vColor,alpha*vTwinkle*uOpacity);}`;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aRing", new THREE.BufferAttribute(ringId, 1));

    // Adapted colors to match the portfolio's Gold/Orange/Purple theme
    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: 3.0 },
      uPixelRatio: { value: pr },
      uOpacity: { value: 0.8 },
      uColor: { value: new THREE.Color("#e6c078") }, // Gold
      uCore: { value: new THREE.Color("#f7e7ce") },  // Gold light
      uRing0: { value: new THREE.Color("#f97316") }, // Orange
      uRing1: { value: new THREE.Color("#e6c078") }, // Gold
      uRing2: { value: new THREE.Color("#a855f7") }, // Purple
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const group = new THREE.Group();
    const points = new THREE.Points(geo, mat);
    group.add(points);
    scene.add(group);

    let composer = null;
    if (!isMobile && !reduced) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.85,
          0.55,
          0.12
        )
      );
    }

    // Pointer move listener
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const handlePointerMove = (e) => {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", handlePointerMove);

    // -------------------------------------------------------------
    // FLOATING GOLD EMBERS CANVAS (2D)
    // -------------------------------------------------------------
    const petalCanvas = petalCanvasRef.current;
    const ctx = petalCanvas ? petalCanvas.getContext("2d") : null;
    let petals = [];

    const resizePetals = () => {
      if (!petalCanvas) return;
      petalCanvas.width = window.innerWidth * window.devicePixelRatio;
      petalCanvas.height = window.innerHeight * window.devicePixelRatio;
    };
    resizePetals();

    for (let i = 0; i < 70; i++) {
      petals.push({
        x: Math.random(),
        y: Math.random(),
        r: 6 + Math.random() * 14,
        sp: 0.2 + Math.random() * 0.8,
        drift: Math.random() * Math.PI * 2,
        a: 0.3 + Math.random() * 0.5,
      });
    }

    let petalDensity = 0, windAmt = 0;

    const drawPetals = (tMs) => {
      if (!ctx || !petalCanvas) return;
      const W = petalCanvas.width;
      const H = petalCanvas.height;
      ctx.clearRect(0, 0, W, H);
      const dpr = window.devicePixelRatio;

      for (const p of petals) {
        const px = (p.x + Math.sin(tMs * 0.0003 * p.sp + p.drift) * 0.04 * (0.5 + windAmt * 2)) * W;
        const py = (((p.y + tMs * 0.00004 * p.sp) % 1)) * H;
        const size = p.r * dpr * (0.7 + petalDensity * 0.8);

        ctx.globalAlpha = p.a * petalDensity;
        const g = ctx.createRadialGradient(px, py, 0, px, py, size);
        
        // Embers are champagne gold gradient
        g.addColorStop(0, "rgba(230, 192, 120, 0.85)");
        g.addColorStop(1, "rgba(230, 192, 120, 0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(px, py, size, size * 0.6, p.drift + tMs * 0.0002, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // -------------------------------------------------------------
    // INTERACTIVE SECTIONAL SCROLL SNAP
    // -------------------------------------------------------------
    const section = sectionRef.current;
    let rawP = 0, renderP = 0;

    const clock = new THREE.Clock();
    let rafId;

    const raf = (tMs) => {
      rawP = targetPRef.current;
      
      // Extremely smooth easing interpolation: 0.04 per frame
      renderP += (rawP - renderP) * 0.04;
      const p = renderP;

      // Update elements via ref to avoid state lag
      if (bouquetRef.current) {
        const scale = 1 + p * 0.55 - Math.max(0, p - 0.48) * 0.35;
        const roll = p * 4 - Math.max(0, p - 0.65) * 3;
        const fwd = p * -40;
        bouquetRef.current.style.transform = `scale(${scale}) rotate(${roll}deg) translateY(${fwd}px)`;
      }

      if (bgLayerRef.current) {
        bgLayerRef.current.style.transform = `scale(${1.1 + p * 0.15}) translateY(${p * -60}px)`;
      }

      if (midLayerRef.current) {
        midLayerRef.current.style.transform = `translateY(${p * 30}px)`;
      }

      petalDensity = p < 0.48 ? p * 0.3 : Math.min(1, (p - 0.40) * 2.2);
      windAmt = Math.max(0, (p - 0.60)) * 1.4;

      if (gradeWashRef.current) {
        gradeWashRef.current.style.opacity = 0.4 + Math.sin(p * Math.PI) * 0.5;
      }

      let lb = 0;
      if (p < 0.06) lb = (p / 0.06) * 7;
      else if (p > 0.92) lb = 7 * (1 - (p - 0.92) / 0.08);
      else lb = 7;

      if (lbTopRef.current) lbTopRef.current.style.height = `${lb}vh`;
      if (lbBotRef.current) lbBotRef.current.style.height = `${lb}vh`;

      if (tlFillRef.current) tlFillRef.current.style.width = `${p * 100}%`;
      if (timeLabelRef.current) timeLabelRef.current.textContent = `${(p * DUR).toFixed(2)}s`;

      if (!reduced) {
        drawPetals(tMs);
      }

      beatsData.forEach((b, i) => {
        const el = beatElsRef.current[i];
        const dot = beatDotsRef.current[i];
        if (el) {
          const o = beatOpacity(p, b.s, b.e);
          el.style.opacity = o.toFixed(3);
          el.style.transform = `translateY(${(1 - o) * 18}px)`;
        }
        if (dot) {
          const active = Math.abs(p - (i / 6)) < 0.085;
          dot.style.background = active ? "#e6c078" : "rgba(255, 255, 255, 0.25)";
          dot.style.transform = active ? "scale(1.4)" : "scale(1)";
        }
      });

      // Render Three.js particles only when in viewport to conserve resources
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          canvas.style.display = "block";
          const t = clock.getElapsedTime();
          uniforms.uTime.value = t;

          mx += (tmx - mx) * 0.04;
          my += (tmy - my) * 0.04;

          group.rotation.y = mx * 0.35 + t * 0.06 + Math.sin(t * 0.07) * 0.06;
          group.rotation.x = my * 0.22 + Math.sin(t * 0.23) * 0.1;

          if (composer) {
            composer.render();
          } else {
            renderer.render(scene, camera);
          }
        } else {
          canvas.style.display = "none";
        }
      }

      rafId = requestAnimationFrame(raf);
    };

    if (reduced) {
      uniforms.uTime.value = 1;
      renderer.render(scene, camera);
    } else {
      rafId = requestAnimationFrame(raf);
    }

    // Signal that Three.js is ready so the canvas can fade in
    setIsReady(true);

    // Resize handlers
    const handleResize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      if (composer) composer.setSize(W, H);
      resizePetals();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup for Three.js resources
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (composer) {
        composer.passes.forEach((pass) => {
          if (pass.dispose) pass.dispose();
        });
      }
    };
    }, 300); // end of initDelay setTimeout

    // Cleanup the timeout itself if component unmounts before init
    return () => clearTimeout(initDelay);
  }, []);

  // -------------------------------------------------------------
  // EVENT LISTENERS FOR DEBOUNCED SECTIONAL SCROLL
  // -------------------------------------------------------------
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastTransitionTime = 0;
    const COOLDOWN = 600; // Time in ms before next slide transition is allowed

    const handleWheel = (e) => {
      const isAtTop = window.scrollY === 0;
      if (!isAtTop) return;

      const now = Date.now();

      if (e.deltaY > 0) {
        // Scroll down
        if (targetPRef.current < 1.0) {
          e.preventDefault();
          if (now - lastTransitionTime > COOLDOWN) {
            const currentBeat = Math.round(targetPRef.current * 6);
            const nextBeat = Math.min(6, currentBeat + 1);
            targetPRef.current = nextBeat / 6;
            lastTransitionTime = now;
          }
        }
      } else if (e.deltaY < 0) {
        // Scroll up
        if (targetPRef.current > 0) {
          e.preventDefault();
          if (now - lastTransitionTime > COOLDOWN) {
            const currentBeat = Math.round(targetPRef.current * 6);
            const prevBeat = Math.max(0, currentBeat - 1);
            targetPRef.current = prevBeat / 6;
            lastTransitionTime = now;
          }
        }
      }
    };

    // Mobile Swipe transitions
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const isAtTop = window.scrollY === 0;
      if (!isAtTop) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const now = Date.now();

      if (deltaY > 50) {
        // Swiped up (scroll down)
        if (targetPRef.current < 1.0) {
          e.preventDefault();
          if (now - lastTransitionTime > COOLDOWN) {
            const currentBeat = Math.round(targetPRef.current * 6);
            const nextBeat = Math.min(6, currentBeat + 1);
            targetPRef.current = nextBeat / 6;
            lastTransitionTime = now;
            touchStartY = touchY;
          }
        }
      } else if (deltaY < -50) {
        // Swiped down (scroll up)
        if (targetPRef.current > 0) {
          e.preventDefault();
          if (now - lastTransitionTime > COOLDOWN) {
            const currentBeat = Math.round(targetPRef.current * 6);
            const prevBeat = Math.max(0, currentBeat - 1);
            targetPRef.current = prevBeat / 6;
            lastTransitionTime = now;
            touchStartY = touchY;
          }
        }
      }
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      section.removeEventListener("wheel", handleWheel);
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const handleDotClick = (index) => {
    targetPRef.current = index / 6;
  };

  return (
    <>
      <style>{`
        @keyframes bouquetFloat {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(-1.25rem); }
          100% { transform: translateY(0); }
        }
        .anim-bouquet-float {
          animation: bouquetFloat 5s ease-in-out infinite;
        }
        .selection-gold::selection {
          background-color: rgba(230, 192, 120, 0.2);
          color: #fff;
        }
      `}</style>

      {/* WebGL Canvas Background */}
      <canvas
        ref={canvasRef}
        id="particlesBg"
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          pointerEvents: "none",
          display: "block",
          opacity: isReady ? 1 : 0,
          transition: "opacity 1.2s ease-in-out",
        }}
      />

      {/* Pinning scrolling parent container */}
      <section
        ref={sectionRef}
        id="Home"
        className="relative selection-gold"
        style={{ height: "100dvh" }}
      >
        <div
          ref={containerRef}
          style={{
            position: "relative",
            height: "100dvh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Floating Embers Layer */}
          <canvas
            ref={petalCanvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 5,
              opacity: 0.85,
              pointerEvents: "none",
            }}
          />

          {/* Parallax visual wrapper */}
          <div
            ref={midLayerRef}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              willChange: "transform",
            }}
          >
            <div
              ref={bgLayerRef}
              style={{
                position: "absolute",
                inset: "-8%",
                willChange: "transform",
                overflow: "hidden",
                isolation: "isolate",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                willChange: "transform",
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="anim-bouquet-float flex items-center justify-center">
                  <div
                    ref={bouquetRef}
                    className="z-40 relative w-[80vw] md:w-[56vw] max-w-[40rem]"
                    style={{
                      aspectRatio: "16 / 11",
                      backgroundImage: 'url("/hero-character.webp")',
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      willChange: "transform",
                      zIndex: 40,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color grade wash matching the dark champagne portfolio theme */}
          <div
            ref={gradeWashRef}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 6,
              pointerEvents: "none",
              background: "radial-gradient(circle at 50% 45%, rgba(230, 192, 120, 0.1), rgba(17, 24, 24, 0.75) 70%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Cinematic Letterbox bars */}
          <div
            ref={lbTopRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "0vh",
              background: "#000",
              zIndex: 20,
              willChange: "height",
              transition: "height 0.1s ease-out",
            }}
          />
          <div
            ref={lbBotRef}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "0vh",
              background: "#000",
              zIndex: 20,
              willChange: "height",
              transition: "height 0.1s ease-out",
            }}
          />

          {/* Corner brackets frame */}
          <div
            className="absolute inset-4 md:inset-6 z-30 pointer-events-none"
          >
            <span style={{ position: "absolute", top: 0, left: 0, width: "1.375rem", height: "1.375rem", borderTop: "1px solid rgba(230, 192, 120, 0.35)", borderLeft: "1px solid rgba(230, 192, 120, 0.35)" }} />
            <span style={{ position: "absolute", top: 0, right: 0, width: "1.375rem", height: "1.375rem", borderTop: "1px solid rgba(230, 192, 120, 0.35)", borderRight: "1px solid rgba(230, 192, 120, 0.35)" }} />
            <span style={{ position: "absolute", bottom: 0, left: 0, width: "1.375rem", height: "1.375rem", borderBottom: "1px solid rgba(230, 192, 120, 0.35)", borderLeft: "1px solid rgba(230, 192, 120, 0.35)" }} />
            <span style={{ position: "absolute", bottom: 0, right: 0, width: "1.375rem", height: "1.375rem", borderBottom: "1px solid rgba(230, 192, 120, 0.35)", borderRight: "1px solid rgba(230, 192, 120, 0.35)" }} />
          </div>

          {/* Copy beats */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {beatsData.map((b, i) => (
              <div
                key={i}
                ref={(el) => (beatElsRef.current[i] = el)}
                className="flex flex-col items-center select-none w-full max-w-[90vw] md:max-w-[45rem] px-4 md:px-6"
                style={{
                  position: "absolute",
                  textAlign: "center",
                  opacity: 0,
                  willChange: "transform, opacity",
                  transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
                }}
              >
                {b.subtitle && (
                  <p
                    className="text-[0.65rem] sm:text-xs uppercase font-medium"
                    style={{
                      letterSpacing: "0.25rem",
                      color: "#e6c078",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {b.subtitle}
                  </p>
                )}
                {b.isH1 ? (
                  <h1
                    className="tracking-tight text-white font-medium"
                    style={{
                      fontSize: "clamp(1.75rem, 7vw, 5.5rem)",
                      lineHeight: 0.95,
                    }}
                  >
                    {b.title}
                  </h1>
                ) : b.isLuxeTitle ? (
                  <h2
                    className="tracking-tight uppercase font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] via-[#e6c078] to-[#a855f7]"
                    style={{
                      fontSize: "clamp(1.625rem, 7vw, 5rem)",
                      lineHeight: 1,
                    }}
                  >
                    {b.title}
                  </h2>
                ) : (
                  <h2
                    className="tracking-tight text-white font-medium"
                    style={{
                      fontSize: "clamp(1.5rem, 6vw, 4.5rem)",
                      lineHeight: 1,
                    }}
                  >
                    {b.title}
                  </h2>
                )}
                {b.desc && (
                  <p
                    className="text-xs sm:text-sm mt-3 sm:mt-4 text-[#c9c4bd] font-light max-w-[85vw] sm:max-w-[27.5rem]"
                  >
                    {b.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Timeline HUD */}
          <div
            className="absolute left-6 md:left-8 bottom-6 md:bottom-14 z-[45] flex items-center gap-4"
          >
            <div
              className="hidden md:block"
              style={{
                width: "11.25rem",
                height: "0.1875rem",
                borderRadius: "0.1875rem",
                background: "rgba(255, 255, 255, 0.16)",
                overflow: "hidden",
              }}
            >
              <div
                ref={tlFillRef}
                style={{
                  height: "100%",
                  width: "0%",
                  background: "linear-gradient(90deg, #f97316, #e6c078)",
                }}
              />
            </div>
            <span
              ref={timeLabelRef}
              className="text-xs tabular-nums text-[#b8b4ae] font-mono"
            >
              0.00s
            </span>
          </div>

          {/* Timeline dots navigation */}
          <div
            className="absolute right-6 md:right-8 bottom-6 md:bottom-14 z-[45] flex gap-2.5"
          >
            {beatsData.map((b, i) => (
              <span
                key={i}
                ref={(el) => (beatDotsRef.current[i] = el)}
                onClick={() => handleDotClick(i)}
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.25)",
                  transition: "background 0.3s, transform 0.3s",
                  cursor: "pointer",
                }}
                className="hover:scale-150"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(Home);
