import { Navigate, Route, Routes } from 'react-router-dom'
import { GoogleAuth } from './components/GoogleAuth.jsx'
import { Navigation } from './components/Navigation.jsx'
import { useApp } from './context/AppContext.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Reflection } from './pages/Reflection.jsx'
import { Timeline } from './pages/Timeline.jsx'

function App() {
  const { mood, t, user } = useApp()

  return (
    <div className={`app-shell theme-${mood}`}>
      <Navigation />
      <main className="screen" aria-label={t('appName')}>
        <header className="topbar">
          <div>
            <p className="eyebrow">{t('appName')}</p>
            <h1>{user ? t('greeting', { name: user.name.split(' ')[0] }) : t('fallbackTitle')}</h1>
          </div>
          <GoogleAuth />
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
