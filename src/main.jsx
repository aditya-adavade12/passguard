import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App.jsx'
const secretKey = import.meta.env.VITE_SECRET_KEY;

createRoot(document.getElementById('root')).render(
    <App />
)
