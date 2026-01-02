import React, { useEffect, useState } from 'react';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import Input from '../src/components/Input';
import { fetchExpenses } from '../src/mock/api';
import { Expense } from '../src/types';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>지출 관리</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '취소' : '지출 등록'}
        </Button>
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
            <Button type="submit">등록</Button>
          </form>
        </Card>
      )}

      <h2>지출 목록</h2>
      {expenses.map((expense) => (
        <Card key={expense.expense_id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 500 }}>{expense.expense_date}</span>
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              -{formatCurrency(expense.amount)}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            <div>분류: {getCategoryLabel(expense.category)}</div>
            <div>거래처: {expense.vendor_name}</div>
            <div>결제: {expense.payment_type === 'CASH' ? '현금' : expense.payment_type === 'CARD' ? '카드' : '계좌이체'}</div>
            {expense.memo && <div>메모: {expense.memo}</div>}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExpensesPage;
