import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import LineChart from '../../src/components/LineChart';
import SalesNav from '../../src/components/SalesNav';
import ProtectedFeature from '../../src/components/ProtectedFeature';
import { fetchSales, fetchMonthlyTrends } from '../../src/mock/api';
import { Sale } from '../../src/types';

const SalesStatistics: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [monthlyTrends, setMonthlyTrends] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadMonthlyData();
  }, [selectedYear]);

  const loadData = async () => {
    const response = await fetchSales();
    if (response.success) {
      setSales(response.data);
    }
  };

  const loadMonthlyData = async () => {
    const response = await fetchMonthlyTrends(selectedYear);
    if (response.success) {
      setMonthlyTrends(response.data);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  // 결제 수단별 통계
  const paymentStats = sales.reduce((acc, sale) => {
    const type = sale.payment_type;
    if (!acc[type]) {
      acc[type] = { count: 0, amount: 0 };
    }
    acc[type].count += 1;
    acc[type].amount += sale.amount;
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  const getPaymentLabel = (type: string) => {
    const labels: Record<string, string> = {
      CASH: '현금',
      CARD: '카드',
      TRANSFER: '계좌이체',
    };
    return labels[type] || type;
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const averageSale = sales.length > 0 ? totalSales / sales.length : 0;

  return (
    <div>
      <h1>매출 관리</h1>
      <SalesNav />
      <ProtectedFeature featureKey="SALES_STATISTICS">
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{ margin: 0 }}>매출 통계 (PRO)</h2>
        <div style={{
          padding: '6px 12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#dc2626',
          fontWeight: 600,
        }}>
          PRO 플랜 전용
        </div>
      </div>

      {/* 요약 통계 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <Card style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            총 매출
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {formatCurrency(totalSales)}
          </div>
        </Card>

        <Card style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            평균 매출
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
            {formatCurrency(Math.round(averageSale))}
          </div>
        </Card>

        <Card style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            총 건수
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
            {sales.length}건
          </div>
        </Card>
      </div>

      {/* 결제 수단별 통계 */}
      <Card style={{ marginBottom: '24px' }}>
        <h2>결제 수단별 매출</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}>
          {Object.entries(paymentStats).map(([type, stats]) => (
            <div
              key={type}
              style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#333',
                marginBottom: '8px',
              }}>
                {getPaymentLabel(type)}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#666',
                marginBottom: '4px',
              }}>
                <span>금액</span>
                <strong style={{ color: 'var(--primary-color)' }}>
                  {formatCurrency(stats.amount)}
                </strong>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#666',
              }}>
                <span>건수</span>
                <strong style={{ color: '#333' }}>{stats.count}건</strong>
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(stats.amount / totalSales) * 100}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary-color)',
                  }} />
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginTop: '4px',
                  textAlign: 'right',
                }}>
                  {Math.round((stats.amount / totalSales) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 월별 추이 그래프 */}
      {monthlyTrends && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <h2>월별 매출 추이</h2>
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

          <Card style={{ marginBottom: '16px' }}>
            <LineChart
              data={monthlyTrends.sales}
              title="월별 매출"
              color="var(--primary-color)"
              year={monthlyTrends.year}
            />
          </Card>

          <Card>
            <LineChart
              data={monthlyTrends.receivables}
              title="월별 미수금"
              color="#f59e0b"
              year={monthlyTrends.year}
            />
          </Card>
        </div>
      )}
      </ProtectedFeature>
    </div>
  );
};

export default SalesStatistics;
