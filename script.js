
(function(){
  // 12h select -> hidden 24h value
  const timeSel = document.getElementById('time_display');
  const timeHidden = document.getElementById('time');
  if (timeSel && timeHidden) {
    timeSel.addEventListener('change', () => {
      timeHidden.value = timeSel.value; // "HH:MM" 24h
    });
  }

  // Preselect "Large project" if clicked from hero button
  document.querySelectorAll('[data-big="1"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const ps = document.getElementById('project_size');
        if (ps) ps.value = 'large';
      }, 200);
    });
  });

  // Restoration dynamic content
  const restoType = document.getElementById('resto-type');
  const restoDetails = document.getElementById('resto-details');
  const restoTitle = document.getElementById('resto-title');
  const restoPrice = document.getElementById('resto-price');
  const restoDesc = document.getElementById('resto-desc');
  const restoBtn  = document.getElementById('resto-to-book');

  const data = {
    kitchen:{title:'Kitchen Cabinet Restoration', price:'from $800 to $5,500',
      desc:'Sanding, priming, repainting, hardware, premium finishes. Price depends on size and condition.'},
    bathroom:{title:'Bathtub Refinishing / Reglazing', price:'from $480 to $1,200',
      desc:'Chip repair, resurfacing, enamel or acrylic coating, polishing.'},
    other:{title:'Furniture / Door / Wood Restoration', price:'from $250 to $1,800',
      desc:'Antiques, wooden doors, furniture; stain, lacquer, detailed repairs.'}
  };

  function updateResto(val){
    const kBox = document.getElementById('kitchen-estimator');
    if (kBox){
      if (val === 'kitchen'){ kBox.classList.remove('hidden'); }
      else { kBox.classList.add('hidden'); }
    }
    const d = data[val];
    if (d && restoDetails){
      restoTitle.textContent = d.title;
      restoPrice.textContent = d.price;
      restoDesc.textContent = d.desc;
      restoDetails.classList.remove('hidden');
    } else if (restoDetails){
      restoDetails.classList.add('hidden');
    }
  }
  if (restoType){ restoType.addEventListener('change', e => updateResto(e.target.value)); }

  if (restoBtn) {
    restoBtn.addEventListener('click', () => {
      document.querySelector('#booking')?.scrollIntoView({behavior:'smooth'});
      const ps = document.getElementById('project_size');
      if (ps) ps.value = 'large';
      const service = document.getElementById('service');
      if (service) service.value = 'Restoration';
    });
  }

  // Kitchen estimator logic (min $800)
  const kSize = document.getElementById('k-size');
  const kPreset = document.getElementById('k-preset');
  const kScope = document.getElementById('k-scope');
  const kOut = document.getElementById('k-out');
  const kAdd = document.getElementById('k-add-to-booking');

  function fmt(n){ return n.toLocaleString('en-US', {maximumFractionDigits:0}); }
  function scopeRange(scope){
    if (scope === 'light')   return [4, 6];
    if (scope === 'premium') return [15, 18];
    return [8, 12];
  }
  function recompute(){
    let sqft = parseFloat(kSize?.value || '');
    if (!sqft && kPreset?.value) sqft = parseFloat(kPreset.value);
    if (!sqft || sqft < 20){ if (kOut) kOut.textContent = '—'; return; }
    const [lo, hi] = scopeRange(kScope?.value || 'standard');
    let min = sqft * lo, max = sqft * hi;
    if (min < 800) min = 800;
    if (kOut) kOut.textContent = `$${fmt(min)} – $${fmt(max)}`;
  }
  [kSize, kPreset, kScope].forEach(el=>{
    if (!el) return;
    el.addEventListener('input', recompute);
    el.addEventListener('change', recompute);
  });

  if (kAdd){
    kAdd.addEventListener('click', ()=>{
      document.querySelector('#booking')?.scrollIntoView({behavior:'smooth'});
      // prefill form
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
    const after = box.querySelector('.after');
    const slider = box.querySelector('.ba-slider');
    if (!after || !slider) return;
    function setClip(val){
      after.style.clipPath = `inset(0 0 0 ${val}%)`;
    }
    setClip(50);
    slider.addEventListener('input', e => setClip(100 - e.target.value));
  });

  // Booking submit (Netlify Forms + Calendar relay)
  const form = document.getElementById('booking-form');
  const result = document.getElementById('booking-result');
  const invoiceBtn = document.getElementById('invoice-btn');
  if (!form) return;

  async function submitBooking(extra={{}}){
    result.textContent = "Sending...";
    const fd = new FormData(form);
    for (const [k,v] of Object.entries(extra)) fd.set(k, v);
    if (!fd.get('time') && timeSel && timeSel.value) fd.set('time', timeSel.value);

    await fetch('/', { method: 'POST', body: fd });

    const payload = Object.fromEntries(fd.entries());
    try{
      await fetch('/.netlify/functions/form-to-gcal', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
    }catch(e){}

    result.textContent = "Thanks! We got your request — check your email for estimate/invoice soon.";
    form.reset();
    if (timeSel) timeSel.value = "";
    if (timeHidden) timeHidden.value = "";
  }

  form.addEventListener('submit', (e)=>{ e.preventDefault(); submitBooking(); });
  if (invoiceBtn) invoiceBtn.addEventListener('click', async ()=>{ await submitBooking({ request:'invoice' }); });
})();
