'use client'

import { useState } from 'react'

const servers = [
  { name: 'Survival SMP', id: 'survival-smp', status: 'running', address: 'mc.nightshift.host:25565', type: 'Minecraft: Java Edition', color: 'emerald' },
  { name: 'Creative Build', id: 'creative-build', status: 'offline', address: 'creative.nightshift.host:25565', type: 'Minecraft: Java Edition', color: 'violet' },
  { name: 'Valheim', id: 'valheim', status: 'running', address: 'valheim.nightshift.host:2456', type: 'Valheim', color: 'amber' },
]

function Icon({ children }: { children: React.ReactNode }) {
  return <span aria-hidden="true" className="icon">{children}</span>
}

function Sidebar({ active, onSelect }: { active: string; onSelect: (value: string) => void }) {
  const items = [
    ['dashboard', '⌂', 'Dashboard'],
    ['servers', '▣', 'Servers'],
    ['account', '◎', 'Account'],
  ]
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">N</div><span>NIGHTSHIFT</span></div>
      <div className="profile"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><small>jordan@example.com</small></div><span className="chevron">⌄</span></div>
      <nav aria-label="Main navigation">
        <p className="nav-label">NAVIGATION</p>
        {items.map(([key, icon, label]) => <button key={key} className={`nav-item ${active === key ? 'active' : ''}`} onClick={() => onSelect(key)}><Icon>{icon}</Icon><span>{label}</span></button>)}
        <p className="nav-label space">SUPPORT</p>
        <button className="nav-item" onClick={() => onSelect('support')}><Icon>?</Icon><span>Support</span></button>
        <button className="nav-item" onClick={() => onSelect('settings')}><Icon>⚙</Icon><span>Settings</span></button>
      </nav>
      <div className="sidebar-footer"><span>v1.15.2</span><a href="https://pterodactyl.io" target="_blank" rel="noreferrer">Pterodactyl panel ↗</a></div>
    </aside>
  )
}

function Header({ title, onMenu }: { title: string; onMenu: () => void }) {
  return <header className="topbar"><button className="mobile-menu" onClick={onMenu} aria-label="Open navigation">☰</button><div><p className="eyebrow">NIGHTSHIFT PANEL</p><h1>{title}</h1></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♢<span className="notification-dot" /></button><button className="help-button">Need help? <strong>Open a ticket</strong> ↗</button><div className="small-avatar">JD</div></div></header>
}

function ServerCard({ server, onOpen }: { server: typeof servers[number]; onOpen: () => void }) {
  return <article className="server-card"><div className="server-card-top"><div className={`server-icon ${server.color}`}>▣</div><div className="server-title"><h3>{server.name}</h3><span>{server.type}</span></div><button className="more" aria-label={`More options for ${server.name}`}>•••</button></div><div className="server-address"><span className={`status-dot ${server.status}`} />{server.address}<button aria-label="Copy server address">▣</button></div><div className="server-metrics"><div><span>CPU</span><strong>{server.status === 'running' ? '12%' : '0%'}</strong></div><div><span>MEMORY</span><strong>{server.status === 'running' ? '1.8 / 4 GB' : '0 / 4 GB'}</strong></div><div><span>DISK</span><strong>{server.status === 'running' ? '8.4 GB' : '6.2 GB'}</strong></div></div><div className="server-card-bottom"><span className={`status-pill ${server.status}`}>{server.status === 'running' ? 'Running' : 'Offline'}</span><button className="manage-button" onClick={onOpen}>Manage server <span>→</span></button></div></article>
}

export default function Page() {
  const [active, setActive] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')
  const title = active === 'dashboard' ? 'Dashboard' : active[0].toUpperCase() + active.slice(1)
  const openServer = () => { setToast('Server console opened'); window.setTimeout(() => setToast(''), 2400) }
  return <div className="panel-shell"><div className={mobileOpen ? 'sidebar-wrap open' : 'sidebar-wrap'}><Sidebar active={active} onSelect={(value) => { setActive(value); setMobileOpen(false) }} /></div><main className="main-content"><Header title={title} onMenu={() => setMobileOpen(!mobileOpen)} /><div className="content"><section className="welcome"><div><p className="eyebrow">SATURDAY, OCTOBER 25, 2026</p><h2>Good morning, Jordan<span>.</span></h2><p className="muted">Here&apos;s what&apos;s happening with your servers today.</p></div><button className="primary-button" onClick={openServer}>+ Create server</button></section><section className="stats-grid"><div className="stat-card"><div className="stat-icon blue">▣</div><div><span>Total servers</span><strong>3</strong></div><small>+1 this month</small></div><div className="stat-card"><div className="stat-icon green">↯</div><div><span>Online now</span><strong>2</strong></div><small className="healthy">All systems healthy</small></div><div className="stat-card"><div className="stat-icon orange">◒</div><div><span>Resource usage</span><strong>38%</strong></div><small>Across all servers</small></div></section><div className="section-heading"><div><h2>Your servers</h2><p className="muted">Manage and monitor your game servers.</p></div><button className="filter-button">All servers <span>⌄</span></button></div><section className="servers-grid">{servers.map(server => <ServerCard key={server.id} server={server} onOpen={openServer} />)}</section><section className="activity-panel"><div className="section-heading compact"><div><h2>Recent activity</h2><p className="muted">Your latest panel actions.</p></div><button className="text-button">View all →</button></div><div className="activity-row"><div className="activity-symbol">↻</div><div><strong>Survival SMP was restarted</strong><p>Today at 09:42 AM · by Jordan Davis</p></div><span className="activity-success">Completed</span></div><div className="activity-row"><div className="activity-symbol">↓</div><div><strong>Backup downloaded</strong><p>Yesterday at 06:18 PM · Creative Build</p></div><span className="activity-neutral">Downloaded</span></div></section></div></main>{toast && <div className="toast" role="status">{toast}</div>}</div>
}
