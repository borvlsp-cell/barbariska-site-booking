# Barbaris site update (light + emerald, EN)

- All UI translated to English.
- Light gray background, emerald header and buttons.
- Visible buttons, higher contrast.
- Booking form still posts to Netlify Forms **and** has a WhatsApp button that pre-fills a message to +1 818 667‑3778.

Upload `index.html` and `styles.css` to your GitHub repo root, replacing the old files.

IMPORTANT — set your email for forms:
1) Open index.html
2) Find: action="https://formsubmit.co/REPLACE_WITH_YOUR_EMAIL"
3) Replace REPLACE_WITH_YOUR_EMAIL with your real email (e.g., boris@example.com)
Netlify Forms will still work in parallel if your site is hosted on Netlify.

WhatsApp is set to: +1 818 667-3778 and pre-fills a message.


What we kept from the older version ("the best bits"):
- Fast contact: sticky bar with Call, WhatsApp (+1 818 667-3778), and Email.
- Forms: dual delivery — Netlify Forms + email fallback (FormSubmit). 
- Higher-contrast emerald buttons and lighter background for visibility.
- English-only UI labels; Cyrillic phrases replaced.
- Visible "Email us" button (mailto) as a third quick contact path.

To set your real email everywhere:
- In index.html: replace REPLACE_WITH_YOUR_EMAIL (two places: form action + Email button).


Configured for Boris:
- Email delivery: borvlsp@gmail.com (FormSubmit) + Netlify Forms.
- Booking form includes date & time fields, service selector, and message.
- WhatsApp fixed to +1 818 667-3778.

Deploy steps:
1) Replace your site files with this index.html and styles.css.
2) On Netlify, ensure Forms detection is enabled (it will auto-detect).
3) Send a test submission; check your email borvlsp@gmail.com and Netlify › Forms.

---
## Google Calendar hookup (simple + reliable)

### Option A (recommended): Apps Script Webhook (no servers, no npm)
1) Open https://script.google.com/ and create a new project.
2) Paste `APPS_SCRIPT_GCAL_WEBAPP.js` from this folder.
3) Set `CAL_ID = "primary"` or your specific calendar ID, and set your email in MailApp.sendEmail.
4) Deploy: "Deploy" → "New deployment" → "Web app" → Execute as **Me**, Who has access **Anyone with the link**.
5) Copy the Web app URL.
6) On Netlify, set an environment variable: `GCAL_WEBHOOK_URL=<that URL>`.
7) In your site, Netlify will invoke `netlify/functions/form-to-gcal.js` for each form submission and forward to that URL.
8) Submissions will create Calendar events and email you.

### Option B: Zapier / Make (no code)
- In Netlify: Forms → Add integration (Zapier/Make).
- Create a Zap/Scenario: Trigger = Netlify Form Submission → Action = Create Google Calendar Event → (optional) Action = Create Invoice (Stripe/QuickBooks/Square).

### Option C: Direct Google API in Netlify Function (advanced)
- Install googleapis and use a service account with domain-wide delegation.
- This requires bundling node modules; see Netlify docs for functions with dependencies.

## Invoicing ideas
- **Stripe:** include a Payment Link in the auto-reply email (easy). 
- **Square or QuickBooks:** use Zapier/Make to create an invoice upon form submission (map name, email, phone, service, date/time).

## Field mapping (already in the form)
- name, phone, email, service, date, time, message



Calendar ID fixed:
- CAL_ID is set to "borvlsp@gmail.com" in APPS_SCRIPT_GCAL_WEBAPP.js.
- Deploy the script as a Web App and put the URL into Netlify env GCAL_WEBHOOK_URL.
