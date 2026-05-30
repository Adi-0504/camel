import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '')
const rootElement = document.getElementById('root')

try {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter basename={routerBase}>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </StrictMode>,
  )
} catch (error) {
  rootElement.innerHTML = '<main class="boot-error"><h1>Coffee Calendar OS</h1><p>The app could not start. Please refresh this page.</p></main>'
  console.error(error)
}
