// Vercel serverless function: receives the contact form and emails it to the site owner via Resend.
// Environment variables (set in Vercel, never in code):
//   RESEND_API_KEY  required, your Resend API key
//   CONTACT_TO      required, the inbox that receives enquiries
//   CONTACT_FROM    optional, e.g. "Website <hallo@your-domain.ch>" once the domain is verified in Resend

const MAX = { name: 100, email: 200, salon: 150, web: 200, msg: 2000 };
const hits = new Map();

function clean(v, n) {
  return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, n);
}
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(function (t) { return now - t < win; });
  if (arr.length >= 5) { hits.set(ip, arr); return true; }
  arr.push(now); hits.set(ip, arr);
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "method" }); }

  var b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b !== "object") return res.status(400).json({ error: "invalid" });

  if (b.hp_x7) return res.status(200).json({ ok: true, skipped: true }); // honeypot field: bots fill it, people never see it; the page treats "skipped" as not sent

  var ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return res.status(429).json({ error: "rate" });

  var d = { name: clean(b.name, MAX.name), email: clean(b.email, MAX.email), salon: clean(b.salon, MAX.salon), web: clean(b.web, MAX.web), msg: clean(b.msg, MAX.msg) };
  if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return res.status(400).json({ error: "invalid" });

  var key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO;
  if (!key || !to) return res.status(500).json({ error: "not_configured" });
  var from = process.env.CONTACT_FROM || "Website <onboarding@resend.dev>";

  var text = ["Neue Anfrage über die Website", "", "Name: " + d.name, "E-Mail: " + d.email, "Salon: " + (d.salon || "-"), "Website/Instagram: " + (d.web || "-"), "", d.msg || "(keine Nachricht)"].join("\n");
  var subject = ("Neue Anfrage: " + (d.salon || d.name)).replace(/[\r\n]+/g, " ").slice(0, 150);

  try {
    var r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ from: from, to: [to], reply_to: d.email, subject: subject, text: text })
    });
    if (!r.ok) return res.status(502).json({ error: "send" });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: "send" });
  }
};
