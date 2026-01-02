import React, { useEffect, useState } from 'react';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import Input from '../src/components/Input';
import { fetchSales } from '../src/mock/api';
import { Sale } from '../src/types';

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>매출 관리</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '취소' : '매출 등록'}
        </Button>
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
            <Button type="submit">등록</Button>
          </form>
        </Card>
      )}

      <h2>매출 목록</h2>
      {sales.map((sale) => (
        <Card key={sale.sale_id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 500 }}>{sale.sale_date}</span>
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
              {formatCurrency(sale.amount)}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            {sale.customer_name && <div>고객: {sale.customer_name}</div>}
            {sale.car_number && <div>차량: {sale.car_number}</div>}
            <div>결제: {sale.payment_type === 'CASH' ? '현금' : sale.payment_type === 'CARD' ? '카드' : '계좌이체'}</div>
            {sale.memo && <div>메모: {sale.memo}</div>}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SalesPage;
