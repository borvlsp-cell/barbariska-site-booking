
Barbaris Emerald Final
- All-English UI, emerald palette, locations: Los Angeles • Irvine • Orange County
- 12-hour time picker (AM/PM) submitting 24h value
- Restoration section with Kitchen estimator (min $800) & ranges:
  * Kitchen: $800–$5,500
  * Bathtub: $480–$1,200
  * Furniture/Door/Wood: $250–$1,800
- Before/After gallery slider (drop images into /assets and update src)
- Netlify Forms + function relaying to Apps Script via GCAL_WEBHOOK_URL

Deploy:
1) Upload contents to GitHub repo (replace existing files) or drag-drop to Netlify.
2) In Netlify → Site settings → Environment variables, set GCAL_WEBHOOK_URL=(your Apps Script /exec URL).
3) Trigger deploy. In Netlify → Forms, enable Email notification for booking & review if needed.
