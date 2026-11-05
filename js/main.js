(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav */
const nav=$('.nav'),tg=$('.nav-toggle');
tg.addEventListener('click',()=>{const o=nav.classList.toggle('open');tg.setAttribute('aria-expanded',o);tg.setAttribute('aria-label',o?'Close menu':'Open menu')});
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const onScroll=()=>nav.classList.toggle('solid',scrollY>30);onScroll();addEventListener('scroll',onScroll,{passive:true});

/* scroll reveal */
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
$$('.rv').forEach(el=>rio.observe(el));

/* counters */
const count=el=>{
  const to=+el.dataset.to,dec=+(el.dataset.dec||0),suf=el.dataset.suf||'';
  if(reduce){el.textContent=to.toFixed(dec)+suf;return}
  const t0=performance.now(),dur=1900;
  const step=t=>{const p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec)+(p===1?suf:'');if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
};
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){count(e.target);cio.unobserve(e.target)}}),{threshold:.6});
$$('.num').forEach(el=>cio.observe(el));

/* testimonials */
if($('.tst')){
const tr=$('.tst-track'),slides=$$('.slide',tr),dots=$('.dots');
let idx=0,timer;
slides.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Show testimonial '+(i+1));b.onclick=()=>{go(i);restart()};dots.appendChild(b)});
const go=n=>{idx=(n+slides.length)%slides.length;tr.style.transform=`translateX(-${idx*100}%)`;$$('button',dots).forEach((b,i)=>b.classList.toggle('on',i===idx))};
const restart=()=>{clearInterval(timer);if(!reduce)timer=setInterval(()=>go(idx+1),6500)};
$$('.arr').forEach(b=>b.onclick=()=>{go(idx+ +b.dataset.dir);restart()});
const box=$('.tst');box.addEventListener('mouseenter',()=>clearInterval(timer));box.addEventListener('mouseleave',restart);
let sx=null;box.addEventListener('pointerdown',e=>sx=e.clientX);
box.addEventListener('pointerup',e=>{if(sx!==null&&Math.abs(e.clientX-sx)>50){go(idx+(e.clientX<sx?1:-1));restart()}sx=null});
go(0);restart();
}

/* marquee: duplicate once for a seamless loop */
const mt=$('.marq-track');
if(mt){const set=mt.innerHTML;mt.innerHTML=set+set;
const all=$$('.bn',mt);all.slice(all.length/2).forEach(n=>n.setAttribute('aria-hidden','true'))}

const yr=$('#yr');if(yr)yr.textContent=new Date().getFullYear();
})();
