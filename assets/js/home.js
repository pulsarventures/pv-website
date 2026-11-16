/* ==========================================================================
   Homepage behaviour, from the Pulsar Homepage redesign artifact (Nov 2026):
   the pulsar field that travels between [data-anchor] slots as you scroll and
   becomes the logo core on each mark, the 4A rail, scroll reveals, ecosystem
   chip/logo marquees, the products carousel and the P-shaped landscape cards.
   Nav behaviour lives in site-nav.js.
   ========================================================================== */
(function(){
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) document.querySelectorAll('svg').forEach(v=>v.pauseAnimations&&v.pauseAnimations());
  const T = document.getElementById('field');
  const anchors = [...document.querySelectorAll('[data-anchor]')];
  const speeders = [...document.querySelectorAll('[data-speed]')];
  let A = [];
  function measure(){
    const sy = scrollY, sx = scrollX;
    A = anchors.filter(a=>a.offsetParent!==null).map(a=>{
      const r = a.getBoundingClientRect();
      const logo = a.hasAttribute('data-logo');
      let s = +a.dataset.scale||1, dw = 1.4, dd = 5, dg = 7;
      if(logo){ // land exactly on the mark: outer loop = 25 mark units (mark viewBox is 224 wide)
        const mw = a.closest('.mark-wrap').getBoundingClientRect().width;
        s = (20.5/224*mw) / (250*T.offsetWidth/1450);
        dw = 0.0105*mw; dd = 0.01; dg = 0.024*mw; // dot size and spacing of the logo's field
        const k = +(a.dataset.k||1); s *= k; dw *= Math.max(k,.85); dg *= k; // optional shrink so the core sits clear of the petals
      }
      let dy = 0;
      if(a.hasAttribute('data-engage')){
        const n = [...a.parentElement.querySelectorAll('.mode .node')].map(e=>e.getBoundingClientRect());
        const span = Math.abs((n[1].left+n[1].width/2)-(n[0].left+n[0].width/2)) || 320;
        // Figma: loops meet at the centre node; each side node sits on the outer edge of the middle loop (diameter = span)
        const Rout = (span/2) * 250/185;          // middle loop r = span/2
        s = Rout*1450/(250*T.offsetWidth);
        dy = 0;
      }
      return {x:r.left+r.width/2+sx, y:r.top+r.height/2+sy+dy, s, q:+(a.dataset.sy||1), r:+(a.dataset.rot||0), o:+(a.dataset.opacity||1), L:logo?1:0, dw, dd, dg, c:hex(a.dataset.stroke||'#D3D0DC'), bg:hex(a.dataset.bg||'#FFFFFF')};
    });
    A.sort((p,q)=>p.y-q.y);
  }
  const hex = h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const mix = (p,q,t)=>p.map((v,i)=>Math.round(v+(q[i]-v)*t));
  const ease = t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
  const lerp = (a,b,t)=>a+(b-a)*t;
  let cur = null;
  function target(){
    const sy = scrollY, focus = sy + innerHeight*0.55;
    if(!A.length) return null;
    let i = 0;
    while(i < A.length-1 && A[i+1].y <= focus) i++;
    const a = A[i], b = A[Math.min(i+1,A.length-1)];
    let t = 0;
    if(b!==a && focus>a.y){ t = clamp((focus-a.y)/(b.y-a.y),0,1); t = ease(clamp((t-0.12)/0.76,0,1)); }
    const dip = Math.sin(Math.PI*t);
    return {
      x: lerp(a.x,b.x,t) - scrollX,
      y: lerp(a.y,b.y,t) - sy,
      s: lerp(a.s,b.s,t), q: lerp(a.q,b.q,t),
      o: lerp(a.o,b.o,t)*(1-0.35*dip),
      r: lerp(a.r,b.r,t),
      L: lerp(a.L,b.L,t), dw: lerp(a.dw,b.dw,t), dd: lerp(a.dd,b.dd,t), dg: lerp(a.dg,b.dg,t),
      c: mix(a.c,b.c,t), bg: mix(a.bg,b.bg,t)
    };
  }
  function parallax(){
    const vc = innerHeight/2;
    for(const el of speeders){
      const r = el.parentElement.getBoundingClientRect();
      const d = (r.top + r.height/2 - vc) * (+el.dataset.speed);
      el.style.transform = 'translate3d(0,'+d.toFixed(1)+'px,0)';
    }
  }
  // 4A rail draws as you scroll through it
  const prog = document.getElementById('railReveal'), track = document.getElementById('faTrack');
  const steps = [...document.querySelectorAll('.step')];
  
  function rail(){
    const r = track.getBoundingClientRect();
    const p = clamp((innerHeight*0.95 - r.top)/(innerHeight*0.5),0,1);
    prog.setAttribute('width', (150 + 820*p).toFixed(1));
    steps.forEach((s,k)=>s.classList.toggle('on', p > (k+0.5)/steps.length*0.95));
  }
  // dashed background loops (L=0) morph into the logo's dotted field, beams and core (L=1)
  const loops = document.getElementById('loops'), fL = document.getElementById('fL'), fR = document.getElementById('fR');
  const beads = document.getElementById('beads'), core = document.getElementById('logoCore');
  const ring = document.getElementById('cRing'), dot = document.getElementById('cCore');
  let off = 0, last = performance.now(), hl = '';
  document.querySelectorAll('.mode[data-side]').forEach(m=>{
    const on = ()=>{ hl = m.dataset.side; }, off_ = ()=>{ hl = ''; };
    m.addEventListener('mouseenter', on); m.addEventListener('mouseleave', off_);
    m.addEventListener('focus', on); m.addEventListener('blur', off_);
  });
  function paintField(c){
    const L = clamp(c.L,0,1), now = performance.now(); if(!reduce) off += (now-last)*0.004; last = now;
    const col = `rgb(${c.c.join(',')})`;
    const u = c.s*T.offsetWidth/1450; // screen px per field unit
    loops.style.stroke = col; loops.style.strokeWidth = (c.dw/u).toFixed(2);
    loops.style.strokeDasharray = (c.dd/u).toFixed(2)+' '+(c.dg/u).toFixed(2);
    const o = (off*(c.dd+c.dg)/12)/u; // flow at a steady on-screen pace
    fL.style.strokeDashoffset = (-o).toFixed(2); fR.style.strokeDashoffset = o.toFixed(2);
    beads.style.opacity = (1-L*1.4).toFixed(3);
    const k = clamp((L-0.55)/0.45,0,1);
    core.setAttribute('opacity', k.toFixed(3));
    core.setAttribute('transform', `rotate(${(-c.r).toFixed(2)}) rotate(19) scale(${(0.6+0.4*k).toFixed(3)})`);
    ring.style.fill = `rgb(${c.bg.join(',')})`; ring.style.stroke = col; dot.style.fill = col;
    fL.style.stroke = hl.includes('L') ? 'var(--orange)' : '';
    fR.style.stroke = hl.includes('R') ? 'var(--orange)' : '';
    T.style.zIndex = L>0.6 ? 3 : 1;
  }
  function frame(){
    const tg = target();
    if(tg){
      if(!cur || reduce) cur = {...tg};
      else { const k = 0.14; for(const p of ['x','y','s','q','o','r','L','dw','dd','dg']) cur[p] += (tg[p]-cur[p])*k; cur.c = tg.c; cur.bg = tg.bg; }
      T.style.transform = `translate3d(${cur.x.toFixed(1)}px,${cur.y.toFixed(1)}px,0) scale(${cur.s.toFixed(4)},${(cur.s*cur.q).toFixed(4)}) rotate(${cur.r.toFixed(2)}deg)`;
      T.style.opacity = cur.o.toFixed(3);
      paintField(cur);
    }
    parallax(); rail();
    requestAnimationFrame(frame);
  }
  // reveal on scroll (content stays visible at rest if JS fails)
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target);} }),{rootMargin:'0px 0px -8% 0px'}) : null;
  if(io && !reduce){ document.querySelectorAll('.reveal').forEach((el,i)=>{ const r = el.getBoundingClientRect(); if(r.top > innerHeight){ el.classList.add('pre'); el.style.transitionDelay = (i%2)*90+'ms'; io.observe(el);} }); }
  // ecosystem chips: if a row doesn't fit, duplicate it and run it as a seamless loop
  function chipRun(){
    document.querySelectorAll('.chips').forEach(c=>{
      const t = c.querySelector('.chip-track');
      if(!t.dataset.n) t.dataset.n = t.children.length;
      [...t.children].slice(+t.dataset.n).forEach(x=>x.remove());
      c.classList.remove('run');
      if(t.scrollWidth > c.clientWidth + 1){
        [...t.children].forEach(x=>{ const y = x.cloneNode(true); y.setAttribute('aria-hidden','true'); t.appendChild(y); });
        c.classList.add('run');
        t.style.setProperty('--dur', (t.scrollWidth/2/28).toFixed(1)+'s');
      }
    });
  }
  // partner logos: missing image falls back to its name; row is duplicated for a seamless loop
  document.querySelectorAll('.logo-track').forEach(t=>{
    t.querySelectorAll('img').forEach(im=>{ const swap = ()=>{ const s = document.createElement('span'); s.className = 'lg-text'; s.textContent = im.alt; im.replaceWith(s); }; if(im.complete && !im.naturalWidth) swap(); else im.addEventListener('error', swap); });
    setTimeout(()=>{ [...t.children].forEach(x=>{ const y = x.cloneNode(true); y.setAttribute('aria-hidden','true'); t.appendChild(y); }); t.style.setProperty('--dur', Math.max(16, t.scrollWidth/2/30).toFixed(1)+'s'); }, 600);
  });
  chipRun(); addEventListener('resize', chipRun); if(document.fonts) document.fonts.ready.then(chipRun);
  // carousel: arrows step one card; the bar shows which slice of the list is in view
  const tr = document.getElementById('track'), count = document.getElementById('count'), bar = document.getElementById('bar');
  const cards = [...tr.children], pad = n=>String(n).padStart(2,'0');
  const cw = ()=>cards[0].getBoundingClientRect().width + 20;
  const step = dir=>tr.scrollBy({left:dir*cw(), behavior: reduce?'auto':'smooth'});
  document.getElementById('prev').onclick = ()=>step(-1);
  document.getElementById('next').onclick = ()=>step(1);
  function sync(){
    const w = cw(), per = Math.max(1, Math.round(tr.clientWidth/w)), n = cards.length;
    const i = Math.min(Math.round(tr.scrollLeft/w), Math.max(0, n-per));
    bar.style.width = (Math.min(per,n)/n*100)+'%'; bar.style.left = (i/n*100)+'%';
    count.textContent = (per>1 ? pad(i+1)+'–'+pad(Math.min(i+per,n)) : pad(i+1))+' / '+pad(n);
  }
  tr.addEventListener('scroll', sync, {passive:true}); addEventListener('resize', sync); sync();
  // products: "Earlier builds" toggle
  const eb = document.getElementById('earlierBtn'), el = document.getElementById('earlierList');
  if(eb && el) eb.addEventListener('click', ()=>{ const o = eb.getAttribute('aria-expanded')==='true'; eb.setAttribute('aria-expanded', String(!o)); el.hidden = o; });
  // landscape C: draw each card as the logo's P-shaped petal, rotated like the mark so every bowl faces the core
  function pforms(){
    document.querySelectorAll('.pform .pcard').forEach(c=>{
      const W = c.offsetWidth, H = c.offsetHeight; if(!W) return;
      const cl = c.classList, rot = cl.contains('tr')||cl.contains('bl');
      const pw = rot?H:W, ph = rot?W:H, m = Math.min(pw,ph);
      const r = 26, Rt = Math.min(.3*m,90), Rb = Math.min(.34*m,104), sw = .38*pw, sh = Math.min(.14*ph,40), yb = ph-sh, n = 10, rs = 14;
      const d = `M${r} 0H${pw-Rt}A${Rt} ${Rt} 0 0 1 ${pw} ${Rt}V${yb-Rb}A${Rb} ${Rb} 0 0 1 ${pw-Rb} ${yb}H${sw+n}A${n} ${n} 0 0 0 ${sw} ${yb+n}V${ph-rs}A${rs} ${rs} 0 0 1 ${sw-rs} ${ph}H${r}A${r} ${r} 0 0 1 0 ${ph-r}V${r}A${r} ${r} 0 0 1 ${r} 0Z`;
      const tf = cl.contains('tr') ? `translate(${W} 0) rotate(90)` : cl.contains('bl') ? `translate(0 ${H}) rotate(-90)` : cl.contains('br') ? `rotate(180 ${W/2} ${H/2})` : '';
      const s = c.querySelector('.pshape'), p = s.querySelector('path');
      s.setAttribute('viewBox',`0 0 ${W} ${H}`); p.setAttribute('d',d); p.setAttribute('transform',tf);
    });
  }
  // arrow follows the cycle: hover a petal and the arrow moves to point at the next one (clockwise)
  document.querySelectorAll('.pform').forEach(g=>{
    g.querySelectorAll('.pcard').forEach(c=>{
      const pos = ['tl','tr','br','bl'].find(p=>c.classList.contains(p));
      c.addEventListener('mouseenter', ()=>{ g.dataset.from = pos; });
      c.addEventListener('mouseleave', ()=>{ delete g.dataset.from; });
    });
  });
  pforms(); addEventListener('resize', pforms); if(document.fonts) document.fonts.ready.then(pforms);
  if('ResizeObserver' in window){ const ro = new ResizeObserver(pforms); document.querySelectorAll('.pform .pcard').forEach(c=>ro.observe(c)); }
  measure();
  addEventListener('resize', measure);
  addEventListener('load', measure);
  if(document.fonts) document.fonts.ready.then(measure);
  new ResizeObserver(measure).observe(document.body);
  requestAnimationFrame(frame);
})();
