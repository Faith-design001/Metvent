# Metvent

> **Live Application:** [https://metvent.vercel.app](https://metvent.vercel.app)

[![Live Website](https://img.shields.io/badge/Live_Site-metvent.vercel.app-5145e5?style=for-the-badge&logo=vercel&logoColor=white)](https://metvent.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Faith--design001%2FMetvent-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Faith-design001/Metvent)

Metvent is a web page opened at one specific event that shows what is happening in the room and what attendees have said they want to talk about. It turns real event data into something specific an attendee can say, without guessing anything about another person.

Version one serves solo attendees at recurring monthly community meetups of 30 to 120 people, where the main problem is continuing a conversation after it starts.

---

## Core Principle

**Never invent a fact about an attendee, event, session, or conversation.**

Every sentence the product shows must name the exact field it came from. When data is missing, the product says so or stops. The product's advantage over a generic chatbot is that it uses what is really on file. One invented fact removes that advantage and can embarrass or harm a real person.

---

## Privacy and Identity Boundaries

- **No attendee accounts**: Attendees join with a 6-character event code. There are no passwords, no email sign-ups, and no recovery paths for attendees.
- **Device sessions**: A signed, secure cookie ties one device to one attendee. The session persists across events so private notes remain accessible on that device.
- **Explicit visibility**: An attendee's card is never shown to other attendees until they explicitly toggle visibility on. An attendee who is not visible cannot view the Board or other attendee cards.
- **Private notes**: Notes taken in "Who I Met" are readable only by their author. Notes are never sent in Board responses and cannot be queried by other attendees or organisers.
- **Fixed retention**: Event data enters read-only status when closed. Cards and flags are permanently deleted 30 days after event close. Private notes remain on the device.

---

## Route Structure

| Route | Purpose | Access |
| :--- | :--- | :--- |
| `/` | Public landing page and event overview | Public |
| `/join` | Join code entry screen | Public |
| `/event/[eventId]/card` | Own card setup and visibility toggle | Attendee device session |
| `/event/[eventId]/board` | Attendee board showing visible cards | Visible attendees only |
| `/event/[eventId]/room` | Room Right Now (current session facts) | Joined attendees |
| `/event/[eventId]/opener/[attendeeId]` | Opener templates based on real card fields | Visible attendees only |
| `/event/[eventId]/people` | Private notes on people met | Private to device session |
| `/organiser/[eventId]` | Organiser dashboard (sessions, join code, flags) | Authenticated organiser |
| `/organiser/login` | Organiser sign in with magic link | Organisers |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Vanilla CSS Modules powered by Design System tokens (strict 8px spatial grid, semantic color roles)
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Testing**: Vitest
- **Linting & Types**: ESLint 9 (Flat Config), TypeScript strict mode
- **AI**: Gemini free tier for the single Room Right Now summary question model call (Opener and Second Question use fixed sentence templates)

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Faith-design001/Metvent.git
   cd Metvent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Provide your PostgreSQL `DATABASE_URL`, cryptographic cookie signing secrets, and optional `GEMINI_API_KEY`.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the local development server at `http://localhost:3000` |
| `npm run build` | Compiles the production build |
| `npm run start` | Runs the compiled production server |
| `npm run typecheck` | Runs the TypeScript compiler check (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint across the codebase |
| `npm test` | Runs the Vitest test suite |

---

## Security

- **Input Validation**: All server actions check input type, character length, and allowed character sets.
- **Join Code Formatting**: Join codes use 6 characters from an unambiguous 32-character alphanumeric set (`23456789ABCDEFGHJKLMNPQRSTUVWXYZ`), excluding look-alike characters (0, 1, I, O).
- **Rate Limiting**: Sliding-window in-memory rate limiting prevents brute force attempts on join codes (maximum 60 failed attempts per 10 minutes per IP).
- **Secure Cookies**: Device sessions are signed using HMAC-SHA256 and stored as `HttpOnly`, `Secure`, `SameSite=Lax` cookies.
