/* ==========================================================================
   Homepage behaviour — ported from the design canvas Homepage artboard.

   The canvas shipped this as a DCLogic component: a componentDidMount that
   called five methods plus one inline IIFE. The methods are plain functions
   here and the IIFE's nav half now lives in site-nav.js, which every page
   loads. Everything else is unchanged.
   ========================================================================== */
(function () {
    'use strict';
    /* ======================================================================
       Section behaviours — the canvas component's methods, verbatim.
       ====================================================================== */
    function whatWeBuild() {
      const nodes = [].slice.call(document.querySelectorAll('.wwb-node'));
      const lines = [].slice.call(document.querySelectorAll('.wwb-line'));
      const panels = [].slice.call(document.querySelectorAll('.wwb-panel'));
      if (!nodes.length || nodes[0].dataset.on) return;
      const set = (i) => {
        nodes.forEach((n) => {
          const on = n.dataset.i === String(i);
          n.querySelector('.wwb-dot').style.background = on ? '#f5823f' : '#0b3d2b';
          n.querySelector('.wwb-dot').style.transform = on ? 'scale(1.15)' : 'scale(1)';
          n.querySelector('.wwb-title').style.color = on ? '#0b3d2b' : '#8d968f';
        });
        lines.forEach((l) => {
          const on = l.dataset.i === String(i);
          l.setAttribute('stroke', on ? '#f5823f' : '#cfd8d3');
          l.setAttribute('stroke-width', on ? '2' : '1.5');
        });
        panels.forEach((p) => { p.style.display = p.dataset.i === String(i) ? 'flex' : 'none'; });
      };
      nodes.forEach((n) => {
        n.dataset.on = '1';
        const i = n.dataset.i;
        n.addEventListener('mouseenter', () => set(i));
        n.addEventListener('focus', () => set(i));
        n.addEventListener('click', () => set(i));
      });
      set(0);
    }
    function fourA() {
      const rail = document.querySelector('.fa-rail');
      if (!rail || rail.dataset.on) return;
      rail.dataset.on = '1';
      const fill = rail.querySelector('.fa-fill');
      const steps = [].slice.call(rail.querySelectorAll('.fa-step'));
      const paint = (i) => {
        steps.forEach((st, k) => {
          const on = i !== null && k <= i;
          st.querySelector('.fa-dot').style.background = on ? '#f5823f' : '#ffffff';
          st.querySelector('.fa-dot').style.borderColor = on ? '#f5823f' : '#dde3df';
          st.querySelector('.fa-dot').style.transform = (i === k) ? 'scale(1.12)' : 'scale(1)';
          st.querySelector('.fa-icon').setAttribute('stroke', on ? '#ffffff' : '#0b5d40');
          st.querySelector('.fa-title').style.color = on ? '#0b3d2b' : '#111714';
        });
        fill.style.width = i === null ? '0%' : (i / (steps.length - 1)) * 75 + '%';
      };
      steps.forEach((st, k) => {
        st.addEventListener('mouseenter', () => paint(k));
        st.addEventListener('click', () => paint(k));
      });
      rail.addEventListener('mouseleave', () => paint(null));
      paint(null);
    }
    function smoke() {
      const cv = document.getElementById('hero-smoke');
      if (!cv || cv.dataset.on) return;
      cv.dataset.on = '1';
      const gl = cv.getContext('webgl', { antialias: false, alpha: false });
      if (!gl) { cv.style.background = 'radial-gradient(120% 90% at 30% 20%, #16352a, #07100c 70%)'; return; }
      const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
      const fs = [
        'precision highp float;uniform vec2 u_res;uniform float u_t;',
        'vec2 hash(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.+2.*fract(sin(p)*43758.5453);}',
        'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
        'return mix(mix(dot(hash(i),f),dot(hash(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(hash(i+vec2(0,1)),f-vec2(0,1)),dot(hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}',
        'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<6;i++){s+=a*noise(p);p*=2.02;a*=.5;}return s;}',
        'void main(){vec2 uv=(gl_FragCoord.xy-.5*u_res)/u_res.y;float t=u_t*.045;',
        'vec2 q=vec2(fbm(uv*1.3+vec2(0.,t)),fbm(uv*1.3+vec2(5.2,1.3-t)));',
        'vec2 r=vec2(fbm(uv*1.5+4.*q+vec2(1.7,9.2)+t*1.3),fbm(uv*1.5+4.*q+vec2(8.3,2.8)-t*1.05));',
        'float f=fbm(uv*1.7+4.*r);float v=smoothstep(-.25,.85,f);',
        'float e=pow(max(0.,1.-abs(f*1.7-.22)),7.);',
        'vec3 col=mix(vec3(.027,.055,.043),vec3(.46,.62,.55),v*.62);',
        'col+=vec3(.42,.62,.52)*e*.85;',
        'col+=vec3(.96,.51,.25)*pow(max(0.,v-.55),2.)*.30;',
        'float vg=smoothstep(1.35,.15,length(uv*vec2(.72,1.)));',
        'gl_FragColor=vec4(col*mix(.35,1.,vg),1.);}'
      ].join('\n');
      const mk = (t, src) => { const sh = gl.createShader(t); gl.shaderSource(sh, src); gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(sh)); return sh; };
      const pr = gl.createProgram();
      gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(pr); gl.useProgram(pr);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p');
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const uRes = gl.getUniformLocation(pr, 'u_res'), uT = gl.getUniformLocation(pr, 'u_t');
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const size = () => { const r = cv.getBoundingClientRect();
        cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr));
        gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uRes, cv.width, cv.height); };
      size();
      window.addEventListener('resize', size);
      const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const t0 = performance.now();
      const frame = () => { gl.uniform1f(uT, still ? 12 : (performance.now() - t0) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3); if (!still) requestAnimationFrame(frame); };
      frame();
    }

    [smoke, whatWeBuild, fourA].forEach(function (fn) {
        try { fn(); } catch (e) { console.warn(e); }
    });
}());
