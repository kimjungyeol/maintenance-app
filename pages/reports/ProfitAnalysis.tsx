import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import LineChart from '../../src/components/LineChart';
import ReportsNav from '../../src/components/ReportsNav';
import ProtectedFeature from '../../src/components/ProtectedFeature';
import { fetchSales, fetchExpenses, fetchPayrolls, fetchMonthlyTrends } from '../../src/mock/api';
import { Sale, Expense, Payroll } from '../../src/types';

const ProfitAnalysis: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [monthlyTrends, setMonthlyTrends] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadMonthlyData();
  }, [selectedYear]);

  const loadData = async () => {
    const [salesRes, expensesRes, payrollsRes] = await Promise.all([
      fetchSales(),
      fetchExpenses(),
      fetchPayrolls(),
    ]);

    if (salesRes.success) setSales(salesRes.data);
    if (expensesRes.success) setExpenses(expensesRes.data);
    if (payrollsRes.success) setPayrolls(payrollsRes.data);
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

  // 총 매출/지출/급여 계산
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPayroll = payrolls.reduce((sum, payroll) => sum + payroll.pay_amount, 0);
  const totalCost = totalExpenses + totalPayroll;
  const netProfit = totalSales - totalCost;
  const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  // 지출 카테고리별 분석
  const expenseByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      PART: '부품',
      OUTSOURCE: '외주',
      FIXED: '고정비',
      ETC: '기타',
    };
    return labels[category] || category;
  };

  // 월별 수익 데이터 계산
  const monthlyProfitData = monthlyTrends ? monthlyTrends.sales.map((item: any, index: number) => ({
    month: item.month,
    value: item.value - monthlyTrends.expenses[index].value,
  })) : [];

  return (
    <div>
      <style>{`
        .profit-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .profit-charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <h1>정산 / 리포트</h1>
      <ReportsNav />
      <ProtectedFeature featureKey="PROFIT_ANALYSIS">
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{ margin: 0 }}>수익 분석 (PRO)</h2>
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

      {/* 핵심 지표 */}
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

        <Card style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            총 비용
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>
            {formatCurrency(totalCost)}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            지출 {formatCurrency(totalExpenses)} + 급여 {formatCurrency(totalPayroll)}
          </div>
        </Card>

        <Card style={{ borderLeft: `4px solid ${netProfit >= 0 ? '#10b981' : '#ef4444'}` }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            순이익
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: netProfit >= 0 ? '#10b981' : '#ef4444',
          }}>
            {formatCurrency(netProfit)}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            수익률: {profitMargin.toFixed(1)}%
          </div>
        </Card>
      </div>

      {/* 비용 구조 분석 */}
      <Card style={{ marginBottom: '24px' }}>
        <h2>비용 구조 분석</h2>
        <div style={{ marginTop: '16px' }}>
          {/* 지출 vs 급여 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                지출
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                {formatCurrency(totalExpenses)}
              </div>
              <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                전체 비용의 {Math.round((totalExpenses / totalCost) * 100)}%
              </div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                급여
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                {formatCurrency(totalPayroll)}
              </div>
              <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                전체 비용의 {Math.round((totalPayroll / totalCost) * 100)}%
              </div>
            </div>
          </div>

          {/* 지출 카테고리별 */}
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>지출 카테고리별</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {Object.entries(expenseByCategory).map(([category, amount]) => (
              <div
                key={category}
                style={{
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                    {getCategoryLabel(category)}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444' }}>
                    {formatCurrency(amount)}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(amount / totalExpenses) * 100}%`,
                    height: '100%',
                    backgroundColor: '#ef4444',
                  }} />
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '4px',
                  textAlign: 'right',
                }}>
                  {Math.round((amount / totalExpenses) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 월별 수익 추이 */}
      {monthlyTrends && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <h2>월별 수익 추이</h2>
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
              data={monthlyProfitData}
              title="월별 순이익"
              color="#10b981"
              year={monthlyTrends.year}
            />
          </Card>

          <div className="profit-charts-grid">
            <Card>
              <LineChart
                data={monthlyTrends.sales}
                title="월별 매출"
                color="var(--primary-color)"
                year={monthlyTrends.year}
              />
            </Card>

            <Card>
              <LineChart
                data={monthlyTrends.expenses}
                title="월별 지출"
                color="#ef4444"
                year={monthlyTrends.year}
              />
            </Card>

            <Card>
              <LineChart
                data={monthlyTrends.receivables}
                title="미수금 관리"
                color="#f59e0b"
                year={monthlyTrends.year}
              />
            </Card>

            {monthlyTrends.customers && (
              <Card>
                <LineChart
                  data={monthlyTrends.customers}
                  title="고객 증가 추이"
                  color="#10b981"
                  year={monthlyTrends.year}
                />
              </Card>
            )}
          </div>
        </div>
      )}
      </ProtectedFeature>
    </div>
  );
};

export default ProfitAnalysis;
