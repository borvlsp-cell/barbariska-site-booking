// netlify/functions/form-to-gcal.js
// Forwards Netlify Forms submissions to Google Apps Script Web App

exports.handler = async (event) => {
try {
if (event.httpMethod !== "POST") {
return { statusCode: 405, body: "Method Not Allowed" };
}

const payload = JSON.parse(event.body || "{}");
const submission = payload && payload.payload ? payload.payload : payload;

const data = {
name: submission.name || "",
phone: submission.phone || "",
email: submission.email || "",
service: submission.service || "",
date: submission.date || "",
time: submission.time || "",
message: submission.message || "",
raw: submission
};

const url = process.env.GCAL_WEBHOOK_URL;
if (!url) {
return { statusCode: 500, body: "Missing GCAL_WEBHOOK_URL" };
}

const res = await fetch(url, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(data)
});

const text = await res.text();
return { statusCode: res.status, body: text };
} catch (e) {
return { statusCode: 500, body: "Error: " + e.message };
}
};
