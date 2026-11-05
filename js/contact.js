(()=>{
const WA='923195951943';
const f=document.getElementById('cform'),out=document.getElementById('fmsg');
f.addEventListener('submit',e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(f));
  const lines=[`Name: ${d.name}`,`Email: ${d.email}`,`Project type: ${d.type}`,`Budget: ${d.budget||'Not specified'}`,'',d.message];
  out.className='fmsg ok';
  out.textContent=`Thanks, ${d.name.trim().split(' ')[0]}. WhatsApp is opening with your message ready to send. Just press send there.`;
  const url=`https://wa.me/${WA}?text=${encodeURIComponent(`Hi Ubaidullah, I found you through your website.\n\n`+lines.join('\n'))}`;
  if(!window.open(url,'_blank','noopener'))location.href=url;
});
})();
