import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import { fetchDashboardSummary } from '../src/mock/api';
import { DashboardSummary } from '../src/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary>({
    todaySales: 0,
    todayExpenses: 0,
    todayNetCash: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchDashboardSummary();
      if (response.success) {
        setSummary(response.data);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  return (
    <div>
      <h1>홈</h1>

      <Card>
        <h2>오늘의 요약</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>오늘 매출:</span>
            <strong style={{ color: 'var(--primary-color)' }}>
              {formatCurrency(summary.todaySales)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>오늘 지출:</span>
            <strong style={{ color: 'red' }}>
              {formatCurrency(summary.todayExpenses)}
            </strong>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #eee',
            paddingTop: '12px',
          }}>
            <span>순현금:</span>
            <strong style={{
              color: summary.todayNetCash >= 0 ? 'var(--primary-color)' : 'red',
              fontSize: '18px',
            }}>
              {formatCurrency(summary.todayNetCash)}
            </strong>
          </div>
        </div>
      </Card>

      <Card>
        <h2>빠른 등록</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => navigate('/sales')}>매출 등록</Button>
          <Button variant="secondary" onClick={() => navigate('/expenses')}>
            지출 등록
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
