import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import SalesPage from '../pages/SalesPage'
import ExpensesPage from '../pages/ExpensesPage'
import PayrollPage from '../pages/PayrollPage'
import ReceivablesPage from '../pages/ReceivablesPage'
import MonthlyReportPage from '../pages/MonthlyReportPage'
import SettingsPage from '../pages/SettingsPage'

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <li style={{ marginBottom: '8px' }}>
      <Link
        to={to}
        style={{
          display: 'block',
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
          color: isActive ? '#fff' : 'var(--text-color)',
          fontWeight: isActive ? 500 : 400,
          textDecoration: 'none',
        }}
      >
        {children}
      </Link>
    </li>
  )
}

function AppContent() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: '220px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '24px',
          color: 'var(--primary-color)',
        }}>
          관리메뉴
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <NavItem to="/">홈</NavItem>
          <NavItem to="/sales">매출 관리</NavItem>
          <NavItem to="/expenses">지출 관리</NavItem>
          <NavItem to="/receivables">미수금 관리</NavItem>
          <NavItem to="/payroll">급여 관리</NavItem>
          <NavItem to="/monthly-report">월별 정산</NavItem>
          <NavItem to="/settings">기초 설정</NavItem>
        </ul>
      </nav>
      <main style={{
        flex: 1,
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/receivables" element={<ReceivablesPage />} />
          <Route path="/monthly-report" element={<MonthlyReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
