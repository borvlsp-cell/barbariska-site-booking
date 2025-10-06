// === Barbariska forms → Google Apps Script ===
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwCiWigXAscqbkHP0LjsvupPWfqDeyfsRctFogW3CC3QPYoHQTcdyhLObz4P5hvaHv9/exec";

function fmtUSD(n){return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,',')}

async function sendJSON(payload){
  try{
    await fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    return true;
  }catch(e){console.error(e);return false;}
}

// Price calculator
function recalc(){
  const cat = document.getElementById('cat').value;
  const area = Math.max(0, parseFloat(document.getElementById('area').value||0));
  const finish = document.getElementById('finish').value;
  const extras = document.getElementById('extras').value;
  let total = 0;

  if(cat==='kitchen'){ let base=10; if(finish==='enamel') base=15; if(finish==='premium') base=22; total=base*area; }
  else if(cat==='bath'){ let base=480; if(finish==='enamel') base=650; if(finish==='premium') base=900; total=base; }
  else { let base=10; if(finish==='enamel') base=15; if(finish==='premium') base=20; total=base*area; }

  if(extras==='strip') total+=120;
  if(extras==='repairs') total+=80;

  if(cat==='kitchen') total=Math.min(Math.max(total,800),5500);
  if(cat==='bath') total=Math.min(Math.max(total,480),1200);
  if(cat==='wood') total=Math.min(Math.max(total,250),1800);

  document.getElementById('total').textContent = fmtUSD(total);
}
['cat','area','finish','extras'].forEach(id=>{
  const el=document.getElementById(id); if(el) el.addEventListener('input',recalc);
});
document.addEventListener('DOMContentLoaded', recalc);

// Booking
document.addEventListener('DOMContentLoaded', ()=>{
  const booking = document.querySelector('form[name="booking"]');
  if(booking){
    booking.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const payload = {
        formType:'booking',
        name: booking.name.value,
        phone: booking.phone.value,
        email: booking.email.value,
        date: booking.date.value,
        time: booking.time.value,
        service: booking.service.value,
        message: booking.message.value
      };
      await sendJSON(payload);
      alert('✅ Thank you! We received your booking.');
      booking.reset();
    });
  }
});

// Estimate → email
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('email-estimate');
  if(btn){
    btn.addEventListener('click', async (e)=>{
      e.preventDefault();
      const payload = {
        formType:'estimate',
        name: document.getElementById('estName').value,
        email: document.getElementById('estEmail').value,
        message: document.getElementById('estMsg').value,
        category: document.getElementById('cat').value,
        area: document.getElementById('area').value,
        finish: document.getElementById('finish').value,
        extras: document.getElementById('extras').value,
        total: document.getElementById('total').textContent
      };
      await sendJSON(payload);
      alert('✅ Estimate sent — Boris will contact you soon.');
    });
  }
});

// Review → email
document.addEventListener('DOMContentLoaded', ()=>{
  const review = document.querySelector('form[name="review"]');
  if(review){
    review.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const payload = {
        formType:'review',
        name: review.name.value,
        email: review.email.value,
        rating: review.rating.value,
        message: review.review.value
      };
      await sendJSON(payload);
      alert('✅ Thanks for your review!');
      review.reset();
    });
  }
});
