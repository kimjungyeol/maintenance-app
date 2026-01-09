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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
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

  const openModal = (sale?: Sale) => {
    if (sale) {
      // 수정 모드
      setEditingSale(sale);
      setFormData({
        sale_date: sale.sale_date,
        amount: String(sale.amount),
        payment_type: sale.payment_type,
        car_number: sale.car_number || '',
        customer_name: sale.customer_name || '',
        memo: sale.memo || '',
      });
    } else {
      // 등록 모드
      setEditingSale(null);
      setFormData({
        sale_date: new Date().toISOString().split('T')[0],
        amount: '',
        payment_type: 'CASH' as const,
        car_number: '',
        customer_name: '',
        memo: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSale(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSale) {
      // 수정
      setSales(prev => prev.map(sale =>
        sale.sale_id === editingSale.sale_id
          ? {
              ...sale,
              sale_date: formData.sale_date,
              amount: Number(formData.amount),
              payment_type: formData.payment_type,
              car_number: formData.car_number,
              customer_name: formData.customer_name,
              memo: formData.memo,
            }
          : sale
      ));
      alert('매출이 수정되었습니다 (Mock)');
    } else {
      // 등록
      const newSale: Sale = {
        sale_id: Math.max(0, ...sales.map(s => s.sale_id)) + 1,
        sale_date: formData.sale_date,
        amount: Number(formData.amount),
        payment_type: formData.payment_type,
        car_number: formData.car_number,
        customer_name: formData.customer_name,
        memo: formData.memo,
      };
      setSales(prev => [...prev, newSale]);
      alert('매출이 등록되었습니다 (Mock)');
    }
    closeModal();
  };

  const handleDelete = (saleId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setSales(prev => prev.filter(sale => sale.sale_id !== saleId));
      alert('매출이 삭제되었습니다 (Mock)');
    }
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
        <Button onClick={() => openModal()}>
          매출 등록
        </Button>
      </div>

      <MonthFilter
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      <h2>매출 목록</h2>
      {filteredSales.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
            {selectedYear}년 {selectedMonth}월 매출 내역이 없습니다.
          </div>
        </Card>
      ) : (
        filteredSales.map((sale) => (
          <Card key={sale.sale_id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-color)' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>{sale.sale_date}</span>
              <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '18px' }}>
                {formatCurrency(sale.amount)}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small" onClick={() => openModal(sale)}>수정</Button>
              <Button size="small" variant="secondary" onClick={() => handleDelete(sale.sale_id)}>삭제</Button>
            </div>
          </Card>
        ))
      )}

      {/* 매출 등록/수정 모달 */}
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
                {editingSale ? '매출 수정' : '매출 등록'}
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
                    {editingSale ? '수정' : '등록'}
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

export default SalesPage;
