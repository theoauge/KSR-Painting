# Estimate form: service options

Status: **undecided** (saved 2026-10-28 to revisit later).

Right now the estimate form opens the visitor's email app with the request filled in
(`mailto:` in `scripts.js`). Visitors who only use webmail (Gmail in a browser, etc.) have
no email app set up, so nothing happens for them and the lead is lost.

Each option below sends the request straight to the business inbox and shows a
confirmation message on the page, without needing a server.

| | Formspree | Netlify Forms | Web3Forms |
|---|---|---|---|
| Works with any host | Yes | Only if the site is hosted on Netlify | Yes |
| Free limit (roughly) | 50 per month | 100 per month | 250 per month |
| Spam protection | Good (filtering plus optional captcha) | Good (built-in filter plus a hidden trap field) | Basic (hidden trap field, optional captcha) |
| Keeps a copy of past requests | Yes, in an online dashboard | Yes, in the Netlify dashboard | No, free plan only emails you |
| Setup | Free account, paste a link into the form | Add one attribute to the form | Get a key by email, paste it in |
| Downsides | Low free limit, about $10/mo after that | Ties the site to Netlify | Fewer features, no copy kept |

The free limits and prices are from memory as of October 2026. Check each service's
current pricing before signing up.

## Recommendation

- **Hosting on Netlify:** Netlify Forms. No extra account.
- **Hosting anywhere else:** Formspree. 50 requests a month is plenty for a local painting
  business, and every request is backed up in its dashboard.
- **Web3Forms** only wins with high submission volume and no need for a stored copy.

## What switching involves

- Point the form at the chosen service (or add Netlify's attribute).
- Replace the `mailto:` step in `scripts.js` with a `fetch` submit that shows a
  success or error message in the existing `.form-status` line.
- Keep the current validation (name plus phone or email).
