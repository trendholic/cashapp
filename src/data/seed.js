// Deterministic avatar color from a name/cashtag
export function colorFor(seed) {
  const colors = [
    '#FF5A5F', '#00B3A6', '#5B6CFF', '#FF8A3D', '#9B6BFF',
    '#FF6FB5', '#16C784', '#F5A623', '#4C8DFF', '#EE5D9B',
    '#7C5CFC', '#26C6DA', '#FF7043', '#42A5F5', '#AB47BC',
  ]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// The signed-in user is the first entry.
export const seedUsers = [
  { id: 'u_me', name: 'You', cashtag: '$you', balance: 327.5 },
  { id: 'u1', name: 'Sarah Chen', cashtag: '$sarahc', balance: 1284.12 },
  { id: 'u2', name: 'Marcus Johnson', cashtag: '$marcusj', balance: 56.0 },
  { id: 'u3', name: 'Emily Rodriguez', cashtag: '$emilyrod', balance: 842 },
  { id: 'u4', name: 'David Kim', cashtag: '$davidk', balance: 19.75 },
  { id: 'u5', name: 'Olivia Brown', cashtag: '$oliviab', balance: 503.4 },
  { id: 'u6', name: 'James Wilson', cashtag: '$jamesw', balance: 0 },
  { id: 'u7', name: 'Ava Martinez', cashtag: '$avam', balance: 218.9 },
  { id: 'u8', name: 'Noah Patel', cashtag: '$noahp', balance: 76.25 },
  { id: 'u9', name: 'Mia Thompson', cashtag: '$miat', balance: 1450.0 },
  { id: 'u10', name: 'Liam Garcia', cashtag: '$liamg', balance: 12.0 },
  { id: 'u11', name: 'Sophia Lee', cashtag: '$sophial', balance: 689.99 },
  { id: 'u12', name: 'Ethan Davis', cashtag: '$ethand', balance: 34.5 },
]

const now = Date.now()
const day = 86_400_000

export const seedTransactions = [
  { id: 't1', type: 'received', fromId: 'u1', toId: 'u_me', amount: 45, note: 'Dinner last night 🍜', date: now - day },
  { id: 't2', type: 'sent', fromId: 'u_me', toId: 'u2', amount: 20, note: 'Movie tickets 🎬', date: now - day * 2 },
  { id: 't3', type: 'received', fromId: 'u5', toId: 'u_me', amount: 120, note: 'Concert split 🎶', date: now - day * 4 },
  { id: 't4', type: 'sent', fromId: 'u_me', toId: 'u3', amount: 15.5, note: 'Coffee ☕️', date: now - day * 6 },
  { id: 't5', type: 'cash_added', toId: 'u_me', amount: 200, note: 'From linked bank', date: now - day * 9 },
]

export const ADMIN_PIN = '1234'
