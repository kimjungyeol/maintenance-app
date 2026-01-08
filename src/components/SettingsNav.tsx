import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SettingsNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/settings', label: '기초 설정' },
    { path: '/settings/business-hours', label: '영업시간 / 휴무일' },
    { path: '/settings/maintenance-items', label: '정비 항목 관리' },
    { path: '/settings/plan-billing', label: '플랜 / 결제 정보' },
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

export default SettingsNav;
