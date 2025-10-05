
(function(){
  const time = document.getElementById('time');
  if (time) { time.min = "06:00"; time.max = "21:00"; time.step = 900; }

  const form = document.getElementById('booking-form');
  const result = document.getElementById('booking-result');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.textContent = "Sending...";
    const data = Object.fromEntries(new FormData(form));
    try {
      await fetch('/', { method: 'POST', body: new FormData(form) });
      try {
        await fetch('/.netlify/functions/form-to-gcal', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify(data)
        });
      } catch (err) {}
      result.textContent = "Thanks! We got your request — we’ll call / WhatsApp / email you shortly.";
      form.reset();
      if (time) { time.min="06:00"; time.max="21:00"; time.step=900; }
    } catch (err) {
      console.error(err);
      result.textContent = "Something went wrong. Please try again or use WhatsApp/Email.";
    }
  });
})();
