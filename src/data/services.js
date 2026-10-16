/*
  Service pages: /services/<slug>.html (one HTML file per service, content from here).

  slug        page address: /services/<slug>.html (add the HTML file and a build input in vite.config.js too)
  product     key in src/data/pricing.js (shows "from" price and timeline) and the contact form service it ticks
  seoTitle    browser tab / search result title; keep the city name, people search "… in Tashkent"
  projects    slugs from src/data/team.js shown under "Projects we built"
  Every text is { en, ru, uz }.
*/

export const services = [
  {
    slug: 'mobile-apps',
    product: 'mobile',
    title: { en: 'Mobile app development', ru: 'Разработка мобильных приложений', uz: 'Mobil ilovalar yaratish' },
    seoTitle: {
      en: 'Mobile app development in Tashkent — Afinity',
      ru: 'Разработка мобильных приложений в Ташкенте — Afinity',
      uz: 'Toshkentda mobil ilova yaratish — Afinity',
    },
    lead: {
      en: 'iOS and Android apps for businesses in Uzbekistan, from the first idea to release on the App Store and Google Play, with the admin panel and server behind them.',
      ru: 'Приложения для iOS и Android для бизнеса в Узбекистане — от первой идеи до публикации в App Store и Google Play, вместе с админ-панелью и сервером.',
      uz: 'O‘zbekistondagi biznes uchun iOS va Android ilovalar — birinchi g‘oyadan App Store va Google Play’da chiqishgacha, admin panel va server bilan birga.',
    },
    deliverables: [
      {
        title: { en: 'iOS and Android', ru: 'iOS и Android', uz: 'iOS va Android' },
        text: {
          en: 'One app for both platforms or a single platform to start, whichever fits your budget and users.',
          ru: 'Одно приложение для обеих платформ или сначала одна — как лучше для вашего бюджета и пользователей.',
          uz: 'Ikkala platforma uchun bitta ilova yoki boshlanishiga bittasi — byudjet va foydalanuvchilaringizga qaysi mos bo‘lsa.',
        },
      },
      {
        title: { en: 'Design you can click', ru: 'Кликабельный дизайн', uz: 'Bosib ko‘rsa bo‘ladigan dizayn' },
        text: {
          en: 'Screens and a clickable prototype you approve before development starts.',
          ru: 'Экраны и кликабельный прототип, которые вы утверждаете до начала разработки.',
          uz: 'Ishlab chiqish boshlanishidan oldin siz tasdiqlaydigan ekranlar va bosiladigan prototip.',
        },
      },
      {
        title: { en: 'Payments and maps', ru: 'Оплата и карты', uz: 'To‘lov va xaritalar' },
        text: {
          en: 'Payme, Click and card payments, maps, GPS and live tracking when your product needs them.',
          ru: 'Payme, Click и оплата картой, карты, GPS и отслеживание в реальном времени, если они нужны продукту.',
          uz: 'Payme, Click va karta orqali to‘lov, xaritalar, GPS va jonli kuzatuv — mahsulotingizga kerak bo‘lsa.',
        },
      },
      {
        title: { en: 'Push notifications', ru: 'Push-уведомления', uz: 'Push-bildirishnomalar' },
        text: {
          en: 'Order updates, reminders and promotions that bring users back to the app.',
          ru: 'Статусы заказов, напоминания и акции, которые возвращают пользователей в приложение.',
          uz: 'Buyurtma holati, eslatmalar va aksiyalar foydalanuvchilarni ilovaga qaytaradi.',
        },
      },
      {
        title: { en: 'Admin panel included', ru: 'Админ-панель в комплекте', uz: 'Admin panel bilan birga' },
        text: {
          en: 'A web panel for your team to manage users, orders, content and reports.',
          ru: 'Веб-панель, где ваша команда управляет пользователями, заказами, контентом и отчётами.',
          uz: 'Jamoangiz foydalanuvchilar, buyurtmalar, kontent va hisobotlarni boshqaradigan veb-panel.',
        },
      },
      {
        title: { en: 'Store release and support', ru: 'Публикация и поддержка', uz: 'Do‘konga chiqarish va qo‘llab-quvvatlash' },
        text: {
          en: 'We publish to the App Store and Google Play and keep the app updated after launch.',
          ru: 'Публикуем в App Store и Google Play и обновляем приложение после запуска.',
          uz: 'App Store va Google Play’ga joylaymiz va ishga tushgandan keyin ham yangilab boramiz.',
        },
      },
    ],
    stack: ['Android', 'iOS', 'Payme · Click', 'Maps & GPS', 'Push', 'App Store · Google Play'],
    projects: ['irizon-bonus', 'elchi'],
    faq: [
      {
        q: {
          en: 'How much does a mobile app cost?',
          ru: 'Сколько стоит мобильное приложение?',
          uz: 'Mobil ilova qancha turadi?',
        },
        a: {
          en: 'It depends on the screens and features. Use the cost estimator for a rough range in a minute; after a short call we give an exact price.',
          ru: 'Зависит от экранов и функций. Калькулятор стоимости покажет примерный диапазон за минуту, а точную цену назовём после короткого звонка.',
          uz: 'Ekranlar va funksiyalarga bog‘liq. Narx kalkulyatori bir daqiqada taxminiy oraliqni ko‘rsatadi, aniq narxni qisqa suhbatdan so‘ng aytamiz.',
        },
      },
      {
        q: {
          en: 'How long does it take?',
          ru: 'Сколько времени занимает разработка?',
          uz: 'Qancha vaqt ketadi?',
        },
        a: {
          en: 'A typical app with an admin panel takes two to four months. A smaller first version can be ready sooner.',
          ru: 'Обычное приложение с админ-панелью — от двух до четырёх месяцев. Небольшую первую версию можно запустить быстрее.',
          uz: 'Admin panelli oddiy ilova ikki-to‘rt oy oladi. Kichikroq birinchi versiya tezroq tayyor bo‘lishi mumkin.',
        },
      },
      {
        q: {
          en: 'Who owns the app and the code?',
          ru: 'Кому принадлежат приложение и код?',
          uz: 'Ilova va kod kimga tegishli?',
        },
        a: {
          en: 'You do. The app is published under your account and you receive the source code.',
          ru: 'Вам. Приложение публикуется в вашем аккаунте, и вы получаете исходный код.',
          uz: 'Sizga. Ilova sizning akkauntingizda joylanadi va manba kodini olasiz.',
        },
      },
    ],
  },

  {
    slug: 'admin-panels',
    product: 'admin',
    title: { en: 'Admin panels and CRM systems', ru: 'Админ-панели и CRM-системы', uz: 'Admin panellar va CRM tizimlar' },
    seoTitle: {
      en: 'Admin panel and CRM development in Tashkent — Afinity',
      ru: 'Разработка админ-панелей и CRM в Ташкенте — Afinity',
      uz: 'Toshkentda admin panel va CRM yaratish — Afinity',
    },
    lead: {
      en: 'Web systems that replace spreadsheets, paper and scattered chats: one place where your team manages customers, orders, payments and reports.',
      ru: 'Веб-системы вместо таблиц, бумаги и разрозненных чатов: одно место, где команда управляет клиентами, заказами, оплатами и отчётами.',
      uz: 'Jadvallar, qog‘oz va tarqoq chatlar o‘rniga veb-tizimlar: jamoangiz mijozlar, buyurtmalar, to‘lovlar va hisobotlarni boshqaradigan yagona joy.',
    },
    deliverables: [
      {
        title: { en: 'Live dashboard', ru: 'Дашборд в реальном времени', uz: 'Jonli boshqaruv paneli' },
        text: {
          en: 'The numbers that matter today, on one screen, without manual counting.',
          ru: 'Главные показатели дня на одном экране, без ручных подсчётов.',
          uz: 'Bugungi muhim ko‘rsatkichlar bitta ekranda, qo‘lda hisoblashsiz.',
        },
      },
      {
        title: { en: 'Roles and access', ru: 'Роли и доступы', uz: 'Rollar va ruxsatlar' },
        text: {
          en: 'Directors, managers and staff each see only what they need.',
          ru: 'Руководитель, менеджеры и сотрудники видят только то, что им нужно.',
          uz: 'Rahbar, menejerlar va xodimlar faqat o‘zlariga keraklisini ko‘radi.',
        },
      },
      {
        title: { en: 'Finance and debts', ru: 'Финансы и долги', uz: 'Moliya va qarzlar' },
        text: {
          en: 'Invoices, payments and debt tracking with automatic reminders.',
          ru: 'Счета, оплаты и учёт долгов с автоматическими напоминаниями.',
          uz: 'Hisob-fakturalar, to‘lovlar va avtomatik eslatmali qarzdorlik nazorati.',
        },
      },
      {
        title: { en: 'Reports and export', ru: 'Отчёты и экспорт', uz: 'Hisobotlar va eksport' },
        text: {
          en: 'Charts, filters and export to Excel and PDF for accounting and owners.',
          ru: 'Графики, фильтры и выгрузка в Excel и PDF для бухгалтерии и владельцев.',
          uz: 'Buxgalteriya va egalari uchun grafiklar, filtrlar va Excel hamda PDF eksport.',
        },
      },
      {
        title: { en: 'Audit log', ru: 'Журнал действий', uz: 'Amallar jurnali' },
        text: {
          en: 'Every change is recorded: who did what and when.',
          ru: 'Каждое изменение записывается: кто, что и когда сделал.',
          uz: 'Har bir o‘zgarish yoziladi: kim, nima va qachon qilgani.',
        },
      },
      {
        title: { en: 'Telegram and integrations', ru: 'Telegram и интеграции', uz: 'Telegram va integratsiyalar' },
        text: {
          en: 'Notifications in Telegram and connections to 1C, payment systems and your apps.',
          ru: 'Уведомления в Telegram и связь с 1С, платёжными системами и вашими приложениями.',
          uz: 'Telegram’da bildirishnomalar va 1C, to‘lov tizimlari hamda ilovalaringiz bilan bog‘lanish.',
        },
      },
    ],
    stack: ['Django', 'FastAPI', 'PostgreSQL', 'Celery & Redis', 'Excel · PDF', 'Telegram'],
    projects: ['bibo-erp', 'irizon-bonus', 'elchi'],
    faq: [
      {
        q: {
          en: 'Can you build a system for our specific business?',
          ru: 'Можно сделать систему именно под наш бизнес?',
          uz: 'Aynan bizning biznes uchun tizim qilsa bo‘ladimi?',
        },
        a: {
          en: 'Yes, that is what we do. We start by learning how your team works today, then build the system around it.',
          ru: 'Да, этим мы и занимаемся. Сначала разбираемся, как работает ваша команда сейчас, затем строим систему под это.',
          uz: 'Ha, aynan shu bilan shug‘ullanamiz. Avval jamoangiz hozir qanday ishlashini o‘rganamiz, keyin tizimni shunga moslab quramiz.',
        },
      },
      {
        q: {
          en: 'Can we move our data from Excel?',
          ru: 'Можно перенести наши данные из Excel?',
          uz: 'Ma’lumotlarimizni Excel’dan ko‘chirsa bo‘ladimi?',
        },
        a: {
          en: 'Yes. We import your existing customers, products and history so you do not start from zero.',
          ru: 'Да. Мы переносим существующих клиентов, товары и историю, чтобы вы не начинали с нуля.',
          uz: 'Ha. Mavjud mijozlar, mahsulotlar va tarixni ko‘chiramiz, noldan boshlamaysiz.',
        },
      },
      {
        q: {
          en: 'Does it work on phones?',
          ru: 'Работает ли это на телефоне?',
          uz: 'Telefonda ishlaydimi?',
        },
        a: {
          en: 'Yes. The panel works in any browser, on a computer, tablet or phone.',
          ru: 'Да. Панель работает в любом браузере — на компьютере, планшете и телефоне.',
          uz: 'Ha. Panel istalgan brauzerda — kompyuter, planshet va telefonda ishlaydi.',
        },
      },
    ],
  },

  {
    slug: 'telegram-bots',
    product: 'bot',
    title: { en: 'Telegram bots and mini apps', ru: 'Telegram-боты и мини-приложения', uz: 'Telegram botlar va mini-ilovalar' },
    seoTitle: {
      en: 'Telegram bot development in Tashkent — Afinity',
      ru: 'Разработка Telegram-ботов в Ташкенте — Afinity',
      uz: 'Toshkentda Telegram bot yaratish — Afinity',
    },
    lead: {
      en: 'Your customers already use Telegram every day. A bot takes orders, answers questions and sends reminders right there, connected to your system.',
      ru: 'Ваши клиенты и так каждый день в Telegram. Бот принимает заказы, отвечает на вопросы и отправляет напоминания прямо там, связанный с вашей системой.',
      uz: 'Mijozlaringiz har kuni Telegram’da. Bot aynan o‘sha yerda buyurtma qabul qiladi, savollarga javob beradi va eslatmalar yuboradi, tizimingiz bilan bog‘langan holda.',
    },
    deliverables: [
      {
        title: { en: 'Orders and requests', ru: 'Заказы и заявки', uz: 'Buyurtmalar va arizalar' },
        text: {
          en: 'Customers order, book or apply in a few taps, and your team gets it instantly.',
          ru: 'Клиенты заказывают, записываются или оставляют заявку в пару касаний, а команда сразу её получает.',
          uz: 'Mijozlar bir necha bosishda buyurtma beradi, yoziladi yoki ariza qoldiradi, jamoangiz uni darhol oladi.',
        },
      },
      {
        title: { en: 'Mini apps', ru: 'Мини-приложения', uz: 'Mini-ilovalar' },
        text: {
          en: 'A full app interface inside Telegram, with no download needed.',
          ru: 'Полноценный интерфейс приложения внутри Telegram, без скачивания.',
          uz: 'Telegram ichida to‘liq ilova interfeysi, yuklab olish shart emas.',
        },
      },
      {
        title: { en: 'Reminders and broadcasts', ru: 'Напоминания и рассылки', uz: 'Eslatmalar va xabarnomalar' },
        text: {
          en: 'Payment reminders, announcements and news sent automatically.',
          ru: 'Напоминания об оплате, объявления и новости отправляются автоматически.',
          uz: 'To‘lov eslatmalari, e’lonlar va yangiliklar avtomatik yuboriladi.',
        },
      },
      {
        title: { en: 'Online payments', ru: 'Онлайн-оплата', uz: 'Onlayn to‘lov' },
        text: {
          en: 'Customers pay with Payme, Click or a card without leaving the chat.',
          ru: 'Клиенты платят через Payme, Click или картой, не выходя из чата.',
          uz: 'Mijozlar chatdan chiqmasdan Payme, Click yoki karta orqali to‘laydi.',
        },
      },
      {
        title: { en: 'Uzbek and Russian', ru: 'Узбекский и русский', uz: 'O‘zbek va rus tillari' },
        text: {
          en: 'The bot speaks your customers’ language, with an easy switch.',
          ru: 'Бот говорит на языке ваших клиентов и легко переключается.',
          uz: 'Bot mijozlaringiz tilida gaplashadi va oson almashtiriladi.',
        },
      },
      {
        title: { en: 'Connected to your system', ru: 'Связь с вашей системой', uz: 'Tizimingiz bilan bog‘langan' },
        text: {
          en: 'Orders and data go straight to your admin panel or CRM, not to a separate chat.',
          ru: 'Заказы и данные попадают прямо в админ-панель или CRM, а не в отдельный чат.',
          uz: 'Buyurtmalar va ma’lumotlar alohida chatga emas, to‘g‘ridan-to‘g‘ri admin panel yoki CRM’ga tushadi.',
        },
      },
    ],
    stack: ['Telegram Bot API', 'Mini Apps', 'Python', 'PostgreSQL', 'Payme · Click', 'UZ · RU'],
    projects: ['bibo-erp'],
    faq: [
      {
        q: {
          en: 'How fast can a bot be ready?',
          ru: 'Как быстро можно сделать бота?',
          uz: 'Botni qanchalik tez tayyorlash mumkin?',
        },
        a: {
          en: 'A simple bot takes about one to three weeks. Bots with payments or a mini app take longer.',
          ru: 'Простой бот — примерно от одной до трёх недель. Боты с оплатой или мини-приложением — дольше.',
          uz: 'Oddiy bot taxminan bir-uch hafta oladi. To‘lovli yoki mini-ilovali botlar ko‘proq vaqt talab qiladi.',
        },
      },
      {
        q: {
          en: 'Do we need a website or an app as well?',
          ru: 'Нужен ли нам ещё сайт или приложение?',
          uz: 'Bizga yana sayt yoki ilova kerakmi?',
        },
        a: {
          en: 'Not necessarily. Many businesses start with a bot and add an app or admin panel later.',
          ru: 'Не обязательно. Многие начинают с бота и позже добавляют приложение или админ-панель.',
          uz: 'Shart emas. Ko‘pchilik botdan boshlaydi va keyinroq ilova yoki admin panel qo‘shadi.',
        },
      },
      {
        q: {
          en: 'Who manages the bot after launch?',
          ru: 'Кто управляет ботом после запуска?',
          uz: 'Ishga tushgandan keyin botni kim boshqaradi?',
        },
        a: {
          en: 'Your team, from a simple admin panel. We stay on for support and new features.',
          ru: 'Ваша команда — через простую админ-панель. Мы остаёмся на поддержке и добавляем новые функции.',
          uz: 'Jamoangiz — oddiy admin panel orqali. Biz qo‘llab-quvvatlash va yangi funksiyalar uchun yoningizdamiz.',
        },
      },
    ],
  },
];

export const findService = (slug) => services.find((s) => s.slug === slug) ?? null;
