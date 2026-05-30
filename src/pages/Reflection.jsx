import { useApp } from '../context/AppContext.jsx'

export function Reflection() {
  const { reflections, setReflection, stats, t, todayKey } = useApp()
  const journal = reflections[todayKey] || ''
  const total = Math.max(1, stats.completed + stats.open)

  return (
    <section className="reflection-layout">
      <div className="paper-panel journal-panel">
        <p className="eyebrow">{t('dailyReflection')}</p>
        <h2>{t('tasteQuestion')}</h2>
        <textarea value={journal} onChange={(event) => setReflection(event.target.value)} placeholder={t('journalPlaceholder')} />
      </div>
      <div className="paper-panel metrics-panel">
        <p className="eyebrow">{t('recap')}</p>
        <h2>{t('softMetrics')}</h2>
        <div className="metric-grid">
          <div>
            <strong>{stats.completed}</strong>
            <span>{t('complete')}</span>
          </div>
          <div>
            <strong>{stats.open}</strong>
            <span>{t('open')}</span>
          </div>
          <div>
            <strong>{stats.coffeeTime}</strong>
            <span>{t('minutes')}</span>
          </div>
        </div>
        <div className="bars">
          <div>
            <span>{t('completed')}</span>
            <meter min="0" max="100" value={(stats.completed / total) * 100} />
          </div>
          {Object.entries(stats.moodCounts).map(([mood, count]) => (
            <div key={mood}>
              <span>{t(mood)}</span>
              <meter min="0" max={total} value={count} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
