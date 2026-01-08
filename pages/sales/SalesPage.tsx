import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import MonthFilter from '../../src/components/MonthFilter';
import SalesNav from '../../src/components/SalesNav';
import { fetchSales } from '../../src/mock/api';
import { Sale } from '../../src/types';

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [formData, setFormData] = useState({
    sale_date: new Date().toISOString().split('T')[0],
    amount: '',
    payment_type: 'CASH' as const,
    car_number: '',
    customer_name: '',
    memo: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchSales();
      if (response.success) {
        setSales(response.data);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('매출이 등록되었습니다 (Mock)');
    setShowForm(false);
  };

  const handleExcelDownload = () => {
    alert('엑셀 다운로드 기능은 Mock으로 구현되었습니다.');
  };

  const selectedMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const filteredSales = sales.filter((sale) =>
    sale.sale_date.startsWith(selectedMonthStr)
  );

  return (
    <div>
      <h1>매출 관리</h1>
      <SalesNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>매출 등록</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={handleExcelDownload}>
            엑셀 다운로드
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? '취소' : '매출 등록'}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <h2>매출 등록</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="date"
              label="매출일"
              value={formData.sale_date}
              onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
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
              label="차량번호"
              value={formData.car_number}
              onChange={(e) => setFormData({ ...formData, car_number: e.target.value })}
              placeholder="12가3456"
            />
            <Input
              label="고객명"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="홍길동"
            />
            <Input
              label="메모"
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="엔진오일 교체"
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

      <h2>매출 목록</h2>
      {filteredSales.map((sale) => (
        <Card key={sale.sale_id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-color)' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>{sale.sale_date}</span>
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '18px' }}>
              {formatCurrency(sale.amount)}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', fontSize: '14px' }}>
            {sale.customer_name && (
              <>
                <span style={{ color: '#666', fontWeight: 500 }}>고객</span>
                <span style={{ color: '#222', fontWeight: 600 }}>{sale.customer_name}</span>
              </>
            )}
            {sale.car_number && (
              <>
                <span style={{ color: '#666', fontWeight: 500 }}>차량번호</span>
                <span style={{ color: '#222', fontWeight: 600 }}>{sale.car_number}</span>
              </>
            )}
            <span style={{ color: '#666', fontWeight: 500 }}>결제수단</span>
            <span style={{ color: '#222', fontWeight: 600 }}>
              {sale.payment_type === 'CASH' ? '현금' : sale.payment_type === 'CARD' ? '카드' : '계좌이체'}
            </span>
            {sale.memo && (
              <>
                <span style={{ color: '#666', fontWeight: 500 }}>메모</span>
                <span style={{ color: '#222' }}>{sale.memo}</span>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SalesPage;
