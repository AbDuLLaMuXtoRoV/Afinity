/*
  Client reviews. Add a review ONLY with the client's permission, in their own words.

  name      client's name as they agreed to show it
  role      { en, ru, uz } their position
  company   company name
  photo     optional: '/reviews/<name>.webp' (put the file in public/reviews/)
  project   optional: project slug from src/data/team.js; the review also appears on that project page
  quote     { en, ru, uz } what they said (translate faithfully, keep their meaning)

  While this list is empty the reviews section is hidden everywhere.
*/
export const reviews = [];

// Shown only when the address ends with ?reviews=preview, to see the design before you have a real review.
// Never shown to normal visitors.
export const PREVIEW_REVIEWS = [
  {
    name: 'Client name',
    role: { en: 'Position', ru: 'Должность', uz: 'Lavozimi' },
    company: 'Company',
    project: 'irizon-bonus',
    quote: {
      en: 'This is where a real client’s words will go: what problem they had, how working with you felt and what changed after launch.',
      ru: 'Здесь будут слова настоящего клиента: какая у него была задача, как проходила работа и что изменилось после запуска.',
      uz: 'Bu yerda haqiqiy mijozning so‘zlari bo‘ladi: qanday muammosi bor edi, ish qanday o‘tdi va ishga tushgandan keyin nima o‘zgardi.',
    },
  },
];
