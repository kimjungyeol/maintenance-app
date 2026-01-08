import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import LineChart from '../../src/components/LineChart';
import { fetchDashboardSummary, fetchMonthlyTrends } from '../../src/mock/api';
import { DashboardSummary, MonthlyTrends } from '../../src/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary>({
    todaySales: 0,
    todayExpenses: 0,
    todayNetCash: 0,
  });
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrends | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchDashboardSummary();
      if (response.success) {
        setSummary(response.data);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadMonthlyData = async () => {
      const response = await fetchMonthlyTrends(selectedYear);
      if (response.success) {
        setMonthlyTrends(response.data);
      }
    };
    loadMonthlyData();
  }, [selectedYear]);

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
            <span>순수익:</span>
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

      {/* 월별 추이 그래프 */}
      {monthlyTrends && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            marginBottom: '16px',
          }}>
            <h2>월별 추이</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--card-radius)',
                border: '1px solid #ddd',
                fontSize: 'var(--font-base)',
                cursor: 'pointer',
              }}
            >
              <option value={2024}>2024년</option>
              <option value={2025}>2025년</option>
              <option value={2026}>2026년</option>
            </select>
          </div>
          <div className="charts-grid" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <Card style={{ width: '100%' }}>
              <div className="chart-container">
                <LineChart
                  data={monthlyTrends.sales}
                  title="매출 관리"
                  color="var(--primary-color)"
                  year={monthlyTrends.year}
                />
              </div>
            </Card>
            <Card style={{ width: '100%' }}>
              <div className="chart-container">
                <LineChart
                  data={monthlyTrends.expenses}
                  title="지출 관리"
                  color="#ef4444"
                  year={monthlyTrends.year}
                />
              </div>
            </Card>
            <Card style={{ width: '100%' }}>
              <div className="chart-container">
                <LineChart
                  data={monthlyTrends.receivables}
                  title="미수금 관리"
                  color="#f59e0b"
                  year={monthlyTrends.year}
                />
              </div>
            </Card>
            {monthlyTrends.customers && (
              <Card style={{ width: '100%' }}>
                <div className="chart-container">
                  <LineChart
                    data={monthlyTrends.customers}
                    title="고객 증가 추이"
                    color="#10b981"
                    year={monthlyTrends.year}
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
