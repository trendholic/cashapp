// Deterministic avatar color from a name
export function colorFor(name) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#5567FF', '#FFA94D', '#9775FA',
    '#FF8CC8', '#20C997', '#FAB005', '#748FFC', '#F783AC',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
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

export const me = {
  name: 'You',
  cashtag: '$you',
  email: 'onlinetrader002@gmail.com',
}

export const seedContacts = [
  { id: 'c1', name: 'Sarah Chen', cashtag: '$sarahc' },
  { id: 'c2', name: 'Marcus Johnson', cashtag: '$marcusj' },
  { id: 'c3', name: 'Emily Rodriguez', cashtag: '$emilyrod' },
  { id: 'c4', name: 'David Kim', cashtag: '$davidk' },
  { id: 'c5', name: 'Olivia Brown', cashtag: '$oliviab' },
  { id: 'c6', name: 'James Wilson', cashtag: '$jamesw' },
  { id: 'c7', name: 'Ava Martinez', cashtag: '$avam' },
  { id: 'c8', name: 'Noah Patel', cashtag: '$noahp' },
]

const now = Date.now()
const day = 86_400_000

export const seedTransactions = [
  {
    id: 't1',
    type: 'received',
    contactId: 'c1',
    name: 'Sarah Chen',
    amount: 45,
    note: 'Dinner last night 🍜',
    date: now - day * 1,
  },
  {
    id: 't2',
    type: 'sent',
    contactId: 'c2',
    name: 'Marcus Johnson',
    amount: 20,
    note: 'Movie tickets',
    date: now - day * 2,
  },
  {
    id: 't3',
    type: 'received',
    contactId: 'c5',
    name: 'Olivia Brown',
    amount: 120,
    note: 'Concert split 🎶',
    date: now - day * 4,
  },
  {
    id: 't4',
    type: 'sent',
    contactId: 'c3',
    name: 'Emily Rodriguez',
    amount: 15.5,
    note: 'Coffee runs',
    date: now - day * 6,
  },
  {
    id: 't5',
    type: 'cash_added',
    name: 'Added Cash',
    amount: 200,
    note: 'From Bank of America',
    date: now - day * 9,
  },
]

export const SEED_BALANCE = 327.5
