import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HomiesApp } from './HomiesApp'
import { AuthProvider } from './auth/contexts/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HomiesApp />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);