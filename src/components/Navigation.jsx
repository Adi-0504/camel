import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { useApp } from '../context/AppContext.jsx'

const links = [
  { to: '/dashboard', label: 'dashboard', icon: 'calendar' },
  { to: '/timeline', label: 'timeline', icon: 'timeline' },
  { to: '/reflection', label: 'reflection', icon: 'pen' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const { t } = useApp()

  return (
    <>
      <button className="curtain-toggle" type="button" onClick={() => setOpen(true)} aria-label={t('openNav')}>
        <Icon name="menu" />
      </button>
      <aside className={`cafe-curtain ${open ? 'is-open' : ''}`} aria-label={t('navLabel')}>
        <div className="curtain-header">
          <div>
            <p className="eyebrow">{t('curtain')}</p>
            <h2>{t('moveDay')}</h2>
          </div>
          <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label={t('closeNav')}>
            <Icon name="close" />
          </button>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              <Icon name={link.icon} />
              <span>{t(link.label)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <button className="curtain-backdrop" aria-label={t('closeNav')} type="button" onClick={() => setOpen(false)} />}
    </>
  )
}
