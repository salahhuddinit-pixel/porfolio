                                                                                                                                                                                                                (()=>{
const D=window.PORTFOLIO,$=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const IC={web:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3M8 10l-2 2 2 2M16 10l2 2-2 2"/></svg>',ads:'<svg viewBox="0 0 24 24"><path d="M3 11v3l12 5V6L3 11zM15 9.5a3 3 0 0 1 0 5M6 14.5V19"/></svg>',auto:'<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H14a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h5.5"/></svg>'};
const grid=$('#pgrid'),tabsIn=$('.tabs-in'),ind=$('.tab-ind'),cnt=$('#pcount'),lb=$('#lb');
let cur,list=[],oi=-1,opener=null;
const catOf=id=>D.categories.find(c=>c.id===id);
const media=(p,alt='')=>p.image?`<img src="${esc(p.image)}" alt="${esc(alt)}" loading="lazy">`:`<span class="wbg ${p.look||'g1'}"></span>`;

D.categories.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='tab';b.id='tab-'+c.id;b.dataset.id=c.id;b.textContent=c.label;b.setAttribute('role','tab');b.setAttribute('aria-controls','pgrid');tabsIn.appendChild(b)});

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const card=(p,i)=>`<button class="pc" type="button" style="--i:${i}" data-i="${i}" aria-haspopup="dialog"><span class="pt">${media(p)}<span class="pi">${IC[p.icon||'web']}</span></span><span class="pb"><strong class="pn">${esc(p.title)}</strong><span class="pd">${esc(p.desc)}</span></span></button>`;
const render=()=>{
  list=D.projects.filter(p=>p.cat===cur);
  grid.className='pgrid '+catOf(cur).aspect;grid.setAttribute('aria-labelledby','tab-'+cur);
  grid.innerHTML=list.map(card).join('');
  cnt.textContent=list.length+(list.length===1?' project':' projects');
  $$('.pc',grid).forEach(el=>io.observe(el));
};
const moveInd=()=>{const t=$('.tab[aria-selected="true"]',tabsIn);if(!t)return;ind.style.width=t.offsetWidth+'px';ind.style.transform=`translateX(${t.offsetLeft}px)`};
const select=(id,first)=>{
  if(!catOf(id))id=D.categories[0].id;
  if(id===cur)return;cur=id;
  $$('.tab',tabsIn).forEach(t=>{const on=t.dataset.id===id;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});
  moveInd();
  if(first||reduce){render();return}
  grid.classList.add('out');
  setTimeout(()=>{render();grid.classList.remove('out')},300);
};
tabsIn.addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;select(t.dataset.id);history.replaceState(null,'','#'+t.dataset.id)});
tabsIn.addEventListener('keydown',e=>{
  const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;
  const tabs=$$('.tab',tabsIn),k=tabs.findIndex(t=>t.dataset.id===cur),n=tabs[(k+d+tabs.length)%tabs.length];n.focus();n.click();
});
select(location.hash.slice(1),true);
if(location.hash&&!reduce)setTimeout(()=>$('.tabs').scrollIntoView({behavior:'smooth',block:'start'}),350);

document.fonts&&document.fonts.ready.then(moveInd);addEventListener('resize',moveInd);

/* lightbox */
const DEF={
 'web-development':['Design matched to your brand','Responsive layout for desktop and mobile','Page structure and navigation','Contact and enquiry forms'],
 'digital-advertising':['Campaign setup','Audience targeting','Ad creatives and copy','Budget management','Conversion tracking','Optimization and reporting'],
 'workflow-automation':['Workflow planning','Trigger and API integrations','Conditional logic','Testing before going live','Documentation and handover']};
const L={m:$('#lb-media'),chip:$('#lb-chip'),t:$('#lb-title'),x:$('#lb-text'),n:$('#lb-count'),sh:$('#lb-sh'),sc:$('#lb-scope'),res:$('#lb-res'),ln:$('#lb-link')};
const fill=()=>{const p=list[oi];L.m.innerHTML=media(p,p.title)+`<span class="pi big">${IC[p.icon||'web']}</span>`;L.chip.textContent=catOf(cur).label;L.t.textContent=p.title;L.x.textContent=p.long||p.desc;L.n.textContent=(oi+1)+' of '+list.length;
  const sc=p.scope||DEF[p.cat]||[];
  L.sh.hidden=L.sc.hidden=!sc.length;L.sc.innerHTML=sc.map(s=>`<li>${esc(s)}</li>`).join('');
  const rs=p.results||[];L.res.hidden=!rs.length;L.res.innerHTML=rs.map(r=>`<div class="res"><b>${esc(r[1])}</b><span>${esc(r[0])}</span></div>`).join('');
  L.ln.hidden=!p.link;if(p.link)L.ln.href=p.link};
const open=i=>{oi=i;opener=document.activeElement;lb.classList.toggle('tall',catOf(cur).aspect==='tall');fill();lb.classList.add('open');document.body.style.overflow='hidden';$('#lb-close').focus()};
const close=()=>{lb.classList.remove('open');document.body.style.overflow='';if(opener)opener.focus()};
const step=d=>{oi=(oi+d+list.length)%list.length;fill()};
grid.addEventListener('click',e=>{const c=e.target.closest('.pc');if(c)open(+c.dataset.i)});
lb.addEventListener('click',e=>{if(e.target===lb||e.target.closest('#lb-close'))close()});
$('#lb-prev').onclick=()=>step(-1);$('#lb-next').onclick=()=>step(1);
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')close();
  else if(e.key==='ArrowLeft')step(-1);
  else if(e.key==='ArrowRight')step(1);
  else if(e.key==='Tab'){const f=$$('button',lb),a=document.activeElement;
    if(e.shiftKey&&a===f[0]){e.preventDefault();f[f.length-1].focus()}
    else if(!e.shiftKey&&a===f[f.length-1]){e.preventDefault();f[0].focus()}}
});
})();
