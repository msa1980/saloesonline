import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CentralAtendimento from './pages/CentralAtendimento';
import { SaloesProvider } from './contexts/SaloesContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SaloesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/central-atendimento" element={<CentralAtendimento />} />
          </Routes>
        </Router>
      </SaloesProvider>
    </ThemeProvider>
  );
}

export default App;

