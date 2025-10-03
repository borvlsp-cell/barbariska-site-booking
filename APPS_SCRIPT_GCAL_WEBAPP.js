
/**
 * Deploy: Publish > Deploy as web app > Execute as Me, Who has access: Anyone with the link.
 * Copy the deployment URL and set it in Netlify env GCAL_WEBHOOK_URL.
 * This script creates a Calendar event from JSON posted by Netlify Function.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // CONFIG — set your calendar ID (primary or a specific calendar email)
    var CAL_ID = "borvlsp@gmail.com"; // or like "yourname@yourdomain.com"

    // Parse date & time (YYYY-MM-DD and HH:MM)
    var dateStr = (data.date || "").trim();
    var timeStr = (data.time || "09:00").trim();
    var tz = Session.getScriptTimeZone(); // e.g., America/Los_Angeles

    var start = new Date(dateStr + "T" + timeStr + ":00");
    var end = new Date(start.getTime() + 60 * 60 * 1000); // default 1 hour

    var title = "Booking: " + (data.service || "Handyman") + " — " + (data.name || "");
    var desc = ""
      + "Name: " + (data.name || "") + "\n"
      + "Phone: " + (data.phone || "") + "\n"
      + "Email: " + (data.email || "") + "\n"
      + "Service: " + (data.service || "") + "\n"
      + "Preferred: " + (data.date || "") + " " + (data.time || "") + "\n\n"
      + "Message:\n" + (data.message || "") + "\n\n"
      + "Raw:\n" + JSON.stringify(data.raw || {}, null, 2);

    var cal = CalendarApp.getCalendarById(CAL_ID);
    var ev = cal.createEvent(title, start, end, {
      description: desc,
      location: "Customer site",
      guests: (data.email || ""),
      sendInvites: !!data.email
    });

    // Optional: send you a formatted email
    var you = "borvlsp@gmail.com";
    MailApp.sendEmail({
      to: you,
      subject: "New Booking — " + (data.name || ""),
      htmlBody:
        "<p><b>New booking received</b></p>" +
        "<p><b>Name:</b> " + (data.name || "") + "<br>" +
        "<b>Phone:</b> " + (data.phone || "") + "<br>" +
        "<b>Email:</b> " + (data.email || "") + "<br>" +
        "<b>Service:</b> " + (data.service || "") + "<br>" +
        "<b>Preferred:</b> " + (data.date || "") + " " + (data.time || "") + "</p>" +
        "<p><b>Message:</b><br>" + safe((data.message || "")) + "</p>" +
        "<p>Event created: " + ev.getHtmlLink() + "</p>"
    });

    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService
      .createTextOutput("ERROR: " + err)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function safe(s) {
  return String(s).replace(/[&<>]/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c] || c;
  });
}
