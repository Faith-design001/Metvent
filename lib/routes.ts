// lib/routes.ts
// Shared page names drawn directly from PRD feature names.
// A title names only the page. It never includes attendee names, notes, or event content.

export const PAGE_NAMES = {
  home: 'Home',
  join: 'Join',
  card: 'Card',
  board: 'Board',
  room: 'Room Right Now',
  opener: 'Opener',
  people: 'Who I Met',
  organiser: 'Organiser Dashboard',
} as const;
