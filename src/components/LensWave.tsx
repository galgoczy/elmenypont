import { useEffect, useRef, useState } from 'react'

/**
 * WebGL "elastic glass wave": when the hero's AI image completes, a
 * refractive ring rolls from the machine's screen out to the browser edges,
 * genuinely displacing the picture beneath like a curved lens — with an
 * elastic compress/stretch profile (derivative-of-Gaussian), a trailing echo
 * wave, chromatic aberration and a travelling specular catch.
 *
 * The browser can't hand live DOM to a shader, so the finished stage (dark
 * bg + ambient glow + front-facing machine with the AI photo) is repainted
 * pixel-faithfully onto a 2D canvas from the same geometry constants the
 * DOM uses, and that snapshot is the shader's texture. The canvas overlay
 * crossfades in/out around the wave so any sub-pixel mismatch never pops.
 *
 * Callers gate mounting on WebGL support and fall back to the CSS lens.
 */

/* mirror of the kiosk geometry in Hero.tsx (finished, front-facing pose) */
const HEAD_W = 300
const HEAD_H = 230
const COL_W = 80
const COL_H = 380
const BASE_W = 240
const BASE_H = 14
const TOTAL_H = HEAD_H + COL_H + BASE_H
const FINAL_SCALE = 1.32
const FINAL_TY = 190
const PHOTO_SRC = '/assets/photos/team-heroes.jpg'

let glSupportCache: boolean | null = null
export function hasWebGL(): boolean {
  if (typeof document === 'undefined') return false
  if (glSupportCache === null) {
    try {
      const c = document.createElement('canvas')
      glSupportCache = !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
    } catch {
      glSupportCache = false
    }
  }
  return glSupportCache
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** repaint the finished stage exactly as the DOM shows it */
async function paintSnapshot(w: number, h: number, dpr: number): Promise<HTMLCanvasElement> {
  const cv = document.createElement('canvas')
  cv.width = Math.round(w * dpr)
  cv.height = Math.round(h * dpr)
  const ctx = cv.getContext('2d')!
  ctx.scale(dpr, dpr)

  // stage background + ambient glow (heroGlow = 0.5 at completion)
  ctx.fillStyle = 'rgb(23,21,13)'
  ctx.fillRect(0, 0, w, h)
  ctx.save()
  ctx.translate(0.5 * w, 0.38 * h)
  ctx.scale(1.2 * w, 0.8 * h)
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  glow.addColorStop(0, 'rgba(233,74,53,0.5)')
  glow.addColorStop(0.55, 'rgba(233,74,53,0)')
  ctx.fillStyle = glow
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()

  const s = FINAL_SCALE
  const cx = w / 2
  const boxCy = h / 2 + FINAL_TY
  const headTop = boxCy - (TOTAL_H / 2) * s
  const headX = cx - (HEAD_W / 2) * s
  const headW = HEAD_W * s
  const headH = HEAD_H * s

  // ground shadow (shadowOp = 0.55 at completion)
  const baseBottom = headTop + TOTAL_H * s
  ctx.save()
  ctx.translate(cx, baseBottom + 8)
  ctx.scale(237, 32)
  const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  sh.addColorStop(0, 'rgba(0,0,0,0.55)')
  sh.addColorStop(0.7, 'rgba(0,0,0,0)')
  ctx.fillStyle = sh
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()

  // column (front face)
  const colX = cx - (COL_W / 2) * s
  const colY = headTop + headH
  const colW = COL_W * s
  const colH = COL_H * s
  const colGrad = ctx.createLinearGradient(0, colY, 0, colY + colH)
  colGrad.addColorStop(0, '#262626')
  colGrad.addColorStop(1, '#0b0b0b')
  ctx.fillStyle = colGrad
  ctx.fillRect(colX, colY, colW, colH)
  ctx.fillStyle = '#000'
  roundRect(ctx, colX + 7 * s, colY + 120 * s, colW - 14 * s, 3 * s, 2)
  ctx.fill()
  roundRect(ctx, colX + 7 * s, colY + 250 * s, colW - 14 * s, 3 * s, 2)
  ctx.fill()

  // base slab
  const baseW = BASE_W * s
  roundRect(ctx, cx - baseW / 2, colY + colH, baseW, BASE_H * s, 3)
  ctx.fillStyle = '#141414'
  ctx.fill()

  // head (front face)
  const headGrad = ctx.createLinearGradient(0, headTop, 0, headTop + headH)
  headGrad.addColorStop(0, '#fcfcfb')
  headGrad.addColorStop(1, '#e9e9e5')
  roundRect(ctx, headX, headTop, headW, headH, 14 * s)
  ctx.fillStyle = headGrad
  ctx.fill()

  // camera dot
  ctx.beginPath()
  ctx.arc(cx, headTop + (9 + 8) * s, 8 * s, 0, Math.PI * 2)
  ctx.fillStyle = '#111'
  ctx.fill()
  ctx.lineWidth = 2 * s
  ctx.strokeStyle = '#d8d8d4'
  ctx.stroke()

  // screen + AI photo (object-fit: cover, object-position 50% 24%)
  const scrX = headX + 18 * s
  const scrY = headTop + 30 * s
  const scrW = headW - 36 * s
  const scrH = headH - 48 * s
  roundRect(ctx, scrX, scrY, scrW, scrH, 8 * s)
  ctx.save()
  ctx.clip()
  ctx.fillStyle = '#0a0a09'
  ctx.fillRect(scrX, scrY, scrW, scrH)
  try {
    const img = new Image()
    img.src = PHOTO_SRC
    await img.decode()
    const ia = img.naturalWidth / img.naturalHeight
    const sa = scrW / scrH
    let dw: number, dh: number, dx: number, dy: number
    if (ia > sa) {
      dh = scrH
      dw = dh * ia
      dx = scrX - (dw - scrW) * 0.5
      dy = scrY
    } else {
      dw = scrW
      dh = dw / ia
      dx = scrX
      dy = scrY - (dh - scrH) * 0.24
    }
    ctx.drawImage(img, dx, dy, dw, dh)
  } catch {
    /* photo missing: keep dark screen */
  }
  // glass reflection sweep (subtle, matches the CSS gradient)
  const refl = ctx.createLinearGradient(scrX, scrY, scrX + scrW, scrY + scrH)
  refl.addColorStop(0, 'rgba(255,255,255,0.09)')
  refl.addColorStop(0.3, 'rgba(255,255,255,0)')
  refl.addColorStop(0.7, 'rgba(255,255,255,0)')
  refl.addColorStop(1, 'rgba(255,255,255,0.05)')
  ctx.fillStyle = refl
  ctx.fillRect(scrX, scrY, scrW, scrH)

  // AI chip
  try {
    await document.fonts.load(`700 ${11 * s}px Syne`)
  } catch {
    /* fall back to default font metrics */
  }
  ctx.font = `700 ${11 * s}px Syne, sans-serif`
  const label = 'AI ✦'
  const tw = ctx.measureText(label).width + 11 * s * 0.08 * label.length
  const chipH = 11 * s + 8 * s
  const chipW = tw + 20 * s
  const chipX = scrX + 10 * s
  const chipY = scrY + scrH - 9 * s - chipH
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH)
  chipGrad.addColorStop(0, '#9868F8')
  chipGrad.addColorStop(1, '#4888F8')
  roundRect(ctx, chipX, chipY, chipW, chipH, chipH / 2)
  ctx.fillStyle = chipGrad
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, chipX + 10 * s, chipY + chipH / 2 + 1)
  ctx.restore()

  return cv
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

/* screen-space coords (y down); texture uploaded unflipped, so sample with
   uv.y as-is. Elastic wave = derivative-of-Gaussian displacement, plus a
   weaker echo ring behind, chromatic split and a specular catch. */
const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uAsp;      // (aspect, 1)
uniform vec2 uC;        // wave centre, screen UV
uniform float uR;       // main radius (aspect units)
uniform float uW;       // band width
uniform float uWo;      // outer-side width ratio — the leading skirt races ahead
uniform float uAmp;     // displacement strength
uniform float uEcho;    // echo-wave strength — fades out before the slow-down
vec3 sample3(vec2 p, vec2 off) {
  return vec3(
    texture2D(uTex, clamp(p + off * 1.05, 0.001, 0.999)).r,
    texture2D(uTex, clamp(p + off, 0.001, 0.999)).g,
    texture2D(uTex, clamp(p + off * 0.95, 0.001, 0.999)).b
  );
}
void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y);          // screen coords, y down
  vec2 q = (p - uC) * uAsp;
  float d = length(q);
  vec2 dir = q / max(d, 1e-5);

  // asymmetric band: the outer (leading) side widens over time, so the
  // wavefront's outer skirt accelerates ahead of the crest
  float x1 = (d - uR) / (d > uR ? uW * uWo : uW);
  float g1 = exp(-x1 * x1);
  float s1 = -x1 * g1;                         // elastic push/pull
  float r2 = uR * 0.58;
  float x2 = (d - r2) / (uW * 0.85);
  float g2 = exp(-x2 * x2);
  float s2 = -x2 * g2 * 0.42 * uEcho;          // echo wave

  vec2 off = dir * (s1 + s2) * uAmp / uAsp;
  vec3 col = sample3(vec2(vUv.x, vUv.y), vec2(off.x, -off.y));

  // travelling specular catch + faint dispersion fringes on the main wave
  float spec = pow(g1, 2.6) * 0.16 + pow(g2, 2.6) * 0.05 * uEcho;
  col += vec3(1.0, 0.985, 0.95) * spec;
  col.b += 0.045 * g1 * smoothstep(0.0, 1.0, x1);
  col.r += 0.035 * g1 * smoothstep(0.0, 1.0, -x1);

  gl_FragColor = vec4(col, 1.0);
}`

export function LensWave({
  fire,
  fade,
}: {
  fire: number
  /** optional external fade multiplier (0..1) read every frame — lets the
   *  caller dissolve the overlay early (e.g. when the stage background has
   *  started lightening behind it, so the dark snapshot never lingers) */
  fade?: () => number
}) {
  const [active, setActive] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!fire) return
    let cancelled = false
    let raf = 0
    let cleanupGl: (() => void) | null = null
    setActive(true)

    const run = async () => {
      // wait a frame so the canvas is mounted
      await new Promise((r) => requestAnimationFrame(r))
      const canvas = canvasRef.current
      if (!canvas || cancelled) return
      const host = canvas.parentElement as HTMLElement
      const w = host.clientWidth
      const h = host.clientHeight
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      const snap = await paintSnapshot(w, h, dpr)
      if (cancelled) return

      const gl = (canvas.getContext('webgl', { premultipliedAlpha: true }) ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
      if (!gl) {
        setActive(false)
        return
      }

      const sh = (type: number, src: string) => {
        const o = gl.createShader(type)!
        gl.shaderSource(o, src)
        gl.compileShader(o)
        return o
      }
      const prog = gl.createProgram()!
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        setActive(false)
        return
      }
      gl.useProgram(prog)

      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'aPos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      // canvas y-down → flip so v=0 is the bottom, then FRAG flips back
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snap)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      gl.viewport(0, 0, canvas.width, canvas.height)
      const uAsp = gl.getUniformLocation(prog, 'uAsp')
      const uC = gl.getUniformLocation(prog, 'uC')
      const uR = gl.getUniformLocation(prog, 'uR')
      const uW = gl.getUniformLocation(prog, 'uW')
      const uWo = gl.getUniformLocation(prog, 'uWo')
      const uAmp = gl.getUniformLocation(prog, 'uAmp')
      const uEcho = gl.getUniformLocation(prog, 'uEcho')
      const asp = w / h
      gl.uniform2f(uAsp, asp, 1)
      gl.uniform2f(uC, 0.5, 0.42)

      cleanupGl = () => {
        gl.deleteTexture(tex)
        gl.deleteBuffer(buf)
        gl.deleteProgram(prog)
      }

      const DUR = 1750
      const FADE = 140
      const rMax = Math.hypot(asp * 0.5, 0.58) + 0.12
      const t0 = performance.now()
      const step = (now: number) => {
        if (cancelled) return
        const t = Math.min(1, (now - t0) / DUR)
        const e = 1 - Math.pow(1 - t, 2.1)
        // crossfade the overlay in/out so snapshot seams never pop
        const ms = now - t0
        const timeFade = Math.min(1, ms / FADE) * Math.min(1, Math.max(0, (DUR - ms) / (FADE * 1.8)))
        const extFade = fade ? Math.max(0, Math.min(1, fade())) : 1
        const op = timeFade * extFade
        canvas.style.opacity = op.toFixed(3)
        // once the caller has fully dissolved us, stop early
        if (extFade <= 0.02 && ms > FADE) {
          setActive(false)
          return
        }
        gl.uniform1f(uR, 0.015 + e * rMax)
        gl.uniform1f(uW, 0.075 + 0.05 * t)
        // outer skirt accelerates: symmetric at first, stretching ahead late
        gl.uniform1f(uWo, 1 + 1.6 * t * t)
        gl.uniform1f(uAmp, 0.042 * (1 - 0.55 * t))
        // the echo wave dies out by ~60% of the run — gone before the
        // wavefront enters its slow-down phase
        const echoK = Math.max(0, 1 - t / 0.6)
        gl.uniform1f(uEcho, echoK * echoK)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        if (t < 1) raf = requestAnimationFrame(step)
        else setActive(false)
      }
      raf = requestAnimationFrame(step)
    }
    void run()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      if (cleanupGl) cleanupGl()
    }
  }, [fire])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0,
      }}
    />
  )
}
