
(function(){
  // 12h select -> hidden 24h
  const timeSel = document.getElementById('time_display');
  const timeHidden = document.getElementById('time');
  if (timeSel && timeHidden) {
    timeSel.addEventListener('change', () => { timeHidden.value = timeSel.value; });
  }

  // Preselect Large+Restoration from hero
  document.querySelectorAll('[data-big="1"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const ps = document.getElementById('project_size'); if (ps) ps.value = 'large';
        const sv = document.getElementById('service'); if (sv) sv.value = 'Restoration';
      }, 200);
    });
  });

  // Toggle kitchen quick estimator
  const restoType = document.getElementById('resto-type');
  function toggleKitchen(val){
    const k = document.getElementById('kitchen-estimator');
    if (!k) return;
    (val === 'kitchen') ? k.classList.remove('hidden') : k.classList.add('hidden');
  }
  if (restoType){ restoType.addEventListener('change', e => toggleKitchen(e.target.value)); }

  // Kitchen quick estimator (min $800)
  const kSize = document.getElementById('k-size');
  const kPreset = document.getElementById('k-preset');
  const kScope = document.getElementById('k-scope');
  const kOut = document.getElementById('k-out');
  const kAdd = document.getElementById('k-add-to-booking');
  function fmt(n){return n.toLocaleString('en-US',{maximumFractionDigits:0})}
  function scopeRange(s){ if(s==='light')return[4,6]; if(s==='premium')return[15,18]; return[8,12]; }
  function recompute(){
    let sqft = parseFloat(kSize?.value||''); if(!sqft && kPreset?.value) sqft = parseFloat(kPreset.value);
    if (!sqft || sqft < 20){ if(kOut) kOut.textContent='—'; return; }
    const [lo,hi]=scopeRange(kScope?.value||'standard'); let min=sqft*lo,max=sqft*hi; if(min<800)min=800;
    if (kOut) kOut.textContent = `$${fmt(min)} – $${fmt(max)}`;
  }
  [kSize,kPreset,kScope].forEach(el=>{ if(!el)return; el.addEventListener('input',recompute); el.addEventListener('change',recompute); });

  if (kAdd){
    kAdd.addEventListener('click', ()=>{
      document.querySelector('#booking')?.scrollIntoView({behavior:'smooth'});
      const service = document.getElementById('service'); if (service) service.value = 'Restoration';
      const ps = document.getElementById('project_size'); if (ps) ps.value = 'large';
      const msg = document.querySelector('textarea[name="message"]');
      let sqft = kSize?.value || kPreset?.value || '';
      const map = {light:'Light repaint', standard:'Standard refinish', premium:'Premium/complex'};
      const scope = map[kScope?.value || 'standard'];
      const est = kOut?.textContent || '';
      const line = `Kitchen restoration — approx ${sqft or '?'} sq ft, ${scope} — estimate ${est}`;
      if (msg){ msg.value = msg.value ? (msg.value + '\\n' + line) : line; }
    });
  }

  // Before/After slider
  document.querySelectorAll('.ba').forEach(box => {
    const wrap = box.querySelector('.ba-after');
    const slider = box.querySelector('.ba-slider');
    function setClip(val){ wrap.style.clipPath = `inset(0 0 0 ${val}%)`; }
    setClip(50);
    slider?.addEventListener('input', e => setClip(100 - e.target.value));
  });

  // Calculators totals
  function money(n){return '$'+(Math.round(n*100)/100).toLocaleString('en-US')}
  function recalc(){
    const k = (+document.getElementById('k_area')?.value||0) * (+document.getElementById('k_finish')?.value||0) + (+document.getElementById('k_extra')?.value||0);
    const b = (+document.getElementById('b_size')?.value||0) + (+document.getElementById('b_coat')?.value||0) + (+document.getElementById('b_strip')?.value||0);
    const w = (+document.getElementById('w_area')?.value||0) * (+document.getElementById('w_rate')?.value||0);
    const kt=document.getElementById('k_total'); if(kt) kt.textContent=money(k);
    const bt=document.getElementById('b_total'); if(bt) bt.textContent=money(b);
    const wt=document.getElementById('w_total'); if(wt) wt.textContent=money(w);
  }
  document.addEventListener('input', e => { if(e.target.closest('.calc-body')) recalc(); });
  recalc();

  // Booking submit (Netlify Forms + Calendar relay)
  const form = document.getElementById('booking-form');
  const result = document.getElementById('booking-result');
  const invoiceBtn = document.getElementById('invoice-btn');
  async function submitBooking(extra={{}}){
    if (!form) return;
    result.textContent = "Sending...";
    const fd = new FormData(form);
    for (const [k,v] of Object.entries(extra)) fd.set(k, v);
    if (!fd.get('time') && timeSel && timeSel.value) fd.set('time', timeSel.value);
    await fetch('/', { method:'POST', body: fd });
    const payload = Object.fromEntries(fd.entries());
    try{
      await fetch('/.netlify/functions/form-to-gcal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    }catch(e){}
    result.textContent = "Thanks! We got your request — check your email for estimate/invoice soon.";
    form.reset(); if (timeSel) timeSel.value=""; if(timeHidden) timeHidden.value="";
  }
  form?.addEventListener('submit', (e)=>{ e.preventDefault(); submitBooking(); });
  invoiceBtn?.addEventListener('click', ()=> submitBooking({request:'invoice'}) );

  // Estimate email capture
  window.sendEstimate = async function(kind){
    const payload = {kind};
    if(kind==='Kitchen'){
      payload.area = document.getElementById('k_area').value;
      payload.finish = document.getElementById('k_finish').selectedOptions[0].text;
      payload.extra = document.getElementById('k_extra').selectedOptions[0].text;
      payload.total = document.getElementById('k_total').textContent;
    } else if(kind==='Bathtub'){
      payload.size  = document.getElementById('b_size').selectedOptions[0].text;
      payload.coat  = document.getElementById('b_coat').selectedOptions[0].text;
      payload.strip = document.getElementById('b_strip').selectedOptions[0].text;
      payload.total = document.getElementById('b_total').textContent;
    } else {
      payload.item  = document.getElementById('w_item').selectedOptions[0].text;
      payload.area  = document.getElementById('w_area').value;
      payload.rate  = document.getElementById('w_rate').selectedOptions[0].text;
      payload.total = document.getElementById('w_total').textContent;
    }
    payload.name  = document.querySelector('input[name="name"]')?.value || '';
    payload.phone = document.querySelector('input[name="phone"]')?.value || '';
    payload.email = document.querySelector('input[name="email"]')?.value || '';

    try{
      await fetch('/', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({'form-name':'estimate', **payload}) });
      await fetch('/.netlify/functions/form-to-gcal', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ service:'Estimate: '+payload.kind, name:payload.name, phone:payload.phone, email:payload.email, message: JSON.stringify(payload) })});
      alert('Thanks! We’ll email your estimate details shortly.');
    }catch(e){
      alert('Estimate sent via email. Calendar hookup temporarily unavailable.');
    }
  }
})();
