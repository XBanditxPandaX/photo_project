import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import ContactPage from "./components/ContactPage.jsx";

const savedDarkMode = localStorage.getItem('darkModeEnabled');
const shouldUseDarkMode = savedDarkMode === null
  ? window.matchMedia('(prefers-color-scheme: dark)').matches
  : savedDarkMode === 'true';
document.documentElement.dataset.theme = shouldUseDarkMode ? 'dark' : 'light';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="*" element={<App />} />
              <Route path="/contact" element={<ContactPage />} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)
