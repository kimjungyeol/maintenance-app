import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ScheduleNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/schedule/today', label: '오늘 일정' },
    { path: '/schedule/booking', label: '예약 등록' },
    { path: '/schedule/work-status', label: '작업 현황판' },
    { path: '/schedule/calendar', label: '일정 캘린더' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '8px',
      overflowX: 'auto',
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '8px 16px',
              borderRadius: '8px 8px 0 0',
              backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-color)',
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              fontSize: '14px',
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

export default ScheduleNav;
