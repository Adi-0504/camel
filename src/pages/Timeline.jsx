import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Icon } from '../components/Icons.jsx'

export function Timeline() {
  const { addTask, deleteTask, mood, moveTask, t, tasks, updateTask } = useApp()
  const [form, setForm] = useState({ title: '', time: '09:00' })
  const orderedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time))

  function submit(event) {
    event.preventDefault()
    addTask(form.title, form.time, mood)
    setForm({ title: '', time: '09:00' })
  }

  return (
    <section className="timeline-layout">
      <form className="paper-panel timeline-form" onSubmit={submit}>
        <p className="eyebrow">{t('timeline')}</p>
        <h2>{t('timelineAdd')}</h2>
        <label>
          <span>{t('title')}</span>
          <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder={t('writeTask')} />
        </label>
        <label>
          <span>{t('time')}</span>
          <input type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} />
        </label>
        <button className="primary-button" type="submit">
          {t('placeTimeline')}
        </button>
      </form>

      <div className="timeline-list" aria-label={t('orderedTasks')}>
        {orderedTasks.length === 0 ? (
          <div className="paper-panel empty-state">{t('emptyTimeline')}</div>
        ) : (
          orderedTasks.map((task) => (
            <article className="timeline-item" key={task.id}>
              <time>{task.time}</time>
              <div className="paper-panel">
                <label className="inline-edit">
                  <span>{t('task')}</span>
                  <input value={task.title} onChange={(event) => updateTask(task.id, { title: event.target.value })} />
                </label>
                <div className="timeline-actions">
                  <button className={`secondary-button ${task.completed ? 'is-active' : ''}`} type="button" onClick={() => updateTask(task.id, { completed: !task.completed })}>
                    <Icon name="check" size={16} />
                    {t('done')}
                  </button>
                  <button className="icon-button" type="button" onClick={() => moveTask(task.id, -1)} aria-label={t('moveEarlier')}>
                    <Icon name="up" />
                  </button>
                  <button className="icon-button" type="button" onClick={() => moveTask(task.id, 1)} aria-label={t('moveLater')}>
                    <Icon name="down" />
                  </button>
                  <button className="icon-button" type="button" onClick={() => deleteTask(task.id)} aria-label={t('deleteTask')}>
                    <Icon name="trash" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
