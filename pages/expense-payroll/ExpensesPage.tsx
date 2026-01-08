import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import MonthFilter from '../../src/components/MonthFilter';
import ExpensePayrollNav from '../../src/components/ExpensePayrollNav';
import { fetchExpenses } from '../../src/mock/api';
import { Expense } from '../../src/types';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().split('T')[0],
    category: 'PART' as const,
    vendor_name: '',
    amount: '',
    payment_type: 'CASH' as const,
    memo: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchExpenses();
      if (response.success) {
        setExpenses(response.data);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      PART: '부품',
      OUTSOURCE: '외주',
      FIXED: '고정비',
      ETC: '기타',
    };
    return labels[category] || category;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('지출이 등록되었습니다 (Mock)');
    setShowForm(false);
  };

  const handleExcelDownload = () => {
    alert('엑셀 다운로드 기능은 Mock으로 구현되었습니다.');
  };

  const selectedMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const filteredExpenses = expenses.filter((expense) =>
    expense.expense_date.startsWith(selectedMonthStr)
  );

  return (
    <div>
      <h1>지출 / 급여 관리</h1>
      <ExpensePayrollNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>지출 관리</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={handleExcelDownload}>
            엑셀 다운로드
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? '취소' : '지출 등록'}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <h2>지출 등록</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="date"
              label="지출일"
              value={formData.expense_date}
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              required
            />
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                분류 <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '32px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                  minHeight: '44px',
                }}
              >
                <option value="PART">부품</option>
                <option value="OUTSOURCE">외주</option>
                <option value="FIXED">고정비</option>
                <option value="ETC">기타</option>
              </select>
            </div>
            <Input
              label="거래처"
              value={formData.vendor_name}
              onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
              placeholder="부품상사"
              required
            />
            <Input
              type="number"
              label="금액"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0"
              required
            />
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                결제수단 <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                value={formData.payment_type}
                onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '32px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                  minHeight: '44px',
                }}
              >
                <option value="CASH">현금</option>
                <option value="CARD">카드</option>
                <option value="TRANSFER">계좌이체</option>
              </select>
            </div>
            <Input
              label="메모"
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="엔진오일 구매"
            />
            <Button type="submit" fullWidth>등록</Button>
          </form>
        </Card>
      )}

      <MonthFilter
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      <h2>지출 목록</h2>
      {filteredExpenses.map((expense) => (
        <Card key={expense.expense_id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '2px solid #ef4444' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>{expense.expense_date}</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '18px' }}>
              -{formatCurrency(expense.amount)}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#666', fontWeight: 500 }}>분류</span>
            <span style={{ color: '#222', fontWeight: 600 }}>{getCategoryLabel(expense.category)}</span>

            <span style={{ color: '#666', fontWeight: 500 }}>거래처</span>
            <span style={{ color: '#222', fontWeight: 600 }}>{expense.vendor_name}</span>

            <span style={{ color: '#666', fontWeight: 500 }}>결제수단</span>
            <span style={{ color: '#222', fontWeight: 600 }}>
              {expense.payment_type === 'CASH' ? '현금' : expense.payment_type === 'CARD' ? '카드' : '계좌이체'}
            </span>

            {expense.memo && (
              <>
                <span style={{ color: '#666', fontWeight: 500 }}>메모</span>
                <span style={{ color: '#222' }}>{expense.memo}</span>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExpensesPage;
