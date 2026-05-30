import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Icon } from './Icons.jsx'

export function GoogleAuth() {
  const {
    completeSupabaseLogin,
    language,
    setLanguage,
    signIn,
    signInWithSupabaseGoogle,
    signOut,
    t,
    user,
  } = useApp()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    completeSupabaseLogin()
      .then((result) => {
        if (result.ok) setStatus(t('signedSupabase'))
        if (result.messageKey) setStatus(t(result.messageKey))
      })
      .catch(() => setStatus(t('supabaseCallbackError')))
  }, [completeSupabaseLogin, t])

  function signInWithGoogle() {
    const result = signInWithSupabaseGoogle()
    if (result.messageKey) setStatus(t(result.messageKey))
  }

  function useGuest() {
    signIn({
      id: 'guest',
      name: 'Guest barista',
      email: 'local profile',
      picture: '',
      provider: 'guest',
    })
    setStatus(t('signedGuest'))
    setOpen(false)
  }

  return (
    <section className="auth-panel">
      <button className="icon-button" type="button" onClick={() => setOpen((value) => !value)} aria-label={t('profileSettings')}>
        <Icon name="user" />
      </button>
      {user && (
        <div className="profile-chip">
          {user.picture ? <img src={user.picture} alt="" /> : <span>{user.name.slice(0, 1)}</span>}
          <small>{user.id === 'guest' ? t('guest') : t('supabase')}</small>
        </div>
      )}
      {open && (
        <>
          <button className="modal-backdrop" type="button" onClick={() => setOpen(false)} aria-label={t('closeNav')} />
          <div className="settings-popover" role="dialog" aria-modal="true" aria-labelledby="profile-title">
            <div className="modal-title-row">
              <div>
                <p className="eyebrow">{t('profile')}</p>
                <h2 id="profile-title">{user ? user.name : t('signIn')}</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label={t('closeNav')}>
                <Icon name="close" />
              </button>
            </div>
            {!user && <p className="small-copy">{t('supabaseOAuthHelp')}</p>}
            <label>
              <span>{t('language')}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="zh-TW">{t('zhTw')}</option>
                <option value="en">{t('english')}</option>
              </select>
            </label>
            <div className="button-row">
              {user ? (
                <button className="secondary-button" type="button" onClick={signOut}>
                  {t('signOut')}
                </button>
              ) : (
                <button className="secondary-button" type="button" onClick={useGuest}>
                  {t('guestMode')}
                </button>
              )}
            </div>
            {!user && (
              <button className="primary-button" type="button" onClick={signInWithGoogle}>
                {t('continueGoogle')}
              </button>
            )}
            {status && <p className="small-copy">{status}</p>}
          </div>
        </>
      )}
    </section>
  )
}
