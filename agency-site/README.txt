Content Studio Zürich: static website + contact form (Vercel)

1) FILL IN YOUR DETAILS
   Open index.html in Notepad, find "var SITE" near the bottom, and fill in:
   brand, owner, email, legalForm, street, zipCity, uid, vat, host, logRetention.
   An empty field shows a highlighted "[bitte ergänzen]".

2) RESEND (sends the form to your inbox)
   - Create a free account at resend.com and create an API key.
   - Until you verify your own domain in Resend, the sender is onboarding@resend.dev
     and Resend only delivers to the email address of YOUR Resend account.
     So CONTACT_TO must be that address.

3) DEPLOY (PowerShell, inside this folder)
   npx vercel                                   (log in, accept defaults: creates a preview)
   npx vercel env add RESEND_API_KEY production (paste the key when asked)
   npx vercel env add CONTACT_TO production     (type your inbox address)
   npx vercel --prod                            (publishes with the settings above)
   Optional later, after verifying a domain in Resend:
   npx vercel env add CONTACT_FROM production   (e.g. Website <hallo@your-domain.ch>)

4) GO PUBLIC
   Remove <meta name="robots" content="noindex, nofollow"> near the top of index.html
   when the details are filled in and the legal pages are reviewed, then run: npx vercel --prod

NOTE: the form only works on the deployed Vercel site (it calls /api/contact).
Opening index.html straight from disk shows the "copy the text" fallback instead.
