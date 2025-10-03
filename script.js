
async function loadServices(){
  const res = await fetch('services.json');
  const items = await res.json();

  const categories = ['All', ...Array.from(new Set(items.map(i=>i.category)))];
  const filters = document.getElementById('filters');
  categories.forEach((cat,idx)=>{
    const chip = document.createElement('button');
    chip.className = 'chip' + (idx===0?' active':'');
    chip.textContent = cat;
    chip.addEventListener('click', ()=>{
      document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      render(cat==='All'?items:items.filter(i=>i.category===cat));
    });
    filters.appendChild(chip);
  });

  render(items);
}

function render(items){
  const grid = document.getElementById('grid');
  grid.innerHTML='';
  items.forEach(i=>{
    const card = document.createElement('div');
    card.className='card';
    const left = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = i.name;
    const cat = document.createElement('div');
    cat.className='cat';
    cat.textContent = i.category;
    left.appendChild(h3);
    left.appendChild(cat);

    if(i.badges && i.badges.length){
      const bs = document.createElement('div');
      bs.className='badges';
      i.badges.forEach(b=>{
        const el = document.createElement('span');
        el.className='b ' + (b.toLowerCase().includes('demand')?'in':(b.toLowerCase().includes('partner')?'pa':''));
        el.textContent = b;
        bs.appendChild(el);
      });
      left.appendChild(bs);
    }

    const rate = document.createElement('div');
    rate.className='rate';
    rate.textContent = i.rate;

    card.appendChild(left);
    card.appendChild(rate);
    grid.appendChild(card);
  });
}

async function loadReviews(){
  const res = await fetch('reviews.json');
  const reviews = await res.json();
  const container = document.getElementById('reviews');
  container.innerHTML='';
  reviews.forEach(r=>{
    const div = document.createElement('div');
    div.className='review';
    div.innerHTML = '<strong>'+r.name+'</strong><span>'+r.text+'</span>';
    container.appendChild(div);
  });
}

loadServices();
loadReviews();

// Apply a seasonal theme based on the current month.
// Spring: March–May; Summer: June–August; Autumn: September–November; Winter: December–February.
function applySeasonalTheme() {
  const month = new Date().getMonth(); // 0 = Jan
  let season;
  if (month >= 2 && month <= 4) {
    season = 'spring';
  } else if (month >= 5 && month <= 7) {
    season = 'summer';
  } else if (month >= 8 && month <= 10) {
    season = 'autumn';
  } else {
    season = 'winter';
  }
  document.body.classList.add('theme-' + season);
}

applySeasonalTheme();
