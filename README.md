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

### Spam protection and IP blocking

- `server/spam-check.js` recognises junk in English, Russian and Uzbek: random letters, keyboard mashing,
  repeated characters or words, messages too short to mean anything, link spam, spam words, and forms sent
  in under 2 seconds (bots). Junk never reaches Telegram; the visitor is asked to describe the project.
- Every junk, invalid or bot request is a strike. **5 strikes within 24 hours block the IP** for
  `SPAM_BLOCK_DAYS` days (default 7, `0` = permanently). Blocked IPs see "sending is not available, please call us".
- When an IP is blocked, the Telegram channel gets an alert with the IP, the reason, the last messages and the
  unblock command.
- Blocks are stored in `data/blocklist.json` (git-ignored, IPs are personal data) and survive restarts.
- Manage blocks (changes apply immediately, no restart):
  ```bash
  npm run spam -- list
  npm run spam -- unblock <ip>
  npm run spam -- block <ip> [days]
  ```
- Mobile operators in Uzbekistan often share one IP between many customers, so keep blocks short.
- IP headers are trusted only for requests arriving through the local Cloudflare tunnel, so a visitor cannot
  fake their IP to dodge a block or get someone else blocked.
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

Team cards open the contact form with that person pre-selected. Once projects list who built them
(`team: [...]`), a person's card opens `/projects.html?member=<id>` instead, and their name appears on
those project pages. The request (email, or the `VITE_CONTACT_ENDPOINT` payload) includes `member` and `memberName`.

Shareable links: `/projects.html?type=mobile`, `/projects.html?member=<id>` (projects credited to one person), and `/?with=<id>#contact` (pre-selects the person in the form). Old `/#portfolio` links redirect to the projects page.

Photos: put images in `public/team/` and set `photo: '/team/name.jpg'`.

Project files live in `public/portfolio/<project>/` (`bibo`, `irizon`, `elchi`): desktop screenshots (about
1900×960) in `images`, portrait app screenshots in `phones`, optional `logo`, store `links` and key figures
in `highlights`. For IRIZON only public product information is used; server, deployment and configuration
details from the project document are left out on purpose. Elchi's competitors are described by type, not named.

### Adding the next real project

Copy one of the entries in `src/data/team.js`, put its screenshots in `public/portfolio/<name>/`, fill in
the text in all three languages, give it a `slug` and a `challenge` (the problem it solves) and set `team`.
It appears on the projects page automatically and gets its own project page.

### Projects page (the portfolio)

The home page has no portfolio section, so it stays the same length however many projects you add;
"Portfolio" in the menu, "See our work" in the hero and the footer link open `/projects.html`.
It lists every project on one page: a dark intro with an index of all projects, then one
large row per project (screens, key figures, technology) linking to its own page, a type filter
(`?type=mobile`) and a "Your project could be next" call to action. Code: `src/js/work-page.js`, styles: `src/styles/projects.css`.

### Project pages

`project.html?p=<slug>` (for example `/project.html?p=bibo-erp`) shows one project in full: the problem,
the solution, what was built, all screenshots (click to open full size), results and a link to the next
project. Everything comes from the project's entry in `src/data/team.js`; the page code is
`src/js/case-page.js`. "View project" on each featured card links here, and "Start a similar project"
fills in the contact form at the bottom of the page.

## Service pages

`/services/mobile-apps.html`, `/services/admin-panels.html` and `/services/telegram-bots.html`: one page per
service, aimed at people searching for that service ("разработка мобильных приложений Ташкент" and the like).
Each has a "starting from" price and timeline (taken from `src/data/pricing.js`, so it always matches the
estimator), what the client gets, the process, related projects, an FAQ (also given to search engines as
structured data) and links to the other services. Text in all three languages lives in `src/data/services.js`.
Linked from the home page service cards ("Learn more") and the footer.

To add a service: add an entry to `src/data/services.js`, copy one of the HTML files in `services/` (change
`data-service`, title and description) and add it to the build inputs in `vite.config.js`.

## Client reviews

Only real reviews, added with the client's permission: put them in `src/data/reviews.js`. While the list is
empty the section is hidden. Once there is a review it shows on the home page (between Infrastructure and
FAQ), and on the project page when the review names a `project`. To see the design before you have a review,
open any page with `?reviews=preview`: an example marked "Example · not a real review" appears, for you only.

## Yandex Metrika (analytics)

Off until you add a counter: create one at metrika.yandex.ru, put its number in `.env` as
`VITE_YANDEX_METRIKA_ID=12345678` and rebuild. It records visits, traffic sources and a click map.
Session recording (Webvisor) is left off, so what visitors type in the form is never recorded.
These goals are sent; add them in Metrika as "JavaScript event" goals with the same names to see them in reports:

| Goal | When |
|---|---|
| `estimate_used` | first choice in the cost estimator |
| `estimate_quote` | "Get an exact quote" in the estimator |
| `request_sent` | a contact request was sent |
| `start_project` | "Start a project" on a service page or "Start a similar project" on a project page |
| `telegram_click`, `phone_click` | a Telegram or phone link was clicked |

## 404 page and hosting

Unknown addresses show `404.html` (branded, translated, with links back). The preview/demo server does this
already, and it also accepts addresses without `.html` (`/projects`). On the real hosting, set the 404 page:
nginx `error_page 404 /404.html;`, Apache `.htaccess`: `ErrorDocument 404 /404.html`.

## Performance

- Screenshots and team photos have smaller copies for phones (`*-800w.webp`, `*-400w.webp`, `*-480w.webp`),
  made by `npm run images` (also runs before every build). Add new images as usual; the copies are made for you.
- Fonts load without blocking the first paint; images reserve their space, so nothing jumps while the page loads.
- Mobile Lighthouse (slow phone simulation): about 80–95 performance, 96–97 accessibility, 100 best practices and SEO.

## Cost estimator

Section `#estimate` on the home page. Visitors pick what they need (app, website, admin panel, bot;
platforms, website type, features, design) and see a price range in USD and so‘m plus a timeline.
"Get an exact quote" ticks the matching services in the contact form and writes the selection into the message.

**Prices are market starting points, not Afinity's real prices: review `src/data/pricing.js` before launch.**
Every number (and the USD→so‘m rate) is in that one file; the calculation is in `src/js/estimate.js`.

## Telegram button

A floating "Write on Telegram" button (`@spame_r`) appears after the first screen. Markup is at the end
of `partials/footer.html`; change the username there and in `partials/contact.html`.

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
- [x] Social links in the footer (Instagram, GitHub)
- [x] Phone `+998 93 577 04 88` and office address: in `partials/contact.html`, `partials/footer.html`, `partials/header.html` and the JSON-LD block in `index.html`
- [x] Bibo ERP screenshots in `public/portfolio/bibo/` (see above)
- [ ] Credit who built Bibo ERP, IRIZON BONUS and Elchi: add team ids to their `team: []` in `src/data/team.js`
- [ ] Estimator prices and exchange rate in `src/data/pricing.js` (also shown as "starting from" on the service pages)
- [ ] Yandex Metrika counter: `VITE_YANDEX_METRIKA_ID` in `.env`
- [ ] First real client review in `src/data/reviews.js`
- [ ] Contact form backend: set `VITE_CONTACT_ENDPOINT` (see `.env.example`)
