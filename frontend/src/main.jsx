import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import ContactPage from "./components/ContactPage.jsx";

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
