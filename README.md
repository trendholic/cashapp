# Cash App Clone

A peer-to-peer payments web app styled after **Cash App**, built with React + Vite.
It runs entirely in the browser and persists your data to `localStorage`, so there's
no backend to set up — open it and start sending money.

## Features (Core P2P Payments)

- **Keypad home** — Cash App's signature big-amount keypad with live balance.
- **Pay & Request** — enter an amount, pick a contact, add a note, and confirm.
  Balance updates instantly; payments check for sufficient funds.
- **Contacts** — searchable contact list by name or `$cashtag`.
- **Activity feed** — chronological transaction history with avatars, notes,
  relative dates, and filters (All / Sent / Received / Pending).
- **Profile** — your `$cashtag`, cash balance, **Add Cash** / **Cash Out**, and a
  reset-to-demo-defaults option.
- **Persistence** — everything is saved locally and survives refreshes.

## Tech Stack

- React 18 + React Router 6
- Vite 5 (dev server + build)
- Plain CSS (no UI framework) for a dark, mobile-first Cash App look

## Getting Started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Open the app on a narrow viewport (or use your browser's device toolbar) for the
full mobile experience — it's framed as a phone on wider screens.

## Project Structure

```
src/
  components/   Avatar, TabBar, Toast (shared UI)
  data/         seed.js  — demo contacts, transactions, avatar colors
  screens/      Home (keypad), Send (pay/request flow), Activity, Profile
  state/        store.jsx — reducer + localStorage-backed context
  utils/        format.js — money & date formatting
  App.jsx       routes + app shell
```

## Notes

This is a front-end demo for educational purposes. It uses mock data and does not
connect to any real payment network, bank, or the actual Cash App service.
