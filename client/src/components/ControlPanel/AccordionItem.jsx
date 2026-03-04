import { useState } from 'react'

export default function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={styles.wrapper}>
      <button style={styles.header} onClick={() => setOpen(!open)}>
        <span style={styles.title}>{title}</span>
        <span style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
      </button>
      {open && <div style={styles.body}>{children}</div>}
    </div>
  )
}

const styles = {
  wrapper: { borderBottom: '1px solid var(--gray-200)' },
  header:  { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' },
  title:   { flex: 1, textAlign: 'left' },
  body:    { padding: '4px 20px 20px' },
}