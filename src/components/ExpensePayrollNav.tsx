import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ExpensePayrollNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/expense-payroll/expenses', label: '지출 관리' },
    { path: '/expense-payroll/payroll', label: '급여 관리' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      borderBottom: '2px solid #e5e7eb',
      marginBottom: '24px',
      overflowX: 'auto',
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '12px 16px',
              textDecoration: 'none',
              color: isActive ? 'var(--primary-color)' : '#666',
              fontWeight: isActive ? 600 : 400,
              borderBottom: isActive ? '2px solid var(--primary-color)' : '2px solid transparent',
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default ExpensePayrollNav;
