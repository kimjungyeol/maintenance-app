import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import ReportsNav from '../../src/components/ReportsNav';
import { fetchSales, fetchExpenses } from '../../src/mock/api';
import { Sale, Expense } from '../../src/types';

const MonthlyReportPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const loadData = async () => {
      const [salesResponse, expensesResponse] = await Promise.all([
        fetchSales(),
        fetchExpenses(),
      ]);
      if (salesResponse.success) setSales(salesResponse.data);
      if (expensesResponse.success) setExpenses(expensesResponse.data);
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const monthlySales = sales
    .filter((s) => s.sale_date.startsWith(selectedMonth))
    .reduce((sum, s) => sum + s.amount, 0);

  const monthlyExpenses = expenses
    .filter((e) => e.expense_date.startsWith(selectedMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyProfit = monthlySales - monthlyExpenses;

  const handleDownload = () => {
    alert('엑셀 다운로드 기능 (Mock)');
  };

  return (
    <div>
      <h1>정산 / 리포트</h1>
      <ReportsNav />

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          조회 월
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            paddingRight: '32px',
            borderRadius: 'var(--card-radius)',
            border: '1px solid #ddd',
            fontSize: 'var(--font-base)',
            minHeight: '44px',
          }}
        />
      </div>

      <Card>
        <h2>월간 요약</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>월 매출:</span>
            <strong style={{ color: 'var(--primary-color)' }}>
              {formatCurrency(monthlySales)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>월 지출:</span>
            <strong style={{ color: 'red' }}>
              {formatCurrency(monthlyExpenses)}
            </strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #eee',
              paddingTop: '12px',
            }}
          >
            <span>순이익:</span>
            <strong
              style={{
                color: monthlyProfit >= 0 ? 'var(--primary-color)' : 'red',
                fontSize: '18px',
              }}
            >
              {formatCurrency(monthlyProfit)}
            </strong>
          </div>
        </div>
      </Card>

      <Card>
        <h2>리포트 다운로드</h2>
        <Button onClick={handleDownload} fullWidth>엑셀 다운로드</Button>
      </Card>
    </div>
  );
};

export default MonthlyReportPage;
