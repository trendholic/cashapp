import { colorFor, initials } from '../data/seed'

export default function Avatar({ name, size = 'md' }) {
  return (
    <div
      className={`avatar${size === 'lg' ? ' lg' : ''}`}
      style={{ background: colorFor(name) }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  )
}
