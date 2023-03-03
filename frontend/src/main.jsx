import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {XR} from './components/XR'
import './index.css'

console.log("window", window);

if (window.location.pathname === '/xr') {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <div><XR /></div>
  );

} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
