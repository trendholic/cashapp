import { colorFor, initials } from '../data/seed'

export default function Avatar({ user, name, size = 'md' }) {
  const label = user?.name || name || '?'
  const seed = user?.cashtag || label
  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: colorFor(seed) }}
      aria-hidden="true"
    >
      {initials(label)}
    </div>
  )
}
