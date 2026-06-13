// Highlights the part of `text` that matches `query` (case-insensitive).
export default function Highlight({ text, query }) {
  const q = (query || '').trim()
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <span className="hl">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  )
}
