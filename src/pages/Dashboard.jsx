import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Icon } from '../components/Icons.jsx'

const moods = [
  { id: 'latte', label: 'latte', note: 'latteNote' },
  { id: 'espresso', label: 'espresso', note: 'espressoNote' },
  { id: 'iced', label: 'iced', note: 'icedNote' },
  { id: 'cocoa', label: 'cocoa', note: 'cocoaNote' },
]

export function Dashboard() {
  const { addTask, language, mood, setMood, t, tasks, updateTask } = useApp()
  const [title, setTitle] = useState('')
  const previewTasks = useMemo(
    () => [...tasks].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 3),
    [tasks],
  )

  function submit(event) {
    event.preventDefault()
    addTask(title)
    setTitle('')
  }

  return (
    <section className="page-grid">
      <div className="paper-panel wide-panel">
        <p className="eyebrow">{new Intl.DateTimeFormat(language, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p>
        <h2>{t('todayQuestion')}</h2>
        <div className="mood-grid">
          {moods.map((item) => (
            <button key={item.id} className={`mood-card ${mood === item.id ? 'is-selected' : ''}`} type="button" onClick={() => setMood(item.id)}>
              <span>{t(item.label)}</span>
              <small>{t(item.note)}</small>
            </button>
          ))}
        </div>
      </div>

      <form className="paper-panel quick-add" onSubmit={submit}>
        <p className="eyebrow">{t('quickAdd')}</p>
        <label>
          <span>{t('task')}</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('taskPlaceholder')} />
        </label>
        <button className="primary-button" type="submit">
          {t('addToday')}
        </button>
      </form>

      <div className="paper-panel task-preview">
        <p className="eyebrow">{t('priorityThree')}</p>
        <h2>{t('nextCups')}</h2>
        {previewTasks.length === 0 ? (
          <p className="empty-state">{t('emptyDashboard')}</p>
        ) : (
          <ul className="task-list">
            {previewTasks.map((task) => (
              <li key={task.id}>
                <button className={`check-button ${task.completed ? 'is-done' : ''}`} type="button" onClick={() => updateTask(task.id, { completed: !task.completed })} aria-label={t('toggleTask')}>
                  {task.completed && <Icon name="check" size={16} />}
                </button>
                <div>
                  <strong>{task.title}</strong>
                  <small>{task.time} / {t(task.moodTag)}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
