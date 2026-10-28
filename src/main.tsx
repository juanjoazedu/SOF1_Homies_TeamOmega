import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HomiesApp } from './HomiesApp'
import './shared/css/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HomiesApp />
    </BrowserRouter>
  </StrictMode>,
)