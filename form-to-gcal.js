
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const url = process.env.GCAL_WEBHOOK_URL;
    if (!url) return { statusCode: 500, body: JSON.stringify({error:"Missing GCAL_WEBHOOK_URL"}) };
    const resp = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const text = await resp.text();
    return { statusCode: 200, body: JSON.stringify({ ok: true, upstream: text.slice(0,300) }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
