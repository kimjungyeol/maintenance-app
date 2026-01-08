import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import MonthFilter from '../../src/components/MonthFilter';
import SalesNav from '../../src/components/SalesNav';
import { fetchReceivables } from '../../src/mock/api';
import { Receivable } from '../../src/types';

const ReceivablesPage: React.FC = () => {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

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

  const handleCollect = (recvId: number) => {
    alert(`미수금 ${recvId}번이 수금 처리되었습니다 (Mock)`);
  };

  const handleCancel = (recvId: number) => {
    alert(`미수금 ${recvId}번의 수금이 취소되었습니다 (Mock)`);
  };

  const handleExcelDownload = () => {
    alert('엑셀 다운로드 기능은 Mock으로 구현되었습니다.');
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
        <Button variant="secondary" onClick={handleExcelDownload}>
          엑셀 다운로드
        </Button>
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
      {filteredReceivables.map((receivable) => (
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
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '14px', marginBottom: receivable.paid ? '12px' : '0' }}>
            <span style={{ color: '#666', fontWeight: 500 }}>수금 예정일</span>
            <span style={{ color: '#222', fontWeight: 600 }}>{receivable.due_date}</span>

            {receivable.paid && receivable.paid_date && (
              <>
                <span style={{ color: '#666', fontWeight: 500 }}>수금일</span>
                <span style={{ color: '#222', fontWeight: 600 }}>{receivable.paid_date}</span>
              </>
            )}
          </div>
          {!receivable.paid ? (
            <div style={{ marginTop: '12px', width: '104px' }}>
              <Button onClick={() => handleCollect(receivable.recv_id)} fullWidth>
                수금처리
              </Button>
            </div>
          ) : (
            <div style={{ marginTop: '12px', width: '104px' }}>
              <Button variant="secondary" onClick={() => handleCancel(receivable.recv_id)} fullWidth>
                취소
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ReceivablesPage;
