import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import MonthFilter from '../../src/components/MonthFilter';
import SalesNav from '../../src/components/SalesNav';
import { fetchReceivables } from '../../src/mock/api';
import { Receivable } from '../../src/types';

const ReceivablesPage: React.FC = () => {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  // 미수금 등록/수정 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState<Receivable | null>(null);
  const [formData, setFormData] = useState({
    sale_id: '',
    customer_name: '',
    amount: '',
    due_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchReceivables();
      if (response.success) {
        setReceivables(response.data);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const openModal = (receivable?: Receivable) => {
    if (receivable) {
      // 수정 모드
      setEditingReceivable(receivable);
      setFormData({
        sale_id: String(receivable.sale_id),
        customer_name: receivable.customer_name,
        amount: String(receivable.amount),
        due_date: receivable.due_date,
      });
    } else {
      // 등록 모드
      setEditingReceivable(null);
      setFormData({
        sale_id: '',
        customer_name: '',
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReceivable(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingReceivable) {
      // 수정
      setReceivables(prev => prev.map(recv =>
        recv.recv_id === editingReceivable.recv_id
          ? {
              ...recv,
              sale_id: Number(formData.sale_id),
              customer_name: formData.customer_name,
              amount: Number(formData.amount),
              due_date: formData.due_date,
            }
          : recv
      ));
      alert('미수금이 수정되었습니다 (Mock)');
    } else {
      // 등록
      const newReceivable: Receivable = {
        recv_id: Math.max(0, ...receivables.map(r => r.recv_id)) + 1,
        sale_id: Number(formData.sale_id),
        customer_name: formData.customer_name,
        amount: Number(formData.amount),
        due_date: formData.due_date,
        paid: false,
      };
      setReceivables(prev => [...prev, newReceivable]);
      alert('미수금이 등록되었습니다 (Mock)');
    }
    closeModal();
  };

  const handleDelete = (recvId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setReceivables(prev => prev.filter(recv => recv.recv_id !== recvId));
      alert('미수금이 삭제되었습니다 (Mock)');
    }
  };

  const handleCollect = (recvId: number) => {
    setReceivables(prev => prev.map(recv =>
      recv.recv_id === recvId
        ? { ...recv, paid: true, paid_date: new Date().toISOString().split('T')[0] }
        : recv
    ));
    alert(`미수금이 수금 처리되었습니다 (Mock)`);
  };

  const handleCancel = (recvId: number) => {
    setReceivables(prev => prev.map(recv =>
      recv.recv_id === recvId
        ? { ...recv, paid: false, paid_date: undefined }
        : recv
    ));
    alert(`수금이 취소되었습니다 (Mock)`);
  };

  const selectedMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const filteredReceivables = receivables.filter((receivable) =>
    receivable.due_date.startsWith(selectedMonthStr)
  );

  const unpaidTotal = filteredReceivables
    .filter((r) => !r.paid)
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div>
      <h1>매출 관리</h1>
      <SalesNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>미수금 관리</h2>
        <Button onClick={() => openModal()}>미수금 등록</Button>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>미수금 총액:</span>
          <strong style={{ color: 'red', fontSize: '18px' }}>
            {formatCurrency(unpaidTotal)}
          </strong>
        </div>
      </Card>

      <MonthFilter
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      <h2>미수금 목록</h2>
      {filteredReceivables.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
            {selectedYear}년 {selectedMonth}월 미수금 내역이 없습니다.
          </div>
        </Card>
      ) : (
        filteredReceivables.map((receivable) => (
          <Card key={receivable.recv_id}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: receivable.paid ? '2px solid #10b981' : '2px solid #ef4444',
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                  {receivable.customer_name}
                </div>
                {receivable.paid ? (
                  <span style={{
                    backgroundColor: '#10b981',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    수금완료
                  </span>
                ) : (
                  <span style={{
                    backgroundColor: '#fef2f2',
                    color: '#ef4444',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    미수금
                  </span>
                )}
              </div>
              <div style={{ color: receivable.paid ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '18px' }}>
                {formatCurrency(receivable.amount)}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
              <span style={{ color: '#666', fontWeight: 500 }}>수금 예정일</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{receivable.due_date}</span>

              {receivable.paid && receivable.paid_date && (
                <>
                  <span style={{ color: '#666', fontWeight: 500 }}>수금일</span>
                  <span style={{ color: '#222', fontWeight: 600 }}>{receivable.paid_date}</span>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {!receivable.paid ? (
                <Button size="small" onClick={() => handleCollect(receivable.recv_id)}>
                  수금처리
                </Button>
              ) : (
                <Button size="small" variant="secondary" onClick={() => handleCancel(receivable.recv_id)}>
                  수금취소
                </Button>
              )}
              <Button size="small" onClick={() => openModal(receivable)}>수정</Button>
              <Button size="small" variant="secondary" onClick={() => handleDelete(receivable.recv_id)}>삭제</Button>
            </div>
          </Card>
        ))
      )}

      {/* 미수금 등록/수정 모달 */}
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
                {editingReceivable ? '미수금 수정' : '미수금 등록'}
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
                  label="매출번호"
                  type="number"
                  value={formData.sale_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, sale_id: e.target.value }))}
                  placeholder="1"
                  required
                />

                <Input
                  label="고객명"
                  value={formData.customer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                  placeholder="홍길동"
                  required
                />

                <Input
                  label="미수금액"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="100000"
                  required
                />

                <Input
                  label="수금 예정일"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  required
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
                    {editingReceivable ? '수정' : '등록'}
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

export default ReceivablesPage;
