import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// We deleted index.css, so we don't import it anymore!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)