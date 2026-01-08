import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { PlanProvider } from './contexts/PlanContext'
// 홈
import Dashboard from '../pages/home/Dashboard'
// 스케줄 관리
import TodaySchedule from '../pages/schedule/TodaySchedule'
import BookingCreate from '../pages/schedule/BookingCreate'
import ScheduleCalendar from '../pages/schedule/ScheduleCalendar'
import WorkStatus from '../pages/schedule/WorkStatus'
// 고객 / 차량 관리
import CustomersPage from '../pages/customer-vehicle/CustomersPage'
import VehiclesPage from '../pages/customer-vehicle/VehiclesPage'
import MaintenanceHistory from '../pages/customer-vehicle/MaintenanceHistory'
// 매출 관리
import SalesPage from '../pages/sales/SalesPage'
import ReceivablesPage from '../pages/sales/ReceivablesPage'
import SalesStatistics from '../pages/sales/SalesStatistics'
// 지출 / 급여 관리
import ExpensesPage from '../pages/expense-payroll/ExpensesPage'
import PayrollPage from '../pages/expense-payroll/PayrollPage'
// 정산 / 리포트
import MonthlyReportPage from '../pages/reports/MonthlyReportPage'
import ExcelExport from '../pages/reports/ExcelExport'
import ProfitAnalysis from '../pages/reports/ProfitAnalysis'
// 설정
import SettingsPage from '../pages/settings/SettingsPage'
import BusinessHours from '../pages/settings/BusinessHours'
import MaintenanceItems from '../pages/settings/MaintenanceItems'
import PlanBilling from '../pages/settings/PlanBilling'

const NavItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void; isMobile?: boolean }> = ({ to, children, onClick, isMobile = false }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  const mobileStyle: React.CSSProperties = {
    display: 'block',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
    color: isActive ? '#fff' : 'var(--text-color)',
    fontWeight: isActive ? 500 : 400,
    textDecoration: 'none',
  }

  const desktopStyle: React.CSSProperties = {
    display: 'block',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
    color: isActive ? '#fff' : 'var(--text-color)',
    fontWeight: isActive ? 500 : 400,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <li style={{ marginBottom: isMobile ? '8px' : '0' }}>
      <Link
        to={to}
        onClick={onClick}
        style={isMobile ? mobileStyle : desktopStyle}
      >
        {children}
      </Link>
    </li>
  )
}

const HamburgerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '44px',
        height: '44px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
      }}
      aria-label="메뉴 토글"
    >
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-color)', marginBottom: '5px' }}></span>
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-color)', marginBottom: '5px' }}></span>
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-color)' }}></span>
    </button>
  )
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header container */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          minHeight: '60px',
          position: 'relative',
        }}>
          {/* Left: Menu title */}
          <div style={{
            position: 'absolute',
            left: '16px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'var(--primary-color)',
          }}>
            Bro Motors
          </div>

          {/* Center: Desktop navigation menu */}
          <nav className="desktop-only">
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}>
              <NavItem to="/">홈</NavItem>
              <NavItem to="/schedule/today">스케줄</NavItem>
              <NavItem to="/customer-vehicle/customers">고객/차량</NavItem>
              <NavItem to="/sales">매출</NavItem>
              <NavItem to="/expense-payroll/expenses">지출/급여</NavItem>
              <NavItem to="/reports/monthly">정산</NavItem>
              <NavItem to="/settings">설정</NavItem>
            </ul>
          </nav>

          {/* Right: Hamburger button (mobile only) */}
          <div className="mobile-only" style={{
            position: 'absolute',
            right: '16px',
          }}>
            <HamburgerButton onClick={toggleMenu} />
          </div>
        </header>

        {/* Mobile navigation menu (dropdown) */}
        <nav
          className="mobile-only"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: isMenuOpen ? '400px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out',
            backgroundColor: '#fff',
            borderBottom: isMenuOpen ? '1px solid #e5e7eb' : 'none',
            boxShadow: isMenuOpen ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <ul style={{
            listStyle: 'none',
            padding: '12px 16px',
            margin: 0,
          }}>
            <NavItem to="/" onClick={closeMenu} isMobile>🏠 홈</NavItem>
            <NavItem to="/schedule/today" onClick={closeMenu} isMobile>📅 스케줄 - 오늘 일정</NavItem>
            <NavItem to="/schedule/booking" onClick={closeMenu} isMobile>📅 스케줄 - 예약 등록</NavItem>
            <NavItem to="/schedule/calendar" onClick={closeMenu} isMobile>📅 스케줄 - 일정 캘린더</NavItem>
            <NavItem to="/schedule/work-status" onClick={closeMenu} isMobile>📅 스케줄 - 작업 현황판</NavItem>
            <NavItem to="/customer-vehicle/customers" onClick={closeMenu} isMobile>👤 고객 관리</NavItem>
            <NavItem to="/customer-vehicle/vehicles" onClick={closeMenu} isMobile>👤 차량 관리</NavItem>
            <NavItem to="/customer-vehicle/maintenance-history" onClick={closeMenu} isMobile>👤 정비 이력</NavItem>
            <NavItem to="/sales" onClick={closeMenu} isMobile>💰 매출 등록</NavItem>
            <NavItem to="/sales/receivables" onClick={closeMenu} isMobile>💰 미수금 관리</NavItem>
            <NavItem to="/sales/statistics" onClick={closeMenu} isMobile>💰 매출 통계 (PRO)</NavItem>
            <NavItem to="/expense-payroll/expenses" onClick={closeMenu} isMobile>📉 지출 관리</NavItem>
            <NavItem to="/expense-payroll/payroll" onClick={closeMenu} isMobile>📉 급여 관리</NavItem>
            <NavItem to="/reports/monthly" onClick={closeMenu} isMobile>📊 월별 정산</NavItem>
            <NavItem to="/reports/excel" onClick={closeMenu} isMobile>📊 엑셀 다운로드</NavItem>
            <NavItem to="/reports/profit-analysis" onClick={closeMenu} isMobile>📊 수익 분석 (PRO)</NavItem>
            <NavItem to="/settings" onClick={closeMenu} isMobile>⚙ 기초 설정</NavItem>
            <NavItem to="/settings/business-hours" onClick={closeMenu} isMobile>⚙ 영업시간 / 휴무일</NavItem>
            <NavItem to="/settings/maintenance-items" onClick={closeMenu} isMobile>⚙ 정비 항목 관리</NavItem>
            <NavItem to="/settings/plan-billing" onClick={closeMenu} isMobile>⚙ 플랜 / 결제 정보</NavItem>
          </ul>
        </nav>
      </div>

      {/* Page content */}
      <main style={{
        flex: 1,
        padding: '24px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
      }}>
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<Dashboard />} />

          {/* 스케줄 관리 */}
          <Route path="/schedule/today" element={<TodaySchedule />} />
          <Route path="/schedule/booking" element={<BookingCreate />} />
          <Route path="/schedule/calendar" element={<ScheduleCalendar />} />
          <Route path="/schedule/work-status" element={<WorkStatus />} />

          {/* 고객 / 차량 관리 */}
          <Route path="/customer-vehicle/customers" element={<CustomersPage />} />
          <Route path="/customer-vehicle/vehicles" element={<VehiclesPage />} />
          <Route path="/customer-vehicle/maintenance-history" element={<MaintenanceHistory />} />

          {/* 매출 관리 */}
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/receivables" element={<ReceivablesPage />} />
          <Route path="/sales/statistics" element={<SalesStatistics />} />

          {/* 지출 / 급여 관리 */}
          <Route path="/expense-payroll/expenses" element={<ExpensesPage />} />
          <Route path="/expense-payroll/payroll" element={<PayrollPage />} />

          {/* 정산 / 리포트 */}
          <Route path="/reports/monthly" element={<MonthlyReportPage />} />
          <Route path="/reports/excel" element={<ExcelExport />} />
          <Route path="/reports/profit-analysis" element={<ProfitAnalysis />} />

          {/* 설정 */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/business-hours" element={<BusinessHours />} />
          <Route path="/settings/maintenance-items" element={<MaintenanceItems />} />
          <Route path="/settings/plan-billing" element={<PlanBilling />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <PlanProvider>
        <AppContent />
      </PlanProvider>
    </Router>
  )
}

export default App
