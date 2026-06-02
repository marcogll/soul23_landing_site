import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { LanguageProvider } from './contexts/LanguageContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <CurrencyProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </BrowserRouter>
)
