import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import './mobile.css'
import App from './App.jsx'

AOS.init({ duration: 600, easing: 'ease-out-cubic', once: true, offset: 60 });

// Promptly activate fresh app code after a deployment instead of leaving an
// already-open PWA tab on an older cached route table.
if ('serviceWorker' in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistration()
      .then((registration) => registration?.update())
      .catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
