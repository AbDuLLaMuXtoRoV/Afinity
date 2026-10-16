/*
  ============================================================================
  TEAM & PORTFOLIO: the single source of truth.
  Only real people and real projects go here.

  LANGUAGES: any text can be a plain string (same in every language) or
  { en, ru, uz }. Lists (features, results, highlights) can be { en: [...], ru: [...], uz: [...] }.
  Missing translations fall back to English.

  `team`: the people shown in the homepage Team section and in the contact
  form's "Team member" list.
    id            lowercase-with-dashes, unique; used by projects and links
    name, role    shown on cards
    photo         optional image path (e.g. '/team/alex.jpg' in /public/team/).
                  Without a photo, a green tile with initials is shown.
    available     true = "Available", false = "Booked"
    availability  short note shown when someone is filtered, e.g. 'Booked until January 2027'
    skills        first three are shown on the card

  `projects`: the shared portfolio. Featured first, then newest.
    title, year, client, summary, tags, results
    team          ids of the people who worked on it, e.g. ['ulugbek-xudoyqulov', 'abdulloh-muxtorov']
    category      'mobile' | 'web' | 'admin' | 'infrastructure'
    visual        { type, bg }: built-in mockup shown when there is no image
                  type: 'delivery' | 'booking' | 'shop' | 'network' | 'app' | 'dashboard'
                  bg:   'green' | 'ink' | 'paper' | 'grid'
    image         optional screenshot path; replaces the mockup
    caseId        optional; ties the project to a homepage "Selected work" case
                  ('courier' | 'clinic' | 'retail' | 'gateway') for its "Built by" credits

  Featured projects (real work) get a full-width showcase:
    featured      true
    tagline       one-line description under the title
    features      list of what the product does
    highlights    up to 3 { value, label } figures floating over the screenshots
    logo          optional small logo image
    images        [{ src, label, alt }]: screenshots in /public/portfolio/<project>/,
                  shown as a 3D stack (best at ~1900×960). Missing files are skipped;
                  with none left, the card falls back to the `visual` mockup.
    phones        optional portrait app screenshots (up to 4), shown as a fan of phones
    links         optional [{ label, href }] buttons, e.g. Google Play / App Store

  Shareable links: /?member=<id>#portfolio and /?type=<category>#portfolio
  open the portfolio already filtered; /?with=<id>#contact pre-selects a person;
  add &lang=ru or &lang=uz to open in that language.
  ============================================================================
*/

export const CATEGORIES = ['mobile', 'web', 'admin', 'infrastructure'];

const AVAILABLE = {
  en: 'Available for new projects',
  ru: 'Принимает новые проекты',
  uz: 'Yangi loyihalarga tayyor',
};

export const team = [
  {
    id: 'ulugbek-xudoyqulov',
    name: 'Ulug‘bek Xudoyqulov',
    role: { en: 'Team lead · iOS & Android', ru: 'Руководитель команды · iOS и Android', uz: 'Jamoa rahbari · iOS va Android' },
    photo: '/team/ulugbek-xudoyqulov.webp',
    available: true,
    availability: AVAILABLE,
    skills: ['iOS', 'Android'],
  },
  {
    id: 'abdulloh-muxtorov',
    name: 'Abdulloh Muxtorov',
    role: { en: 'Admin panels & Telegram bots', ru: 'Админ-панели и Telegram-боты', uz: 'Admin panellar va Telegram botlar' },
    photo: '/team/abdulloh-muxtorov.webp',
    available: true,
    availability: AVAILABLE,
    skills: [
      { en: 'Admin panels', ru: 'Админ-панели', uz: 'Admin panellar' },
      { en: 'Telegram bots', ru: 'Telegram-боты', uz: 'Telegram botlar' },
    ],
  },
  {
    id: 'temur-ibragimov',
    name: 'Temur Ibragimov',
    // TODO: real role and skills (not provided yet)
    role: { en: 'Afinity team', ru: 'Команда Afinity', uz: 'Afinity jamoasi' },
    photo: '/team/temur-ibragimov.webp',
    available: true,
    availability: AVAILABLE,
    skills: [],
  },
];

export const projects = [
  // ---- Real project ----
  {
    featured: true,
    title: 'Bibo ERP',
    tagline: { en: 'ERP for private kindergartens', ru: 'ERP для частных детских садов', uz: 'Xususiy bog‘chalar uchun ERP' },
    year: 2026,
    category: 'admin',
    client: {
      en: 'Own product · Tashkent, Uzbekistan',
      ru: 'Собственный продукт · Ташкент, Узбекистан',
      uz: 'O‘z mahsulotimiz · Toshkent, O‘zbekiston',
    },
    summary: {
      en: 'Bibo brings children, attendance, parents, staff and finances into one clear system. Directors see the day’s numbers live, accountants issue invoices and track debts, teachers mark attendance, and parents get announcements and payment reminders in Telegram.',
      ru: 'Bibo объединяет детей, посещаемость, родителей, сотрудников и финансы в одной понятной системе. Руководитель видит показатели дня в реальном времени, бухгалтер выставляет счета и отслеживает долги, воспитатели отмечают посещаемость, а родители получают объявления и напоминания об оплате в Telegram.',
      uz: 'Bibo bolalar, davomat, ota-onalar, xodimlar va moliyani bitta tushunarli tizimda birlashtiradi. Rahbar kun ko‘rsatkichlarini jonli ko‘radi, buxgalter hisob-fakturalar chiqaradi va qarzlarni kuzatadi, tarbiyachilar davomatni belgilaydi, ota-onalar esa Telegram orqali e’lonlar va to‘lov eslatmalarini oladi.',
    },
    features: {
      en: [
        'Live director dashboard: monthly plan vs. collected, total debt, children and today’s attendance',
        'Finance & operations: expenses, cash shifts, payroll, group profitability, Excel and PDF export',
        'Occupancy & churn analytics: free places per group, waiting list, 3-month forecast, lost revenue',
        'Invoices, payment receipts and debt tracking with automatic reminders',
        'Check-in / check-out for children and staff, entry control and a staff map',
        'Enrolment applications, Telegram bot and mini app for parents, role-based access, dark mode',
      ],
      ru: [
        'Панель руководителя в реальном времени: план и сборы за месяц, общий долг, дети и посещаемость за день',
        'Финансы и операции: расходы, кассовые смены, зарплата, рентабельность групп, экспорт в Excel и PDF',
        'Аналитика заполняемости и оттока: свободные места по группам, очередь, прогноз на 3 месяца, потерянная выручка',
        'Счета, чеки об оплате и учёт долгов с автоматическими напоминаниями',
        'Отметка прихода и ухода детей и сотрудников, контроль входа и карта сотрудников',
        'Заявки на зачисление, Telegram-бот и мини-приложение для родителей, роли и права доступа, тёмная тема',
      ],
      uz: [
        'Rahbar uchun jonli panel: oylik reja va yig‘ilgan tushum, umumiy qarzdorlik, bolalar va bugungi davomat',
        'Moliya va operatsiyalar: xarajatlar, kassa smenalari, ish haqi, guruhlar rentabelligi, Excel va PDF eksport',
        'Bandlik va ketish tahlili: guruhlardagi bo‘sh o‘rinlar, navbat, 3 oylik prognoz, yo‘qotilgan tushum',
        'Hisob-fakturalar, to‘lov cheklari va avtomatik eslatmalar bilan qarzdorlik nazorati',
        'Bolalar va xodimlar uchun kirish/chiqish, kirishlar nazorati va xodimlar xaritasi',
        'Qabul arizalari, ota-onalar uchun Telegram bot va mini-ilova, rollar bo‘yicha ruxsatlar, tungi rejim',
      ],
    },
    results: {
      en: [
        'Payments are applied to the oldest debt automatically',
        'Duplicate payment notifications can never create double records',
        'Messages are queued and resent if the connection drops',
      ],
      ru: [
        'Оплата автоматически закрывает самый старый долг',
        'Повторные уведомления о платеже никогда не создают дублей',
        'Сообщения ставятся в очередь и отправляются повторно при обрыве связи',
      ],
      uz: [
        'To‘lov avtomatik ravishda eng eski qarzni yopadi',
        'Takroriy to‘lov xabarlari hech qachon dublikat yozuv yaratmaydi',
        'Aloqa uzilsa, xabarlar navbatga qo‘yiladi va qayta yuboriladi',
      ],
    },
    // Figures shown as floating chips over the screenshots (taken from the screenshots themselves)
    highlights: {
      en: [
        { value: '4 105 000 so’m', label: 'collected in October' },
        { value: '122 children', label: '81% active' },
        { value: '51 free places', label: 'available right now' },
      ],
      ru: [
        { value: '4 105 000 сум', label: 'собрано в октябре' },
        { value: '122 ребёнка', label: '81% активны' },
        { value: '51 свободное место', label: 'доступно сейчас' },
      ],
      uz: [
        { value: '4 105 000 so‘m', label: 'oktyabrda yig‘ildi' },
        { value: '122 bola', label: '81% faol' },
        { value: '51 bo‘sh o‘rin', label: 'hozir mavjud' },
      ],
    },
    tags: ['Django', 'PostgreSQL', 'Celery & Redis', 'Telegram bot', 'Web app', 'Analytics'],
    team: [],
    logo: '/portfolio/bibo/logo.svg',
    images: [
      {
        src: '/portfolio/bibo/dashboard.webp',
        label: { en: 'Dashboard', ru: 'Дашборд', uz: 'Boshqaruv paneli' },
        alt: 'Bibo ERP director dashboard: monthly plan, collected income, total debt, children count and 6-month finance chart',
      },
      {
        src: '/portfolio/bibo/finance.webp',
        label: { en: 'Finance', ru: 'Финансы', uz: 'Moliya' },
        alt: 'Bibo ERP finance and operations: plan, income, expenses, net result, payment methods and group profitability',
      },
      {
        src: '/portfolio/bibo/occupancy.webp',
        label: { en: 'Occupancy', ru: 'Заполняемость', uz: 'Bandlik' },
        alt: 'Bibo ERP occupancy and churn analytics: places taken per group, waiting list and 3-month forecast',
      },
    ],
    visual: { type: 'dashboard', bg: 'ink' },
  },

  // ---- Real project ----
  {
    featured: true,
    title: 'IRIZON BONUS',
    tagline: {
      en: 'QR loyalty programme for auto parts buyers',
      ru: 'Программа лояльности с QR-кодами для покупателей автозапчастей',
      uz: 'Avto ehtiyot qismlar xaridorlari uchun QR bonus dasturi',
    },
    year: 2026,
    category: 'mobile',
    client: {
      en: 'IRIZON · auto parts manufacturer, Uzbekistan',
      ru: 'IRIZON · производитель автозапчастей, Узбекистан',
      uz: 'IRIZON · avto ehtiyot qismlar ishlab chiqaruvchisi, O‘zbekiston',
    },
    summary: {
      en: 'Buyers of IRIZON spark plugs, ignition coils and fuel pumps scan the QR code on every product with the app, collect bonus points and exchange them for gifts. IRIZON staff run the whole programme, from customers and products to QR codes, points and gift orders, in one web admin panel.',
      ru: 'Покупатели свечей зажигания, катушек и бензонасосов IRIZON сканируют QR-код на каждом товаре в приложении, копят бонусные баллы и обменивают их на подарки. Сотрудники IRIZON управляют всей программой — клиентами, товарами, QR-кодами, баллами и заказами подарков — в одной веб-админке.',
      uz: 'IRIZON svechalari, babinalari va benzin nasoslari xaridorlari har bir mahsulotdagi QR-kodni ilova orqali skanerlaydi, bonus ballarini yig‘adi va ularni sovg‘alarga almashtiradi. IRIZON xodimlari butun dasturni — mijozlar, mahsulotlar, QR-kodlar, ballar va sovg‘a buyurtmalarini — bitta veb admin panelda boshqaradi.',
    },
    features: {
      en: [
        'Android and iOS app: QR scanning, points balance, activity history, rewards shop and order tracking',
        'Points are set per product code (SKU), so renaming a product never changes its bonus',
        'Gift exchange requests with a full lifecycle: pending, approved, sent, completed or rejected',
        'Gift catalogue with photos, points price and stock; customers, products and QR code management',
        'Loyalty analytics: tiers, customer segments, 30-day activity and points movement over time',
        'Push notifications, reconciliation reports and an audit log of every admin action',
      ],
      ru: [
        'Приложение для Android и iOS: сканирование QR, баланс баллов, история активности, магазин наград и отслеживание заказов',
        'Баллы привязаны к коду товара (SKU), поэтому переименование товара не меняет бонус',
        'Заявки на обмен подарков с полным циклом: ожидает, одобрено, отправлено, выполнено или отклонено',
        'Каталог подарков с фото, ценой в баллах и остатками; управление клиентами, товарами и QR-кодами',
        'Аналитика лояльности: уровни, сегменты клиентов, активность за 30 дней и движение баллов',
        'Push-уведомления, акты сверки и журнал аудита всех действий администраторов',
      ],
      uz: [
        'Android va iOS ilovasi: QR skanerlash, ballar balansi, faollik tarixi, sovg‘alar do‘koni va buyurtmani kuzatish',
        'Ballar mahsulot kodi (SKU) bo‘yicha belgilanadi, mahsulot nomi o‘zgarsa ham bonus o‘zgarmaydi',
        'Sovg‘a almashish so‘rovlari to‘liq jarayon bilan: kutilmoqda, tasdiqlangan, yuborilgan, yakunlangan yoki rad etilgan',
        'Rasm, ball narxi va zaxirasi bilan sovg‘alar katalogi; mijozlar, mahsulotlar va QR-kodlarni boshqarish',
        'Sodiqlik tahlili: darajalar, mijoz segmentlari, 30 kunlik faollik va ballar harakati',
        'Push-bildirishnomalar, akt-sverka va administratorlarning barcha amallari audit jurnali',
      ],
    },
    results: {
      en: [
        'Every QR code pays out once, even when the same code is scanned twice at the same moment',
        'Points are calculated on the server, never trusted from the phone',
        'Every earn, spend and reversal is recorded in a ledger instead of being edited',
      ],
      ru: [
        'Каждый QR-код начисляет баллы только один раз — даже если его отсканировали дважды одновременно',
        'Баллы считаются на сервере, а не берутся с телефона',
        'Каждое начисление, списание и возврат записывается в журнал, а не редактируется',
      ],
      uz: [
        'Har bir QR-kod faqat bir marta ball beradi — hatto bir vaqtda ikki marta skanerlansa ham',
        'Ballar telefonda emas, serverda hisoblanadi',
        'Har bir qo‘shish, sarflash va qaytarish tahrirlanmaydi, balki jurnalga yoziladi',
      ],
    },
    highlights: {
      en: [
        { value: '1 000+ customers', label: 'in the programme' },
        { value: '243 active', label: 'in the last 30 days' },
        { value: '72 gift exchanges', label: 'processed' },
      ],
      ru: [
        { value: '1 000+ клиентов', label: 'в программе' },
        { value: '243 активных', label: 'за последние 30 дней' },
        { value: '72 обмена', label: 'подарков обработано' },
      ],
      uz: [
        { value: '1 000+ mijoz', label: 'dasturda' },
        { value: '243 faol', label: 'so‘nggi 30 kunda' },
        { value: '72 almashuv', label: 'sovg‘alar bo‘yicha' },
      ],
    },
    tags: ['Android', 'iOS', 'FastAPI', 'Web admin panel', 'QR codes', 'Loyalty'],
    team: [],
    links: [
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.irizon.bonus' },
      { label: 'App Store', href: 'https://apps.apple.com/app/id6793952162' },
    ],
    images: [
      {
        src: '/portfolio/irizon/admin-dashboard.webp',
        label: { en: 'Dashboard', ru: 'Дашборд', uz: 'Boshqaruv paneli' },
        alt: 'IRIZON BONUS admin dashboard: customers, points, exchanges, loyalty tiers and segments',
      },
      {
        src: '/portfolio/irizon/admin-requests.webp',
        label: { en: 'Exchange requests', ru: 'Заявки на обмен', uz: 'Almashish so‘rovlari' },
        alt: 'IRIZON BONUS admin panel: gift exchange requests with points, balances and statuses',
      },
      {
        src: '/portfolio/irizon/admin-gifts.webp',
        label: { en: 'Gift catalogue', ru: 'Каталог подарков', uz: 'Sovg‘alar katalogi' },
        alt: 'IRIZON BONUS admin panel: gift catalogue with photos, points prices and stock',
      },
    ],
    // Portrait app screenshots, shown as a fan of phones next to the admin screens
    phones: [
      {
        src: '/portfolio/irizon/app-scan.webp',
        label: { en: 'Scan QR', ru: 'Сканирование QR', uz: 'QR skanerlash' },
        alt: 'IRIZON BONUS app: scan a product QR code to earn points',
      },
      {
        src: '/portfolio/irizon/app-products.webp',
        label: { en: 'Products', ru: 'Товары', uz: 'Mahsulotlar' },
        alt: 'IRIZON BONUS app: products and the points each one earns',
      },
      {
        src: '/portfolio/irizon/app-rewards.webp',
        label: { en: 'Rewards shop', ru: 'Магазин наград', uz: 'Sovg‘alar do‘koni' },
        alt: 'IRIZON BONUS app: rewards shop to exchange points for gifts',
      },
      {
        src: '/portfolio/irizon/app-history.webp',
        label: { en: 'Activity', ru: 'Активность', uz: 'Faollik' },
        alt: 'IRIZON BONUS app: activity history of points, scans and gifts',
      },
    ],
    visual: { type: 'app', bg: 'ink' },
  },

  // ---- Real project ----
  {
    featured: true,
    title: 'Elchi',
    tagline: {
      en: 'Intercity parcels and rides, priced by agreement',
      ru: 'Посылки и поездки между городами по договорной цене',
      uz: 'Shaharlararo pochta va yo‘lovchi tashish — kelishilgan narxda',
    },
    year: 2026,
    category: 'mobile',
    client: { en: 'Own product · Uzbekistan', ru: 'Собственный продукт · Узбекистан', uz: 'O‘z mahsulotimiz · O‘zbekiston' },
    summary: {
      en: 'Elchi connects people who need to send a parcel or travel between Uzbekistan’s regions with verified drivers already making that trip. The client marks pickup and drop-off on the map and names a price; drivers going that way accept it or counter, and the client picks the best offer. It keeps the speed and cash habit of taxi stands and Telegram groups, and adds verification, tracking and support.',
      ru: 'Elchi соединяет тех, кому нужно отправить посылку или поехать в другой регион Узбекистана, с проверенными водителями, которые уже едут туда. Клиент отмечает точки на карте и называет цену; водители по пути принимают её или предлагают свою, а клиент выбирает лучшее предложение. Скорость и оплата наличными — как на стоянке такси или в Telegram-группе, но с проверкой водителей, отслеживанием и поддержкой.',
      uz: 'Elchi O‘zbekiston viloyatlari o‘rtasida posilka yuborish yoki yo‘lga chiqish kerak bo‘lgan odamlarni aynan shu yo‘nalishda ketayotgan tasdiqlangan haydovchilar bilan bog‘laydi. Mijoz xaritada manzillarni belgilaydi va narxini aytadi; yo‘nalishdagi haydovchilar uni qabul qiladi yoki o‘z narxini taklif qiladi, mijoz esa eng yaxshisini tanlaydi. Taksi bekati va Telegram guruhlaridagi tezlik va naqd to‘lov saqlanadi, ammo tekshiruv, kuzatuv va yordam qo‘shiladi.',
    },
    features: {
      en: [
        'Price by agreement: the client names a price, drivers accept or counter, the client chooses',
        'Every offer shows the driver’s name, photo, car and real rating; new drivers are marked “new”',
        'Phone numbers, plates and exact addresses stay hidden until an offer is accepted; contacts typed in chat are masked',
        'Live GPS tracking, with a link the client can share with the parcel’s recipient',
        'Drivers see orders along their own route, even mid-trip, and take them with one tap',
        'Chat with the driver, help and complaint chat with an operator, safety reports; Android, iOS and web in Uzbek and Russian',
      ],
      ru: [
        'Договорная цена: клиент называет цену, водители принимают её или предлагают свою, клиент выбирает',
        'В каждом предложении — имя, фото, автомобиль и реальный рейтинг водителя; новички отмечены как «новый»',
        'Телефоны, номера машин и точные адреса скрыты до принятия предложения; контакты в чате маскируются',
        'Отслеживание по GPS в реальном времени и ссылка, которой можно поделиться с получателем посылки',
        'Водители видят заказы по своему маршруту, даже в пути, и берут их в одно касание',
        'Чат с водителем, чат помощи и жалоб с оператором, сообщения о безопасности; Android, iOS и веб на узбекском и русском',
      ],
      uz: [
        'Kelishilgan narx: mijoz narxni aytadi, haydovchilar qabul qiladi yoki o‘z narxini taklif qiladi, mijoz tanlaydi',
        'Har bir taklifda haydovchining ismi, surati, mashinasi va haqiqiy reytingi; yangi haydovchilar «yangi» deb belgilanadi',
        'Telefon raqamlari, davlat raqamlari va aniq manzillar taklif qabul qilinguncha yashirin; chatdagi kontaktlar avtomatik yopiladi',
        'Jonli GPS kuzatuv va posilka oluvchisi bilan ulashish mumkin bo‘lgan havola',
        'Haydovchilar o‘z yo‘nalishidagi buyurtmalarni, hatto yo‘lda ham ko‘radi va bir bosishda oladi',
        'Haydovchi bilan chat, operator bilan yordam va shikoyat chati, xavfsizlik xabarlari; Android, iOS va veb — o‘zbek va rus tillarida',
      ],
    },
    results: {
      en: [
        'Built for trips between regions, not rides inside one city at a fixed tariff',
        'Uses cars already on the road, so a parcel can often arrive the same day',
        'Drivers are approved by staff and pay only a 1% commission from a prepaid in-app wallet',
      ],
      ru: [
        'Создан для поездок между регионами, а не по городу по фиксированному тарифу',
        'Использует машины, которые уже в пути, поэтому посылка часто доходит в тот же день',
        'Водителей проверяют сотрудники, а комиссия — всего 1% из предоплаченного кошелька в приложении',
      ],
      uz: [
        'Shahar ichida qat’iy tarif bo‘yicha emas, viloyatlar o‘rtasidagi safarlar uchun yaratilgan',
        'Yo‘lda ketayotgan mashinalardan foydalanadi — posilka ko‘pincha o‘sha kuniyoq yetib boradi',
        'Haydovchilar xodimlar tomonidan tasdiqlanadi va ilovadagi hamyondan atigi 1% komissiya to‘laydi',
      ],
    },
    highlights: {
      en: [
        { value: 'Price by agreement', label: 'no fixed tariff' },
        { value: '1% commission', label: 'paid by drivers' },
        { value: '14 regions', label: 'across Uzbekistan' },
      ],
      ru: [
        { value: 'Договорная цена', label: 'без фиксированного тарифа' },
        { value: 'Комиссия 1%', label: 'платят водители' },
        { value: '14 регионов', label: 'по всему Узбекистану' },
      ],
      uz: [
        { value: 'Kelishilgan narx', label: 'qat’iy tarifsiz' },
        { value: '1% komissiya', label: 'haydovchilardan' },
        { value: '14 hudud', label: 'butun O‘zbekiston bo‘ylab' },
      ],
    },
    tags: ['Android', 'iOS', 'Web', 'Maps & GPS', 'Admin panel', 'UZ / RU'],
    team: [],
    logo: '/portfolio/elchi/logo.png',
    images: [
      {
        src: '/portfolio/elchi/admin-tariffs.webp',
        label: { en: 'Tariffs', ru: 'Тарифы', uz: 'Tariflar' },
        alt: 'Elchi admin panel: recommended, minimum and maximum prices for intercity routes',
      },
      {
        src: '/portfolio/elchi/admin-regions.webp',
        label: { en: 'Regions', ru: 'Регионы', uz: 'Hududlar' },
        alt: 'Elchi admin panel: the 14 regions of Uzbekistan the service covers',
      },
      {
        src: '/portfolio/elchi/admin-dashboard.webp',
        label: { en: 'Dashboard', ru: 'Дашборд', uz: 'Bosh sahifa' },
        alt: 'Elchi admin dashboard: order totals, order statuses, commission split and drivers',
      },
      {
        src: '/portfolio/elchi/admin-settings.webp',
        label: { en: 'Platform settings', ru: 'Настройки платформы', uz: 'Platforma sozlamalari' },
        alt: 'Elchi admin panel: platform settings with services switched on per country and route',
      },
    ],
    phones: [
      {
        src: '/portfolio/elchi/app-map.webp',
        label: { en: 'Send a parcel', ru: 'Отправка посылки', uz: 'Pochta yuborish' },
        alt: 'Elchi app: choose where from and where to on the map',
      },
      {
        src: '/portfolio/elchi/app-onboarding.webp',
        label: { en: 'Welcome', ru: 'Приветствие', uz: 'Tanishuv' },
        alt: 'Elchi app onboarding: send your parcel from city to city',
      },
      {
        src: '/portfolio/elchi/app-role.webp',
        label: { en: 'Client or driver', ru: 'Клиент или водитель', uz: 'Mijoz yoki haydovchi' },
        alt: 'Elchi app: choose to continue as a client or as a driver',
      },
      {
        src: '/portfolio/elchi/app-profile.webp',
        label: { en: 'Profile', ru: 'Профиль', uz: 'Profil' },
        alt: 'Elchi app: client profile with orders and personal details',
      },
    ],
    visual: { type: 'app', bg: 'ink' },
  },
];

export const findMember = (id) => team.find((m) => m.id === id) ?? null;

export const projectsBy = (memberId) => projects.filter((p) => p.team.includes(memberId));

export const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export const firstName = (name) => name.split(/\s+/)[0];
