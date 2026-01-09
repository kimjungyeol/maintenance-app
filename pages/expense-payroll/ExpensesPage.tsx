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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
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

  const openModal = (expense?: Expense) => {
    if (expense) {
      // 수정 모드
      setEditingExpense(expense);
      setFormData({
        expense_date: expense.expense_date,
        category: expense.category,
        vendor_name: expense.vendor_name,
        amount: String(expense.amount),
        payment_type: expense.payment_type,
        memo: expense.memo || '',
      });
    } else {
      // 등록 모드
      setEditingExpense(null);
      setFormData({
        expense_date: new Date().toISOString().split('T')[0],
        category: 'PART' as const,
        vendor_name: '',
        amount: '',
        payment_type: 'CASH' as const,
        memo: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingExpense) {
      // 수정
      setExpenses(prev => prev.map(exp =>
        exp.expense_id === editingExpense.expense_id
          ? {
              ...exp,
              expense_date: formData.expense_date,
              category: formData.category,
              vendor_name: formData.vendor_name,
              amount: Number(formData.amount),
              payment_type: formData.payment_type,
              memo: formData.memo,
            }
          : exp
      ));
      alert('지출이 수정되었습니다 (Mock)');
    } else {
      // 등록
      const newExpense: Expense = {
        expense_id: Math.max(0, ...expenses.map(e => e.expense_id)) + 1,
        expense_date: formData.expense_date,
        category: formData.category,
        vendor_name: formData.vendor_name,
        amount: Number(formData.amount),
        payment_type: formData.payment_type,
        memo: formData.memo,
      };
      setExpenses(prev => [...prev, newExpense]);
      alert('지출이 등록되었습니다 (Mock)');
    }
    closeModal();
  };

  const handleDelete = (expenseId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setExpenses(prev => prev.filter(exp => exp.expense_id !== expenseId));
      alert('지출이 삭제되었습니다 (Mock)');
    }
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
        <Button onClick={() => openModal()}>
          지출 등록
        </Button>
      </div>

      <MonthFilter
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      <h2>지출 목록</h2>
      {filteredExpenses.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
            {selectedYear}년 {selectedMonth}월 지출 내역이 없습니다.
          </div>
        </Card>
      ) : (
        filteredExpenses.map((expense) => (
          <Card key={expense.expense_id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '2px solid #ef4444' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>{expense.expense_date}</span>
              <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '18px' }}>
                -{formatCurrency(expense.amount)}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small" onClick={() => openModal(expense)}>수정</Button>
              <Button size="small" variant="secondary" onClick={() => handleDelete(expense.expense_id)}>삭제</Button>
            </div>
          </Card>
        ))
      )}

      {/* 지출 등록/수정 모달 */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* 헤더 - 고정 영역 */}
            <div style={{
              padding: '24px',
              borderBottom: '2px solid #e5e7eb',
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                {editingExpense ? '지출 수정' : '지출 등록'}
              </h2>
              <button
                onClick={closeModal}
                type="button"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#666',
                  fontSize: '20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* 폼 영역 - 스크롤 가능 */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
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
              </div>

              {/* 버튼 영역 - 고정 */}
              <div style={{
                padding: '24px',
                borderTop: '2px solid #e5e7eb',
                flexShrink: 0,
                backgroundColor: '#fff',
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button type="submit" fullWidth>
                    {editingExpense ? '수정' : '등록'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={closeModal}>
                    취소
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
