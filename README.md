# Afinity website

Marketing site for **Afinity**: mobile apps, websites, admin panels and infrastructure.

Built with plain HTML, CSS and JavaScript modules, bundled by [Vite](https://vitejs.dev). No framework.

## Run it

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Demo link (Cloudflare quick tunnel)

Share the site from this computer with a temporary public link, the same way as the Bibo ERP demo:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\abdul\afinity\demo\start_demo.ps1   # build, serve, print the link
powershell -ExecutionPolicy Bypass -File C:\Users\abdul\afinity\demo\stop_demo.ps1    # stop
```

- The link (`https://….trycloudflare.com`) is printed and saved in `demo/demo_url.txt`. It changes every time the demo starts.
- It works only while this computer is on and the demo is running. Logs are in `demo/logs/`.
- Uses `cloudflared.exe` from `demo/`, `C:\Users\abdul\Projects\bibo-demo\`, or PATH. The site is served on port 8010.

## Contact form → Telegram

Requests from the contact form arrive as Telegram messages from **@afinitynotificationbot**
(name, email, company, requested team member, services, language and the message).

- The browser sends the form to `/api/contact` on this site (`server/contact-api.js`), which forwards it to Telegram.
  The bot token is read from `.env` on the server and **never** reaches the browser or GitHub.
- Settings live in `.env` (private, git-ignored): `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
- To choose who receives messages: open the bot in Telegram and press **Start** (or add it to a group and write
  there), then run `npm run telegram:chat-id`. The change applies to the next request, no restart needed.
- Use a **private** chat, group or channel: requests contain clients' personal details.
- Protection: same validation as the form, spam honeypot, max 5 requests per visitor per 10 minutes, size limit.
- If the server or Telegram is unavailable, the form opens the visitor's email app instead, so no request is lost.
- The endpoint runs with `npm run dev`, `npm run preview` and the demo. Static-only hosting (e.g. GitHub Pages)
  has no server, so there the form falls back to email unless `/api/contact` is hosted as a serverless function.

## Structure

```
index.html              the page (semantic HTML, works without JS)
partials/               shared HTML inlined at build time: sprite, header, contact, footer
                        (use <!-- @include footer.html --> in any page; see vite.config.js)
public/                 favicon, logo SVGs, social share image, touch icon
src/data/team.js        TEAM & PORTFOLIO: edit people and projects here
src/i18n/                interface text: en.js, ru.js, uz.js
src/main.js             entry point
src/styles/
  tokens.css            brand colors, fonts, spacing, motion (edit here first)
  base.css              reset, typography, scroll-reveal states
  components.css        buttons, eyebrows, tags, brand lockup
  chrome.css            intro animation, navigation, mobile menu
  hero.css              hero, stats, technology marquee
  services.css          services grid and its UI mockups
  work.css              statement text and case studies
  sections.css          process, infrastructure console, FAQ, contact, footer
  stories.css           hover animations for service and case cards
  team.css              team cards, portfolio filters, project mockups
src/js/
  site.js               shared setup (nav, form, reveals)
  i18n.js               language detection, switcher, t() / tr() helpers
  team.js               team cards and "Built by" credits on case studies
  portfolio.js          shared portfolio: filters, person bar, show more, shareable links
  case-visuals.js       mockups used when a project has no screenshot
  html.js               escaping HTML template helper and URL allow-list
  mark.js               the logo outline as points (shared geometry)
  hero-particles.js     particle logo in the hero (canvas)
  preloader.js          once-per-session intro
  nav.js                sticky nav, active links, accessible mobile menu
  scroll-fx.js          reveal on scroll, counters, word highlight, process rail
  pointer-fx.js         cursor glow and magnetic buttons
  live-cards.js         plays card animations on touch screens while in view
  console.js            simulated live traffic dashboard
  validation.js         contact form validation (pure, easy to unit test)
  contact-form.js       form behavior, team member preset, submission
```

## Languages (English, Russian, Uzbek)

The site is translated into **English**, **Russian** and **Uzbek (Latin)**. Visitors switch with **EN / RU / UZ**
in the navigation; the choice is remembered. On a first visit, Russian or Uzbek browsers get that language,
everyone else gets English. `?lang=ru` or `?lang=uz` in any link opens the site in that language.

- Interface text lives in `src/i18n/en.js`, `ru.js` and `uz.js` (same keys in each). English is the source:
  a key missing from Russian or Uzbek falls back to English.
- In the HTML, `data-i18n="key"` sets an element's text, `data-i18n-html="key"` allows markup such as `<br />`,
  and `data-i18n-attr="aria-label:key"` sets attributes. The English text stays in the HTML as the default.
- Team and portfolio data in `src/data/team.js` use `{ en, ru, uz }` for any text.
- Archivo has no Cyrillic letters, so Russian headings use **Montserrat** (loaded only when needed).
- Contact requests include the visitor's language, so replies can be in the same language.

To add a language: copy `en.js`, translate it, add it to `DICTS` and `LANGS` in `src/js/i18n.js`, and add a
button to the switcher in `partials/header.html`.

## Team & portfolio

Everything comes from `src/data/team.js` (fields are documented at the top of the file):

- `team`: the people in the **Team** section and in the contact form's **Team member** list
- `projects`: the shared **Portfolio**. Each project lists the people who built it in `team: [...]`.

How a returning client finds the same person again:

1. Click the person in **Team**, or their name on any project or under a case study. The portfolio filters to that person's projects.
2. The bar above the projects offers **Work with <name>**, which opens the contact form with that person pre-selected, and **Copy link** to save that filtered view.

The request (email, or the `VITE_CONTACT_ENDPOINT` payload) includes `member` and `memberName`.

Shareable links: `/?member=<id>#portfolio`, `/?type=mobile#portfolio`, and `/?with=<id>#contact` (pre-selects the person in the form).

Photos: put images in `public/team/` and set `photo: '/team/name.jpg'`. Project screenshots work the same way with `image`.

### Featured project: Bibo ERP

Bibo ERP is the first card in the portfolio: a 3D stack of screenshots (click a back screen or a tab to bring
it forward, click the front one to open it full size; it rotates by itself while on screen), floating key
figures, and the project details. Files live in `public/portfolio/bibo/`:
`dashboard.webp`, `finance.webp`, `occupancy.webp` and `logo.svg`. Screenshots look best at about 1900×960.
To change them, replace the files or edit `images` and `highlights` for the project in `src/data/team.js`.

### Featured project: IRIZON BONUS

Second featured card: the admin panel as a 3D stack plus a fan of four app screenshots (`phones`), and
Google Play / App Store buttons (`links`). Files live in `public/portfolio/irizon/`. Only public product
information is used; server, deployment and configuration details from the project document are left out on purpose.

### Featured project: Elchi

Third featured card, same layout as IRIZON: four admin screens in the 3D stack (three visible, the fourth
rotates in) and a fan of four app screens. Files live in `public/portfolio/elchi/`, including `logo.png`.
Competitors are described by type, not named.

### Adding the next real project

Copy one of the featured entries in `src/data/team.js`, put its screenshots in `public/portfolio/<name>/`
(desktop screens ~1900×960, phone screens portrait), fill in the text in all three languages and set `team`.
It appears automatically as a featured showcase at the top of the portfolio.

## Brand system

- **Green `#5BB14E`**, sampled from the logo. Use `--green-deep` (`#2F7A26`) for small text on light backgrounds, because plain green on white fails contrast.
- **Ink `#0A0E0B`**, a green-tinted black, so dark surfaces feel related to the logo.
- **Slant `-33.6°`**: the lean of the logo's diagonal stroke. It sets the angle of button hover sweeps, number badges, marquee separators and the hero highlight band.
- **Chamfered corners**, echoing the cut on the logo's right leg. Cards, buttons and panels use this instead of rounded corners.
- **Fonts:** Archivo (wide, display), Inter (body), JetBrains Mono (labels).

## Before launch: replace placeholders

- [ ] Stats in the hero (`120+`, `99.98%`, `40M+`): marked with a `TODO` in `index.html`
- [x] Real team in `src/data/team.js` (Ulug‘bek Xudoyqulov, Abdulloh Muxtorov, Temur Ibragimov)
- [ ] Temur Ibragimov's role and skills (card shows "Afinity team" until then)
- [ ] Email `hello@afinity.com`: in `partials/contact.html`, `partials/header.html`, `partials/footer.html` and `src/js/contact-form.js`
- [ ] Social links in the footer (currently `#`)
- [x] Phone `+998 93 577 04 88` and office address: in `partials/contact.html`, `partials/footer.html`, `partials/header.html` and the JSON-LD block in `index.html`
- [x] Bibo ERP screenshots in `public/portfolio/bibo/` (see above)
- [ ] Credit who built Bibo ERP, IRIZON BONUS and Elchi: add team ids to their `team: []` in `src/data/team.js`
- [ ] Contact form backend: set `VITE_CONTACT_ENDPOINT` (see `.env.example`)
